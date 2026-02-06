import React, { useState, useEffect } from 'react';

// Parse CSV and group by partyId
const parseGuestsCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, i) => {
      obj[header.trim()] = values[i]?.trim() || '';
      return obj;
    }, {});
  });

  // Group by partyId (skip empty rows)
  const partiesMap = {};
  rows.forEach(row => {
    if (!row.partyId || !row.partyId.trim()) return; // Skip empty rows
    if (!partiesMap[row.partyId]) {
      partiesMap[row.partyId] = {
        partyId: row.partyId,
        household: row.household,
        members: [],
        maxGuests: parseInt(row.maxGuests) || 1,
        lang: row.lang || 'es'
      };
    }
    partiesMap[row.partyId].members.push({
      name: row.name,
      phone: row.phone,
      lang: row.lang || 'es'
    });
  });

  return Object.values(partiesMap);
};

const C = {
  // Friendlier primary blue (softer + slightly warmer than #073D61)
  blue: '#05111A',

  blueDark: '#234B60',
  blueLight: '#05111A',
  bluePale: '#05111A',

  cream: '#DED9C5',
  creamDark: '#DED9C5',
  creamDifferent: '#e0dac3',

  gold: '#D4C4A8',
  goldLight: '#be862b',
  goldDark: '#B8A888',

  text: '#5E6F7E',

  blueA: (a) => `rgba(46,94,120,${a})`,
};


const FONTS = {
  body: "'Edu SA Hand', cursive",
};

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycby1ZC5-iwuYizex1MeOoKATXLBLbPqN06t3XThz0O8u_g46niWQ_Fl-L2ePFxHA4VxE/exec';

const MIN_INTRO_MS = 1500; // try 700–1200

const COUNTRY_CODES = [
  { code: '+1', label: 'US/CA +1' },
  { code: '+52', label: 'MX +52' },
  { code: '+34', label: 'ES +34' },
  { code: '+44', label: 'UK +44' },
  { code: '+33', label: 'FR +33' },
  { code: '+49', label: 'DE +49' },
  { code: '+39', label: 'IT +39' },
  { code: '+55', label: 'BR +55' },
  { code: '+57', label: 'CO +57' },
  { code: '+54', label: 'AR +54' },
  { code: '+56', label: 'CL +56' },
  { code: '+51', label: 'PE +51' },
  { code: '+505', label: 'NI +505' },
  { code: '+46', label: 'SE +46' },
];

const norm = (s) =>
  (s || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/\s+/g, " ");

const normPhone = (s) => (s || "").replace(/\D/g, ""); // strip non-digits

// Check if names are similar enough (fuzzy match)
const namesMatch = (inputName, memberName) => {
  const input = norm(inputName);
  const member = norm(memberName);

  // Exact match
  if (input === member) return true;

  // Input contains member name or vice versa
  if (input.includes(member) || member.includes(input)) return true;

  // Check if first or last name matches
  const inputParts = input.split(' ').filter(p => p.length > 1);
  const memberParts = member.split(' ').filter(p => p.length > 1);

  // At least one significant word matches
  const hasMatchingPart = inputParts.some(ip =>
    memberParts.some(mp => ip === mp || ip.includes(mp) || mp.includes(ip))
  );

  return hasMatchingPart;
};

const findPartyByNameAndPhone = (parties, fullName, countryCode, phone) => {
  const fullPhone = normPhone(countryCode + phone);

  // First, find by phone number (primary match)
  const partyByPhone = parties.find(party =>
    party.members.some(member => normPhone(member.phone) === fullPhone)
  );

  if (partyByPhone) {
    // Check if name is close enough to any member
    const matchingMember = partyByPhone.members.find(member =>
      normPhone(member.phone) === fullPhone && namesMatch(fullName, member.name)
    );
    if (matchingMember) {
      return { party: partyByPhone, matchedMember: matchingMember };
    }
  }

  // Fallback: exact name match for any guest
  const normalizedInput = norm(fullName);
  for (const party of parties) {
    const matchingMember = party.members.find(member =>
      norm(member.name) === normalizedInput
    );
    if (matchingMember) {
      return { party, matchedMember: matchingMember };
    }
  }

  return null;
};

const NAV_TARGETS = {
  es: [
    { label: "RSVP", href: "#s0" },
    { label: "Itinerario", href: "#s1" },
    { label: "Hospedaje", href: "#s2" },
    { label: "Transporte", href: "#transport" },
    { label: "Vestimenta", href: "#s3" },
    { label: "Historia", href: "#s4" },
    { label: "Regalos", href: "#gifts" },
    { label: "FAQ", href: "#faq" },
  ],
  en: [
    { label: "RSVP", href: "#s0" },
    { label: "Itinerary", href: "#s1" },
    { label: "Stay", href: "#s2" },
    { label: "Transportation", href: "#transport" },
    { label: "Dress Code", href: "#s3" },
    { label: "Story", href: "#s4" },
    { label: "Gifts", href: "#gifts" },
    { label: "FAQ", href: "#faq" },
  ],
};

// --- Preload helpers ---
const collectImageUrls = () => {
  const urls = new Set();

  // Always include these:
  const always = [
    "/images/mjc_doodle_dancing_dark_blue.png",
    "/images/mjc_doodle_names_dark_blue.png",
    "/images/cordoba_watercolor.png",
    "/images/mjc_couple_vineyard_bw.jpg",
    "/images/mjc_couple_portrait.jpg",
    "/images/mjc_ring_bw.jpg",
    "/images/mjc_cordoba_mezquita.jpg",
    "/images/mjc_couple_vineyard.jpg",
    "/images/monclova_doodle.png",
    "/images/kyoto.jpg",
  ];
  always.forEach((u) => urls.add(u));

  // Pull any `img` fields from your content objects (story, hotels, gifts, etc.)
  const walk = (obj) => {
    if (!obj) return;
    if (Array.isArray(obj)) return obj.forEach(walk);
    if (typeof obj === "object") {
      for (const [k, v] of Object.entries(obj)) {
        if (k === "img" && typeof v === "string") {
          urls.add(`/images/${v}`);
        } else {
          walk(v);
        }
      }
    }
  };

  walk(content); // uses your existing `content` constant

  return Array.from(urls);
};

const preloadImages = (urls, onProgress) => {
  let loaded = 0;
  const total = urls.length;

  const update = () => {
    loaded += 1;
    onProgress?.(Math.round((loaded / total) * 100));
  };

  return Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            update();
            resolve(true);
          };
          img.onerror = () => {
            // Don't block the whole load if one image fails
            update();
            resolve(false);
          };
          img.src = src;
        })
    )
  );
};

const CoupleWordmark = ({
  className = "",
  style = {},
  variant = "hero", // "hero" | "footer"
  scale = 1,
  // Negative values move the image LEFT. Percent is relative to the image’s own width.
  // This is the “ampersand centering” knob.
  offsetPct,
}) => {
  // Good defaults (tweak if you want):
  const defaultOffset = variant === "footer" ? 2 : 2;
  const x = (offsetPct ?? defaultOffset);

  // Responsive sizes (bigger on mobile + desktop)
  // clamp(min, preferred, max)
  const width =
    variant === "footer"
      ? `clamp(${260 * scale}px, ${78 * scale}vw, ${560 * scale}px)`
      : `clamp(${380 * scale}px, ${174 * scale}vw, ${980 * scale}px)`;
      
  return (
    <div
      className={className}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        lineHeight: 0,
        overflow: "visible",
      }}
    >
      {/* A wrapper lets us shift the PNG without breaking true centering */}
      <div
        style={{
          width,
          transform: `translateX(${x}%)`,
          willChange: "transform",
        }}
      >
        <img
          src="/images/mjc_doodle_names_dark_blue.png"
          alt="Marijo & Juanca"
          draggable={false}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            ...style,
          }}
        />
      </div>
    </div>
  );
};


const Icons = {
  Image: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>),
  Sunset: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 md:w-8 md:h-8"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" /><path d="M12 8a4 4 0 100 8 4 4 0 000-8z" /><path d="M4 19h16" /></svg>),
  Church: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 md:w-8 md:h-8"><path d="M12 2v4m0 0l3 2v3H9V8l3-2z" /><path d="M6 11h12v10H6z" /><path d="M10 21v-4h4v4" /><path d="M12 6V2M10 4h4" /></svg>),
  Sparkles: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 md:w-8 md:h-8"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" /><path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" /><path d="M18 14l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5L16 16l1.5-.5.5-1.5z" /></svg>),
  Sun: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 md:w-8 md:h-8"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636" /></svg>),
  Plane: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 md:w-8 md:h-8"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>),
  Train: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 md:w-8 md:h-8"><rect x="4" y="3" width="16" height="16" rx="2" /><path d="M4 11h16M12 3v8M8 19l-2 3M16 19l2 3" /><circle cx="8" cy="15" r="1" /><circle cx="16" cy="15" r="1" /></svg>),
  Car: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 md:w-8 md:h-8"><path d="M5 17h14v-5l-2-4H7l-2 4v5z" /><circle cx="7.5" cy="17.5" r="1.5" /><circle cx="16.5" cy="17.5" r="1.5" /><path d="M5 12h14" /></svg>),
  Gift: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 md:w-12 md:h-12"><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8v13M3 12h18" /><path d="M12 8c-2-2-5-2.5-5 0s3 2.5 5 2.5c2 0 5-.5 5-2.5s-3-2-5 0z" /></svg>),
  Celebration: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 md:w-16 md:h-16"><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7l2-7z" /></svg>),
  Location: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 inline"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>),
  Heart: () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 inline text-red-400"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>),
  Send: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>),
  Whatsapp: () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>),
  Imessage: () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2A1.5 1.5 0 003.8 21.454l3.032-.892A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>),
  Wine: () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 md:w-8 md:h-8"
  >
    {/* bowl */}
    <path d="M6 3h12v5a6 6 0 01-12 0V3z" />
    {/* stem */}
    <path d="M12 14v5" />
    {/* base */}
    <path d="M8 21h8" />
  </svg>
)
};

const DoodleSparkle = ({ size = 24, color = C.blue, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
    <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DoodleStar = ({ size = 18, color = C.blue, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
    <path
      d="M12 2.8l2.5 6.1 6.6.5-5 4.1 1.6 6.4L12 16.7 6.3 19.9l1.6-6.4-5-4.1 6.6-.5L12 2.8z"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

const Img = ({ src, alt, className = "", style = {}, position = "center" }) => {
  const [error, setError] = React.useState(false);
  if (error) return (<div className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`} style={style}><div className="text-center p-4"><Icons.Image /><p className="text-sm mt-2">Image unavailable</p></div></div>);
  return <img src={`/images/${src}`} alt={alt} className={`object-cover ${className}`} style={{ objectPosition: position, ...style }} onError={() => setError(true)} />;
};

const watercolorMaskSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" preserveAspectRatio="none">
  <defs>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
  </defs>

  <!-- Solid visible region -->
  <path fill="white"
    d="M55,130
       C85,55 175,30 260,55
       C340,18 430,35 510,65
       C610,30 715,45 790,95
       C905,78 968,155 945,235
       C988,320 955,395 905,445
       C912,520 820,575 725,552
       C650,602 540,585 470,545
       C380,585 275,575 210,535
       C110,545 45,475 70,395
       C25,320 25,250 55,130 Z"/>

  <!-- Feathered bleed (blurred, partial opacity) -->
  <g filter="url(#blur)" opacity="0.55">
    <ellipse cx="155" cy="125" rx="95" ry="65" fill="white"/>
    <ellipse cx="430" cy="85" rx="150" ry="70" fill="white"/>
    <ellipse cx="780" cy="120" rx="140" ry="75" fill="white"/>
    <ellipse cx="925" cy="305" rx="85" ry="120" fill="white"/>
    <ellipse cx="720" cy="520" rx="150" ry="85" fill="white"/>
    <ellipse cx="330" cy="520" rx="170" ry="90" fill="white"/>
    <ellipse cx="95" cy="385" rx="95" ry="120" fill="white"/>
  </g>
</svg>
`);

const watercolorMaskUrl = `url("data:image/svg+xml,${watercolorMaskSvg}")`;


const StoryTimeline = ({ items, intro, title, subtitle }) => {
  return (
    <div className="relative">
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-2xl md:text-4xl text-center mb-2" style={{ color: C.blue, fontStyle: 'italic' }}>{title}</h2>
        <p className="text-center text-xs md:text-sm mb-3 md:mb-4" style={{ color: C.blueLight }}>{subtitle}</p>
        <p className="text-center text-sm md:text-base mb-10 md:mb-16 leading-relaxed max-w-2xl mx-auto" style={{ color: C.blueLight, fontStyle: 'italic' }}>{intro}</p>
        
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 hidden md:block" style={{ background: `linear-gradient(180deg, transparent 0%, ${C.bluePale} 5%, ${C.bluePale} 95%, transparent 100%)` }} />
          <div className="absolute left-8 top-0 bottom-0 w-0.5 md:hidden" style={{ background: `linear-gradient(180deg, transparent 0%, ${C.bluePale} 5%, ${C.bluePale} 95%, transparent 100%)` }}/>

          {items.map((item, i) => {
            
            return (
            <div key={i} className="relative mb-12 md:mb-20">
              <div className={`hidden md:flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-5/12 ${i % 2 === 0 ? 'text-right pr-4' : 'text-left pl-4'}`}>
                  <h3 className="text-xl md:text-2xl mb-2" style={{ color: C.blue, fontStyle: 'italic' }}>{item.title}</h3>
                  <p className="text-xs md:text-sm leading-relaxed" style={{ color: C.blueLight }}>{item.text}</p>
                </div>
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: C.cream, boxShadow: `0 0 0 4px ${C.blue}30, 0 0 20px rgba(96,121,141,0.2)`, border: `2px solid ${C.blue}` }}>
                    <span className="text-xs md:text-sm font-medium text-center leading-tight px-1" style={{ color: C.blue }}>{item.year}</span>
                  </div>
                </div>
                <div className="w-5/12 relative">
                  <div className="relative group">
                    <Img src={item.img} alt={item.title} className="w-full h-48 md:h-56 rounded-2xl shadow-lg transition-transform group-hover:scale-[1.02]" style={{ border: `3px solid ${C.cream}` }}/>
                  </div>
                </div>
              </div>

              <div className="md:hidden flex gap-4">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center z-10" style={{ backgroundColor: C.cream, boxShadow: `0 0 0 3px ${C.blue}30`, border: `2px solid ${C.blue}` }}>
                    <span className="text-xs font-medium text-center leading-tight px-1" style={{ color: C.blue }}>{item.year}</span>
                  </div>
                </div>
                <div className="flex-1 pb-4">
                  <h3 className="text-lg mb-1" style={{ color: C.blue, fontStyle: 'italic' }}>{item.title}</h3>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: C.blueLight }}>{item.text}</p>
                  <div className="relative">
                    <Img src={item.img} alt={item.title} className="w-full h-36 rounded-xl" style={{ border: `2px solid ${C.cream}` }}/>
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
};

const content = {
  es: {
    couple: { name1: "Marijo", name2: "Juanca", full1: "Maria Jose Licona", full2: "Juan Carlos Moreno" },
    date: { full: "1 de Octubre, 2026", short: "01.10.26" },
    hero: { location: "Córdoba, España", scroll: "Desliza para descubrir" },
    nav: ["RSVP", "Itinerario", "Hospedaje", "Transporte", "Vestimenta", "Historia", "Regalos", "FAQ", "Contacto"],
    story: { title: "Nuestra Historia", subtitle: "", intro: "Nos conocimos y, desde el primer momento, nos fue imposible mantenernos alejados. Primero fuimos amigos y, en poco tiempo, fuimos cultivando nuestra amistad hasta convertirla en algo más. Nos gusta pensar que nos encontramos en el momento exacto de nuestras vidas. Dios, en su infinita sabiduría, se encargó de unirnos cuando nuestros corazones estaban preparados.",
      items: [
        { year: "2019", title: "Nos Conocimos", text: "Una mirada, una sonrisa, y supimos que algo especial estaba comenzando.", img: "conocimos.jpg" },
        { year: "8 Feb 2020", title: "Empezamos a Salir", text: "Justo antes de que el mundo cambiara, nosotros empezamos nuestra aventura juntos.", img: "kiss.jpg" },
        { year: "21 Feb 2025", title: "La Pedida", text: "En Napa Valley, rodeados de viñedos y el amor de nuestra familia, Juanca se arrodilló y le pidió a Marijo que fuera su compañera para toda la vida.", img: "mjc_ring_closeup.jpg" },
        { year: "1 Oct 2026", title: "Nuestro Matrimonio", text: "Esperamos con mucha ilusión poder celebrar nuestro amor en la hermosa ciudad de Córdoba, rodeados de las personas que más queremos.", img: "mjc_cordoba_mezquita.jpg" }
      ]
    },
    itinerary: { title: "Itinerario", subtitle: "Celebra con nosotros", days: [
      { day: "Miércoles", date: "30", month: "Sep", events: [
        { title: "Rompe Hielo", time: "20:00", venue: "Por confirmar", address: "", tbd: true, icon: "wine" }
      ]},
      { day: "Jueves", date: "1", month: "Oct", events: [
        { title: "La Ceremonia Religiosa", time: "16:00", venue: "Mezquita-Catedral de Córdoba", address: "C. Cardenal Herrero, 1, 14003 Córdoba", tbd: false, icon: "church" },
        { title: "La Celebración", time: "18:00", venue: "Castillo de Monclova", address: "Autovía E5, 4, km 475, 41430 Fuentes de Andalucía, Spain", tbd: false, icon: "sparkles" }
      ]}
    ]},
    hotels: { title: "Hospedaje", subtitle: "", bookBy: "", intro: "Hoteles seleccionados por su ubicación y encanto.", disclaimer: "Estos hoteles estaran cerca del punto de regreso de la ceremonia.", list: [
      { name: "NH Collection Palacio de Córdoba", price: "€€€€€", note: "Plaza de Maimónides, 3, 14004 Córdoba", top: true, images: ["nh_collection1.avif", "nh_collection2.webp", "nh_collection3.avif"], url: "https://www.nh-collection.com/en/hotel/nh-collection-palacio-de-cordoba" },
      { name: "H10 Palacio Colomera", price: "€€€€", note: "Plaza de las Tendillas, 3, 14002 Córdoba", top: false, images: ["h10palacio1.jpg", "h10palacio2.jpg", "H10Palacio3.jpg"], url: "https://www.h10hotels.com/en/cordova-hotels/h10-palacio-colomera", discountCode: "BODAMYJO26" },
      { name: "Eurostars Conquistador", price: "€€€€", note: "C/ Magistral González Francés, 15-17, 14003 Córdoba", top: false, images: ["eurostarcon1.jpg", "eurostarcon2.jpg", "eurostarcon3.jpg"], url: "https://www.eurostarshotels.co.uk/eurostars-conquistador.html" },
      { name: "Eurostars Palace", price: "€€€€€", note: "Paseo de la Victoria, s/n, 14004 Córdoba", top: false, images: ["eurostarpal1.jpg", "eurostarpal2.jpg", "eurostarpal3.jpg"], url: "https://www.eurostarshotels.co.uk/eurostars-palace.html" },
      { name: "NH Córdoba Califa", price: "€€€€", note: "Lope de Hoces, 14, 14003 Córdoba", top: false, images: ["nhcalifa1.jpg", "nhcalifa2.jpg", "nhcalifa3.jpg"], url: "https://www.nh-hotels.com/en/hotel/nh-cordoba-califa" },
      { name: "Hotel Córdoba Centro", price: "€€€", note: "C/ Jesús y María, 8, 14003 Córdoba", top: false, images: ["centro1.jpg", "centro2.jpg", "centro3.jpg"], url: "https://www.hotel-cordobacentro.es/" }
    ] },
    transport: {
      title: 'Transporte',
      subtitle: 'Cómo movernos',
      cards: [
        {
          title: 'Shuttle (día de la boda)',
          text: 'Habrá transporte desde la ceremonia religiosa hasta la celebración y de regreso. Recomendamos hospedarse en los hoteles sugeridos o en lugares cercanos, para estar cerca del punto de llegada al regresar de la celebración.'
        },
        {
          title: 'Taxi / Uber',
          text: 'Recomendamos utilizar taxis en lugar de Uber, ya que las calles son estrechas y hay zonas a las que solo tienen acceso los taxis.'
        },
        {
          title: 'Caminar',
          text: 'Si se hospedan en los hoteles recomendados o en zonas cercanas, podrán llegar caminando a la ceremonia religiosa, ya que está ubicada en el corazón de la ciudad y todo queda a poca distancia. La ciudad está hecha para caminar, así que disfruten y traigan sus zapatos más cómodos.'
        }
      ]
    },
    dress: { title: "Vestimenta", subtitle: "", note: "Octubre en Córdoba: 68-77°F de día, noches frescas.", codes: [{ event: "Rompehielos", code: "Cocktail Attire", desc: "", icon: "Sunset", inspo: "rompehielo.jpg" },{ event: "Boda", code: "Black Tie / Formal", desc: "", icon: "Sparkles", inspo: ["dresses.jpg", "suits.jpg"] }] },
    travel: { title: "Cómo Llegar", subtitle: "", sections: [{ icon: "Plane", title: "Por Avión", text: "Recomendamos volar a Madrid y tomar el tren AVE a Córdoba.", tips: ["También se puede volar a Sevilla o Málaga"] },{ icon: "Train", title: "Por Tren", text: "", tips: ["Madrid 1h 45min", "Sevilla 45min", "Málaga 2h"], url: "https://www.renfe.com", urlText: "Reserva en Renfe" },{ icon: "Car", title: "Por Coche", text: "", tips: ["Madrid 4h", "Sevilla 1.5h", "Málaga 2h"] }] },
    gifts: { title: "Regalos", subtitle: "Su presencia es el mejor regalo, si desean darnos algún detalle, sepan que lo agradecemos profundamente.", msg: "", bank: { title: "Datos Bancarios", iban: "ES00 0000 0000 0000 0000 0000", swift: "XXXXESXX", holder: "Maria Jose Licona / Juan Carlos Moreno" }, cta: "Ver datos bancarios", note: "Bizum y PayPal también" },
    faq: { title: "Información Importante", items: [{ q: "¿Cómo será el clima?", a: "68-77°F (20-25°C) y noches frescas." },{ q: "¿Puedo traer a mis hijos?", a: "Con cariño, les informamos que la celebración será solo para adultos." },{ q: "¿Puedo llevar acompañante?", a: "Con mucho cariño, les pedimos respetar el número de personas indicado en la invitación. Te invitamos a consultar tu invitación para más detalles." },{ q: "¿Idioma de la ceremonia?", a: "Bilingüe: español e inglés." },{ q: "¿Aeropuerto más cercano?", a: "Madrid (1h 45min en tren), Sevilla (1.5h en tren) o Málaga (2h en tren)." },{ q: "¿Necesito visa?", a: "EEUU, México, Colombia: no necesitan visa para estancias de hasta 90 días." },{ q: "¿Restricciones de comida?", a: "Indica restricciones en el formulario." }] },
    contact: { title: "¿Preguntas?", subtitle: "Estamos aquí para ayudaros", msg: "Cualquier duda, no dudéis en contactarnos.", marijo: { name: "Marijo", phone: "+1-832-388-9435", wa: "18323889435" }, juanca: { name: "Juanca", phone: "+1-915-588-9258", wa: "19155889258" } },
    rsvp: { title: "Confirma tu Asistencia", subtitle: "Esperamos contar contigo", deadline: "Confirma antes del 1 Ago 2026", fields: { name: "Nombre completo *", email: "Email (opcional)", attending: "¿Asistirás?", yes: "Sí, asistiré", no: "No asistiré", guests: "Número de invitados", allergies: "Alergias", allergyOpts: ["Frutos secos", "Mariscos", "Gluten", "Lácteos", "Vegetariano", "Vegano"], other: "Otras restricciones", msg: "Mensaje (opcional)", submit: "Enviar" }, thanks: { title: "¡Gracias!", subtitle: "Confirmación recibida", msg: "Estamos muy emocionados de celebrar contigo." } },
    footer: { made: "Hecho con amor", hash: "#MJCBODA" },
    lang: "EN"
  },
  en: {
    couple: { name1: "Marijo", name2: "Juanca", full1: "Maria Jose Licona", full2: "Juan Carlos Moreno" },
    date: { full: "October 1, 2026", short: "01.10.26" },
    hero: { location: "Córdoba, Spain", scroll: "Scroll to discover" },
    nav: ["RSVP", "Itinerary", "Stay", "Transportation", "Dress Code", "Story", "Gifts", "FAQ", "Contact"],
    story: { title: "Our Story", subtitle: "", intro: "We met and, from the very first moment, it was impossible for us to stay apart. First we were friends, and in a short time, we cultivated our friendship into something more. We like to think we found each other at the exact right moment in our lives. God, in His infinite wisdom, brought us together when our hearts were ready.",
      items: [
        { year: "2019", title: "We Met", text: "Destiny brought us together 6 years ago. One look, one smile, and we knew something special was beginning.", img: "conocimos.jpg" },
        { year: "Feb 8, 2020", title: "Started Dating", text: "Right before the world changed, we started our adventure together.", img: "kiss.jpg" },
        { year: "Feb 21, 2025", title: "The Proposal", text: "In Napa Valley, surrounded by vineyards and the love of our family, Juanca got on one knee and asked Marijo to be his partner for life.", img: "mjc_ring_closeup.jpg" },
        { year: "Oct 1, 2026", title: "Our Wedding", text: "We look forward with great excitement to celebrating our love in the beautiful city of Córdoba, surrounded by the people we love most.", img: "mjc_cordoba_mezquita.jpg" }
      ]
    },
    itinerary: { title: "Itinerary", subtitle: "Celebrate with us", days: [
      { day: "Wednesday", date: "30", month: "Sep", events: [
        { title: "Ice Breaker", time: "8:00 PM", venue: "TBD", address: "", tbd: true, icon: "sunset" }
      ]},
      { day: "Thursday", date: "1", month: "Oct", events: [
        { title: "Ceremony", time: "4:00 PM", venue: "Mezquita-Catedral de Córdoba", address: "C. Cardenal Herrero, 1, 14003 Córdoba", tbd: false, icon: "church" },
        { title: "Celebration", time: "8:00 PM", venue: "Castillo de Monclova", address: "Autovía E5, 4, km 475, 41430 Fuentes de Andalucía, Spain", tbd: false, icon: "sparkles" }
      ]}
    ]},
    hotels: { title: "Where to Stay", subtitle: "", bookBy: "", intro: "Hotels selected for location and charm.", disclaimer: "These hotels will be near the drop-off point for transportation returning from the ceremony.", list: [
      { name: "NH Collection Palacio de Córdoba", price: "€€€€€", note: "Plaza de Maimónides, 3, 14004 Córdoba", top: true, images: ["nh_collection1.avif", "nh_collection2.webp", "nh_collection3.avif"], url: "https://www.nh-collection.com/en/hotel/nh-collection-palacio-de-cordoba" },
      { name: "H10 Palacio Colomera", price: "€€€€", note: "Plaza de las Tendillas, 3, 14002 Córdoba", top: false, images: ["h10palacio1.jpg", "h10palacio2.jpg", "H10Palacio3.jpg"], url: "https://www.h10hotels.com/en/cordova-hotels/h10-palacio-colomera", discountCode: "BODAMYJO26" },
      { name: "Eurostars Conquistador", price: "€€€€", note: "C/ Magistral González Francés, 15-17, 14003 Córdoba", top: false, images: ["eurostarcon1.jpg", "eurostarcon2.jpg", "eurostarcon3.jpg"], url: "https://www.eurostarshotels.co.uk/eurostars-conquistador.html" },
      { name: "Eurostars Palace", price: "€€€€€", note: "Paseo de la Victoria, s/n, 14004 Córdoba", top: false, images: ["eurostarpal1.jpg", "eurostarpal2.jpg", "eurostarpal3.jpg"], url: "https://www.eurostarshotels.co.uk/eurostars-palace.html" },
      { name: "NH Córdoba Califa", price: "€€€€", note: "Lope de Hoces, 14, 14003 Córdoba", top: false, images: ["nhcalifa1.jpg", "nhcalifa2.jpg", "nhcalifa3.jpg"], url: "https://www.nh-hotels.com/en/hotel/nh-cordoba-califa" },
      { name: "Hotel Córdoba Centro", price: "€€€", note: "C/ Jesús y María, 8, 14003 Córdoba", top: false, images: ["centro1.jpg", "centro2.jpg", "centro3.jpg"], url: "https://www.hotel-cordobacentro.es/" }
    ] },
    transport: {
      title: 'Transportation',
      subtitle: 'Getting around',
      cards: [
        {
          title: 'Shuttle (wedding day)',
          text: 'There will be transportation from the religious ceremony to the celebration and back. We recommend staying at the suggested hotels or nearby, so you are close to the drop-off point when returning from the celebration.'
        },
        {
          title: 'Taxi / Uber',
          text: 'We recommend using taxis instead of Uber, as the streets are narrow and some areas are only accessible by taxi.'
        },
        {
          title: 'Walking',
          text: 'If you stay at the recommended hotels or nearby areas, you can walk to the religious ceremony, as it is located in the heart of the city and everything is within walking distance. The city is made for walking, so enjoy and bring your most comfortable shoes.'
        }
      ]
    },
    dress: { title: "Dress Code", subtitle: "", note: "October in Córdoba: 68-77°F days, cool evenings.", codes: [{ event: "Ice Breaker", code: "Cocktail", desc: "Cocktail Attire", icon: "Sunset", inspo: "rompehielo.jpg" },{ event: "Wedding", code: "Black Tie / Formal", desc: "", icon: "Sparkles", inspo: ["dresses.jpg", "suits.jpg"] }] },
    travel: { title: "Getting There", subtitle: "", sections: [{ icon: "Plane", title: "By Plane", text: "We recommend flying to Madrid and taking the AVE train to Córdoba.", tips: ["You can also fly to Seville or Málaga"] },{ icon: "Train", title: "By Train", text: "", tips: ["Madrid 1h 45min", "Seville 45min", "Málaga 2h"], url: "https://www.renfe.com", urlText: "Book on Renfe" },{ icon: "Car", title: "By Car", text: "", tips: ["Madrid 4h", "Seville 1.5h", "Málaga 2h"] }] },
    gifts: { title: "Gifts", subtitle: "Your presence is the best gift, if you'd like to give us a gift, know that we deeply appreciate it.", msg: "", bank: { title: "Bank Details", iban: "ES00 0000 0000 0000 0000 0000", swift: "XXXXESXX", holder: "Maria Jose Licona / Juan Carlos Moreno" }, cta: "View bank details", note: "Venmo and PayPal also accepted" },
    faq: { title: "Important Information", items: [{ q: "What's the weather like?", a: "68-77°F (20-25°C) and cool evenings." },{ q: "Can I bring children?", a: "With love, we inform you that the celebration will be adults only." },{ q: "Can I bring a plus one?", a: "With love, we ask you to respect the number of people indicated on your invitation. Please check your invitation for details." },{ q: "What language is the ceremony?", a: "Bilingual: Spanish and English." },{ q: "Nearest airport?", a: "Madrid (1h 45min by train), Seville (1.5h by train) or Málaga (2h by train)." },{ q: "Do I need a visa?", a: "US, Mexico, Colombia: no visa needed for stays up to 90 days." },{ q: "Dietary restrictions?", a: "Note restrictions in the RSVP form." }] },
    contact: { title: "Questions?", subtitle: "We're here to help", msg: "Any questions, don't hesitate to reach out.", marijo: { name: "Marijo", phone: "+1-832-388-9435", wa: "18323889435" }, juanca: { name: "Juanca", phone: "+1-915-588-9258", wa: "19155889258" } },
    rsvp: { title: "RSVP", subtitle: "We hope to celebrate with you", deadline: "Confirm by Aug 1, 2026", fields: { name: "Full name *", email: "Email (optional)", attending: "Will you attend?", yes: "Yes, I'll be there", no: "Can't make it", guests: "Number of guests", allergies: "Allergies", allergyOpts: ["Tree nuts", "Shellfish", "Gluten", "Dairy", "Vegetarian", "Vegan"], other: "Other restrictions", msg: "Message (optional)", submit: "Send" }, thanks: { title: "Thank You!", subtitle: "RSVP received", msg: "We're excited to celebrate with you." } },
    footer: { made: "Made with love", hash: "#MJCBODA" },
    lang: "ES"
  }
};


const ItineraryIcon = ({ type, className = "", style = {} }) => {
  const icons = {
    sunset: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={style}><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" /><path d="M12 8a4 4 0 100 8 4 4 0 000-8z" /><path d="M4 19h16" /></svg>),
    church: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={style}><path d="M12 2v4m0 0l3 2v3H9V8l3-2z" /><path d="M6 11h12v10H6z" /><path d="M10 21v-4h4v4" /><path d="M12 6V2M10 4h4" /></svg>),
    sparkles: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={style}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" /><path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" /></svg>),
    wine: (<Icons.Wine className={className} style={style} />),
  };
  return icons[type] || null;
};

const HandDrawnCard = ({ children, className = "", style = {} }) => (
  <div className={`relative ${className}`} style={style}>
    <svg className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)]" viewBox="0 0 200 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
      <path 
        d="M 6,8 Q 30,4 50,6 T 100,5 Q 130,3 160,6 T 195,10 Q 198,30 196,50 T 194,90 Q 180,97 150,95 T 100,96 Q 60,98 30,95 T 5,92 Q 2,70 4,50 T 6,8 Z" 
        fill={C.creamDark} 
        stroke={C.bluePale} 
        strokeWidth="2.5" 
        vectorEffect="non-scaling-stroke"
      />
    </svg>
    <div className="relative z-10">{children}</div>
  </div>
);

const WigglyPostcard = ({ children, className = "", style = {} }) => (
  <div className={`relative ${className}`} style={style}>
    <svg
      className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)]"
      viewBox="0 0 220 140"
      preserveAspectRatio="none"
      style={{ overflow: "visible" }}
    >
      {/* different “wiggle”: sketchy rounded-rect (NOT the blob) */}
      <path
        d="
          M 14,18
          Q 22,10 34,14
          T 72,12
          T 116,14
          T 160,12
          Q 196,10 206,20
          Q 214,30 210,44
          T 210,70
          T 208,98
          Q 206,122 190,124
          T 144,126
          T 96,124
          T 50,126
          Q 18,128 12,112
          T 10,78
          T 12,46
          Q 10,28 14,18
          Z
        "
        fill={C.cream}
        stroke={C.gold}
        strokeWidth="2.5"
        vectorEffect="non-scaling-stroke"
      />

      {/* second offset stroke = “hand-drawn” feel, still not like transport */}
      <path
        d="
          M 18,20
          Q 26,12 38,16
          T 74,14
          T 118,16
          T 162,14
          Q 194,12 202,22
          Q 210,32 206,46
          T 206,70
          T 204,96
          Q 202,118 186,120
          T 142,122
          T 96,120
          T 52,122
          Q 22,124 16,110
          T 14,78
          T 16,48
          Q 14,30 18,20
          Z
        "
        fill="none"
        stroke={C.bluePale}
        strokeWidth="1.5"
        opacity="0.55"
        vectorEffect="non-scaling-stroke"
      />
    </svg>

    <div className="relative z-10">{children}</div>
  </div>
);

const FAQWiggleCard = ({ children, className = "", onClick }) => (
  <div className={`relative ${className}`} onClick={onClick}>
    {/* The outline lives INSIDE the box, so no negative inset needed */}
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
        d="
          M 6,10
          Q 20,4 34,8
          T 68,7
          T 94,12
          Q 98,26 95,40
          T 95,60
          Q 98,74 94,88
          Q 74,96 60,93
          T 30,94
          Q 10,92 6,84
          Q 3,70 5,58
          T 5,40
          Q 3,24 6,10
          Z
        "
        fill="none"
        stroke={C.blue}
        strokeWidth="2.2"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>

    <div className="relative z-10">{children}</div>
  </div>
);

const CalendarCard = ({ date, month, day }) => (
  <div className="flex-shrink-0 w-20 md:w-24 relative">
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 120" preserveAspectRatio="none">
      <path d="M 10,5 C 25,2 75,3 90,5 C 96,7 98,12 97,25 C 98,60 97,90 96,105 C 95,112 90,116 80,117 C 60,118 40,117 20,116 C 10,115 5,110 4,100 C 3,70 4,40 3,20 C 2,10 6,6 10,5 Z" fill={C.cream} stroke={C.bluePale} strokeWidth="2" vectorEffect="non-scaling-stroke"/>
      <path d="M 10,30 C 25,28 75,29 90,30" fill="none" stroke={C.bluePale} strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
    </svg>
    <div className="relative z-10">
      <div className="py-1.5 md:py-2 text-center text-xs md:text-sm font-medium uppercase tracking-wider" style={{ color: C.blue }}>{month}</div>
      <div className="py-2 md:py-3 text-center">
        <div className="text-3xl md:text-4xl font-light" style={{ color: C.blue }}>{date}</div>
        <div className="text-xs md:text-sm" style={{ color: C.blueLight }}>{day}</div>
      </div>
    </div>
  </div>
);

const MonthCalendar = ({ lang }) => {
  const months = { sep: 'Sep', oct: 'Oct' };
  const monthsFull = lang === 'es' ? { sep: 'Septiembre', oct: 'Octubre' } : { sep: 'September', oct: 'October' };
  const weekDays = lang === 'es' ? ['L', 'M', 'X', 'J', 'V', 'S', 'D'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const sepDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const sepStartDay = 1;
  const octDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const octStartDay = 3;
  const specialDays = { sep: [30], oct: [1] };

  const renderMonth = (monthName, monthNameFull, days, startDay, specialDates) => (
    <div className="flex-1 min-w-0">
      <h4 className="text-center text-sm md:text-lg mb-2 md:mb-4" style={{ color: C.blue, fontStyle: 'italic' }}>
        <span className="md:hidden">{monthName} '26</span>
        <span className="hidden md:inline">{monthNameFull} 2026</span>
      </h4>
      <div className="grid grid-cols-7 gap-0.5 md:gap-1 mb-1 md:mb-2">
        {weekDays.map((day, i) => (<div key={i} className="text-center text-[10px] md:text-xs font-medium py-0.5 md:py-1" style={{ color: C.blueLight }}>{day}</div>))}
      </div>
      <div className="grid grid-cols-7 gap-0.5 md:gap-1">
        {Array.from({ length: startDay }, (_, i) => (<div key={`empty-${i}`} className="aspect-square" />))}
        {days.map((day) => {
          const isSpecial = specialDates.includes(day);
          return (
            <div key={day} className="aspect-square flex items-center justify-center relative">
              {isSpecial ? (
                <div className="w-6 h-6 md:w-10 md:h-10 rounded-full flex items-center justify-center relative" style={{ backgroundColor: C.blue }}>
                  <span className="text-white text-[10px] md:text-sm font-medium">{day}</span>
                  <svg viewBox="0 0 24 24" className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-3 h-3 md:w-5 md:h-5" fill={C.gold} stroke={C.gold} strokeWidth="1">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              ) : (<span className="text-[10px] md:text-sm" style={{ color: C.text }}>{day}</span>)}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex justify-center gap-3 md:gap-10 mb-8 md:mb-14 p-3 md:p-6 rounded-2xl" style={{ backgroundColor: C.cream }}>
      {renderMonth(months.sep, monthsFull.sep, sepDays, sepStartDay, specialDays.sep)}
      <div className="w-px self-stretch opacity-30" style={{ backgroundColor: C.bluePale }} />
      {renderMonth(months.oct, monthsFull.oct, octDays, octStartDay, specialDays.oct)}
    </div>
  );
};

const getTravelIcon = (n) => { const m = { Plane: Icons.Plane, Train: Icons.Train, Car: Icons.Car }; const I = m[n]; return I ? <I /> : null; };

// Payment info
const PAYMENT_INFO = {
  venmo: '@JuanCarlos-Moreno-2',
  zelle: '+1-915-588-9258',
};

const getVenmoLinks = ({ username, amount, note }) => {
  const cleanUser = (username || '').replace('@', '');
  const a = typeof amount === 'number' ? amount : parseFloat(amount);
  const amt = Number.isFinite(a) ? a.toFixed(2) : ''; // blank if custom/invalid
  const encodedNote = encodeURIComponent(note || '');

  // Venmo deep link (app)
  const app = `venmo://paycharge?txn=pay&recipients=${encodeURIComponent(cleanUser)}${amt ? `&amount=${encodeURIComponent(amt)}` : ''}${encodedNote ? `&note=${encodedNote}` : ''}`;

  // Web fallback (universal link)
  const web = `https://venmo.com/${encodeURIComponent(cleanUser)}?txn=pay${amt ? `&amount=${encodeURIComponent(amt)}` : ''}${encodedNote ? `&note=${encodedNote}` : ''}`;

  return { app, web, amt };
};

const openVenmo = ({ username, amount, note }) => {
  const { app, web } = getVenmoLinks({ username, amount, note });

  // Attempt app first…
  window.location.href = app;

  // …then fallback to web shortly after (if app didn’t take over)
  setTimeout(() => {
    window.location.href = web;
  }, 600);
};

export default function Wedding() {
  const [showIntro, setShowIntro] = useState(true);
  const [lang, setLang] = useState('es');
  const [loaded, setLoaded] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [rsvpDone, setRsvpDone] = useState(false);
  const [form, setForm] = useState({
    token: '',
    name: '',
    email: '',
    attending: '',
    guests: 1,
    allergies: [],
    other: '',
    msg: '',
    additionalGuests: []
  });
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0 });
  const [page, setPage] = useState('home'); // 'home', 'gifts', 'rsvp'
  const [maxGuests, setMaxGuests] = useState(null);
  const [formError, setFormError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [zelleCopied, setZelleCopied] = useState(false);
  const [hotelImageIndex, setHotelImageIndex] = useState(0);
  const introStartRef = React.useRef(Date.now());
  const [introLeaving, setIntroLeaving] = useState(false);
  const [showSite, setShowSite] = useState(false);
  const [invite, setInvite] = useState(null);
  const [inviteError, setInviteError] = useState('');
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupCountryCode, setLookupCountryCode] = useState('+1');
  const [parties, setParties] = useState([]);
  const t = content[lang];

  // Load guest list from CSV
  useEffect(() => {
    fetch('/guests.csv')
      .then(res => res.text())
      .then(csv => setParties(parseGuestsCSV(csv)))
      .catch(err => console.error('Failed to load guests:', err));
  }, []);

  const markAsSubmitted = (code, name) => {
    try {
      const submitted = JSON.parse(localStorage.getItem('mjc_rsvp_submitted') || '{}');
      submitted[code.toUpperCase()] = { name, timestamp: new Date().toISOString() };
      localStorage.setItem('mjc_rsvp_submitted', JSON.stringify(submitted));
    } catch {
      // localStorage not available
    }
  };

  const jsonp = (url) =>
    new Promise((resolve, reject) => {
      const cb = `__cb_${Math.random().toString(36).slice(2)}`;
      window[cb] = (data) => {
        resolve(data);
        cleanup();
      };

      const cleanup = () => {
        delete window[cb];
        script.remove();
      };

      const script = document.createElement('script');
      script.src = `${url}${url.includes('?') ? '&' : '?'}callback=${cb}`;
      script.onerror = () => {
        reject(new Error('JSONP load failed'));
        cleanup();
      };
      document.body.appendChild(script);
    });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || '';

    if (!token) return; // allow manual RSVP if you want, or show error

    const url = `${SHEETS_URL}?action=guest&token=${encodeURIComponent(token)}`;

    jsonp(url)
      .then((res) => {
        if (!res.success) throw new Error(res.error || 'Invalid token');
        setInvite(res.guest);

        // prefill form + max guests + language
        setMaxGuests(Number(res.guest.max_guests || 1));
        if (res.guest.lang) setLang(res.guest.lang);

        setForm((f) => ({
          ...f,
          name: res.guest.primary_name || f.name,
          email: res.guest.email || f.email,
          // store token for submit
          token: res.guest.token,
          guests: 1,
          additionalGuests: [],
        }));
      })
      .catch((err) => setInviteError(err.message));
  }, []);

  // Auto-scroll hotel images every 4.5 seconds (synchronized)
  useEffect(() => {
    const interval = setInterval(() => {
      setHotelImageIndex((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;

    introStartRef.current = Date.now();

    const fadeTimer = setTimeout(() => {
      if (!cancelled) setLoaded(true);
    }, 120);

    const urls = collectImageUrls();

    const finishIntro = async () => {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const elapsed = Date.now() - introStartRef.current;
      const remaining = Math.max(0, MIN_INTRO_MS - elapsed);

      setTimeout(() => {
        if (cancelled) return;
        
        window.scrollTo(0, 0); 
        // Start cross-fade
        setShowSite(true);
        setIntroLeaving(true);

        // After animation completes, unmount intro
        setTimeout(() => {
          if (!cancelled) setShowIntro(false);
        }, 700); // must match CSS duration below
      }, remaining);
    };

    preloadImages(urls)
    .then(() => {
      if (!cancelled) finishIntro();
    })
    .catch(() => {
      if (!cancelled) finishIntro();
    });


    // countdown timer (your existing logic)
    const tick = () => {
      const diff = new Date("2026-10-01T16:00:00") - new Date();
      if (diff > 0) {
        setCountdown({
          d: Math.floor(diff / 86400000),
          h: Math.floor((diff / 3600000) % 24),
          m: Math.floor((diff / 60000) % 60),
        });
      }
    };
    tick();
    const timer = setInterval(tick, 60000);

    return () => {
      cancelled = true;
      clearTimeout(fadeTimer);
      clearInterval(timer);
    };
  }, []);


  
  const goToRsvp = (attending) => (e) => { 
    e.preventDefault(); 
    setForm((f) => ({ ...f, attending })); 
    setPage('rsvp');
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const goToGifts = (e) => {
    e.preventDefault();
    setPage('gifts');
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setPage('home');
    setFormError('');
    setRsvpDone(false);
    setMaxGuests(null);
    setIsUpdating(false);
    setMobileMenuOpen(false);
    setInvite(null);
    setInviteError('');
    setLookupPhone('');
    setForm({ name: '', email: '', attending: '', guests: 1, allergies: [], other: '', msg: '', code: '', additionalGuests: [] });
    window.scrollTo(0, 0);
  };


  const updateAdditionalGuest = (index, field, value) => {
    const newAdditionalGuests = [...form.additionalGuests];
    newAdditionalGuests[index] = { ...newAdditionalGuests[index], [field]: value };
    setForm({ ...form, additionalGuests: newAdditionalGuests });
  };

  const toggleAdditionalGuestAllergy = (index, allergy) => {
    const newAdditionalGuests = [...form.additionalGuests];
    const guest = newAdditionalGuests[index];
    if (guest.allergies.includes(allergy)) {
      guest.allergies = guest.allergies.filter(a => a !== allergy);
    } else {
      guest.allergies = [...guest.allergies, allergy];
    }
    setForm({ ...form, additionalGuests: newAdditionalGuests });
  };

  const copyToClipboard = async (text, onCopied) => {
    try {
      await navigator.clipboard.writeText(text);
      onCopied?.();
    } catch {
      // fallback (older browsers)
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      onCopied?.();
    }
  };


  if (showIntro) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{
          backgroundColor: C.cream,
          transition: "opacity 0.7s ease, transform 0.7s ease, filter 0.7s ease",
          opacity: introLeaving ? 0 : (loaded ? 1 : 0),
          transform: introLeaving ? "translateY(-8px) scale(0.99)" : "translateY(0) scale(1)",
          filter: introLeaving ? "blur(2px)" : "blur(0px)",
          overflow: "hidden",
          zIndex: 50,
          pointerEvents: introLeaving ? "none" : "auto",
        }}
      >
        {/* language toggle still works */}
        <button
          onClick={() => setLang(lang === "es" ? "en" : "es")}
          className="absolute top-3 right-3 md:top-4 md:right-4 z-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm tracking-wider"
          style={{ color: C.blue, border: `1px solid ${C.blue}` }}
        >
          {t.lang}
        </button>

       {/* Dancing image */}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: "min(880px, 98vw)",
          }}
        >
          <img
            src="/images/mjc_doodle_dancing_dark_blue.png"
            data-dance="true"
            alt="Loading"
            draggable={false}
            style={{
              width: "100%",
              height: "auto",
              filter: "drop-shadow(0 18px 34px rgba(91,123,148,0.18))",
              transformOrigin: "center bottom",
              animation: "mjcDance 1.15s ease-in-out infinite",
              position: "relative",
              zIndex: 2,
            }}
          />
        </div>

        <style>{`
          @keyframes mjcDance {
            0%   { transform: translateY(0) rotate(-1.2deg) scale(1); }
            50%  { transform: translateY(-6px) rotate(1.2deg) scale(1.02); }
            100% { transform: translateY(0) rotate(-1.2deg) scale(1); }
          }
          @media (prefers-reduced-motion: reduce) {
            img[data-dance="true"] { animation: none !important; }
          }
        `}</style>
      </div>
    );
  }


  const submitRSVP = async () => {
    setFormError('');
    if (!form.name.trim()) {
      setFormError(lang === 'es' ? 'Por favor ingresa tu nombre' : 'Please enter your name');
      return;
    }

    setIsSubmitting(true);

    try {
      const timestamp = new Date().toISOString();

      // Primary guest row - 1 if attending, 0 if not
      const primaryPayload = {
        token: form.token,
        name: form.name,
        email: form.email,
        attending: form.attending,
        guests: form.attending === 'yes' ? 1 : 0,
        allergies: form.allergies.join(', '),
        other: form.other,
        msg: form.msg,
        submittedBy: form.name,
        lang,
        timestamp
      };

      // Send primary guest first
      const primaryResponse = await fetch(SHEETS_URL, { method: 'POST', body: new URLSearchParams(primaryPayload) });
      const primaryResult = await primaryResponse.json().catch(() => ({ success: true })); // fallback if no JSON
      if (primaryResult.success === false) throw new Error(primaryResult.error || 'Failed to save primary guest');

      // Small delay then send additional guests sequentially
      for (const guest of form.additionalGuests) {
        await new Promise(r => setTimeout(r, 100)); // 100ms delay between requests
        const guestPayload = {
          token: form.token,
          name: guest.name,
          email: guest.email || '',
          attending: guest.attending !== false ? 'yes' : 'no',
          guests: guest.attending !== false ? 1 : 0,
          allergies: (guest.allergies || []).join(', '),
          other: guest.other || '',
          msg: '',
          submittedBy: form.name,
          lang,
          timestamp
        };
        const guestResponse = await fetch(SHEETS_URL, { method: 'POST', body: new URLSearchParams(guestPayload) });
        const guestResult = await guestResponse.json().catch(() => ({ success: true }));
        if (guestResult.success === false) throw new Error(guestResult.error || `Failed to save ${guest.name}`);
      }

      // ✅ for token mode, use token not code
      markAsSubmitted(form.token, form.name);
      setRsvpDone(true);
    } catch (e) {
      console.error('RSVP submission error:', e);
      setFormError(
        lang === 'es'
          ? 'Hubo un problema al enviar. Por favor intenta de nuevo. Si el problema persiste, contáctanos.'
          : 'There was a problem submitting. Please try again. If the problem persists, contact us.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  const toggleAllergy = (a) => setForm(f => ({ ...f, allergies: f.allergies.includes(a) ? f.allergies.filter(x => x !== a) : [...f.allergies, a] }));

  // GIFTS PAGE
  if (page === 'gifts') {
    return (
      <div style={{ backgroundColor: C.cream, fontFamily: FONTS.body }}>
        <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: C.cream, borderBottom: '1px solid rgba(91,123,148,0.1)' }}>
          <div className="max-w-5xl mx-auto px-3 md:px-4 py-2 md:py-3 flex items-center justify-between">
            <button onClick={goHome} className="flex items-center gap-1.5 md:gap-2 hover:opacity-70">
              <span className="text-lg" style={{ color: C.blue }}>←</span>
            </button>
            <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm" style={{ border: `1px solid ${C.blue}`, color: C.blue }}>{t.lang}</button>
          </div>
        </nav>

        <div className="pt-20 pb-12 px-4 md:px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8 md:mb-10">
              <h1 className="text-2xl md:text-4xl mb-4 md:mb-6" style={{ color: C.blue, fontStyle: 'italic' }}>
                {lang === 'es' ? 'Regalos' : 'Gifts'}
              </h1>
              <p className="text-sm md:text-base max-w-md mx-auto" style={{ color: C.blueLight }}>
                {lang === 'es'
                  ? 'Significa el mundo para nosotros que hagan este viaje para estar con nosotros. Su presencia es el mejor regalo. Y si desean darnos algún detalle, sepan que lo agradecemos profundamente.'
                  : 'It truly means the world that you\'re making the journey to celebrate with us. Your presence is the greatest gift we could ask for. If you do wish to give a gift, please know how deeply grateful we are.'}
              </p>
            </div>

            {/* Honeyfund Registry - Main Button */}
            <div className="text-center mb-10">
              <a
                href="https://www.honeyfund.com/site/licona-moreno-10-01-2026"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full max-w-sm rounded-2xl p-6 md:p-8 hover:scale-[1.02] transition-all cursor-pointer"
                style={{
                  backgroundColor: C.creamDark,
                  border: `2px solid ${C.goldLight}`,
                  boxShadow: '0 6px 24px rgba(190,134,43,0.12)',
                }}
              >
                <span className="block text-xl md:text-2xl font-medium mb-2" style={{ color: C.blue }}>
                  {lang === 'es' ? 'Mesa de Regalos' : 'Gift Registry'}
                </span>
                <span className="block text-sm mb-4" style={{ color: C.blueLight, opacity: 0.7 }}>
                  Honeyfund
                </span>
                <span
                  className="inline-block px-6 py-2.5 rounded-full text-sm font-medium"
                  style={{ backgroundColor: C.goldLight, color: 'white' }}
                >
                  {lang === 'es' ? 'Ver opciones →' : 'View options →'}
                </span>
              </a>
            </div>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 h-px" style={{ backgroundColor: C.gold }}></div>
              <span className="px-4 text-sm" style={{ color: C.blueLight, opacity: 0.7 }}>
                {lang === 'es' ? 'o contribuye directamente (preferido)' : 'or contribute directly (preferred)'}
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: C.gold }}></div>
            </div>

            {/* Direct Payment Options */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() =>
                  openVenmo({
                    username: PAYMENT_INFO.venmo,
                    amount: null,
                    note: 'MJC Wedding Gift',
                  })
                }
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm md:text-base hover:scale-[1.02] transition-all cursor-pointer text-white"
                style={{
                  background: 'linear-gradient(135deg, #5B9ACF 0%, #3D7FB5 100%)',
                  boxShadow: '0 4px 14px rgba(61,127,181,0.3)',
                }}
              >
                <span className="font-medium">Venmo</span>
                <span className="opacity-80">{PAYMENT_INFO.venmo}</span>
                <span className="text-xs ml-1 px-2 py-0.5 rounded-full bg-white/20">
                  link
                </span>
              </button>

              <button
                onClick={() => {
                  copyToClipboard(PAYMENT_INFO.zelle, () => {
                    setZelleCopied(true);
                    setTimeout(() => setZelleCopied(false), 1600);
                  });
                }}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-sm md:text-base hover:scale-[1.02] transition-all cursor-pointer text-white"
                style={{
                  background: zelleCopied
                    ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
                    : 'linear-gradient(135deg, #8B6CC4 0%, #6B4FA0 100%)',
                  boxShadow: zelleCopied
                    ? '0 4px 14px rgba(34,197,94,0.3)'
                    : '0 4px 14px rgba(107,79,160,0.3)',
                }}
              >
                {zelleCopied ? (
                  <span className="font-medium">{lang === 'es' ? '✓ Copiado!' : '✓ Copied!'}</span>
                ) : (
                  <>
                    <span className="font-medium">Zelle</span>
                    <span className="opacity-80">{PAYMENT_INFO.zelle}</span>
                    <span className="text-xs ml-1 px-2 py-0.5 rounded-full bg-white/20">
                      {lang === 'es' ? 'copiar' : 'copy'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Card at wedding option */}
            <div
              className="mt-6 py-5 px-6 rounded-xl text-center"
              style={{ backgroundColor: C.creamDark, border: `2px dashed ${C.goldLight}` }}
            >
              <p className="text-sm mb-1" style={{ color: C.blue }}>
                {lang === 'es' ? '✉️ Sobre en la boda' : '✉️ Card at the wedding'}
              </p>
              <p className="text-xs" style={{ color: C.blueLight, opacity: 0.7 }}>
                {lang === 'es'
                  ? 'También puedes darnos tu regalo en persona'
                  : 'You can also give your gift in person'}
              </p>
            </div>

            <p className="text-xs mt-8 text-center" style={{ color: C.blueLight, opacity: 0.6 }}>
              {lang === 'es'
                ? 'Por favor incluye tu nombre en la nota del pago.'
                : 'Please include your name in the payment note.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // RSVP PAGE
  if (page === 'rsvp') {
    return (
      <div style={{ backgroundColor: C.cream, fontFamily: FONTS.body }}>
        <style>{`
          @keyframes mjcDance {
            0%   { transform: translateY(0) rotate(-1.2deg) scale(1); }
            50%  { transform: translateY(-6px) rotate(1.2deg) scale(1.02); }
            100% { transform: translateY(0) rotate(-1.2deg) scale(1); }
          }
        `}</style>
        <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: C.cream, borderBottom: '1px solid rgba(91,123,148,0.1)' }}>
          <div className="max-w-5xl mx-auto px-3 md:px-4 py-2 md:py-3 flex items-center justify-between">
            <button onClick={goHome} className="flex items-center gap-1.5 md:gap-2 hover:opacity-70">
              <span className="text-lg" style={{ color: C.blue }}>←</span>
            </button>
            <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm" style={{ border: `1px solid ${C.blue}`, color: C.blue }}>{t.lang}</button>
          </div>
        </nav>

        <div className="pt-20 pb-12 px-4 md:px-6 relative min-h-screen overflow-hidden">
          <div className="absolute inset-0 opacity-10"><Img src="mjc_couple_vineyard_bw.jpg" alt="Background" className="w-full h-full" position="center 40%" /></div>
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${C.cream} 0%, transparent 30%, transparent 70%, ${C.cream} 100%)` }} />
          <div className="max-w-md mx-auto relative z-10">
            {rsvpDone ? (
              <div className="flex flex-col items-center justify-center min-h-[70vh] text-center py-8 md:py-10">
                <h2 className="text-3xl md:text-4xl mb-3" style={{ color: C.blue, fontStyle: 'italic' }}>
                  {isUpdating
                    ? (lang === 'es' ? '¡Actualizado!' : 'Updated!')
                    : t.rsvp.thanks.title
                  }
                </h2>
                <p className="text-sm md:text-base mb-4 md:mb-5" style={{ color: C.blueLight }}>
                  {isUpdating
                    ? (lang === 'es' ? 'Tu RSVP ha sido actualizado' : 'Your RSVP has been updated')
                    : t.rsvp.thanks.subtitle
                  }
                </p>
                {form.attending === 'yes' && (
                  <p className="text-sm md:text-base mb-8 md:mb-10" style={{ color: C.blueLight }}>{t.rsvp.thanks.msg}</p>
                )}
                <img
                  src="/images/mjc_doodle_dancing_dark_blue.png"
                  alt="Celebration"
                  className="w-40 h-36 md:w-48 md:h-40 rounded-xl mx-auto opacity-70"
                  style={{
                    transformOrigin: 'center bottom',
                    animation: 'mjcDance 1.15s ease-in-out infinite'
                  }}
                />
                <button onClick={goHome} className="mt-8 px-8 py-3 rounded-full text-base font-medium hover:scale-105 transition-transform" style={{ backgroundColor: C.blue, color: 'white', boxShadow: '0 4px 20px rgba(91,123,148,0.3)' }}>
                  {lang === 'es' ? 'Volver al inicio' : 'Back to home'}
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl text-center mb-1" style={{ color: C.blue, fontStyle: 'italic' }}>{t.rsvp.title}</h2>
                <p className="text-center text-xs md:text-sm mb-2" style={{ color: C.blueLight }}>{t.rsvp.subtitle}</p>
                <p className="text-center text-xs md:text-sm mb-6 md:mb-8 px-3 py-1.5 rounded-full mx-auto" style={{ backgroundColor: C.creamDark, color: C.blue, display: 'table' }}>{t.rsvp.deadline}</p>
                
                <div className="space-y-4 md:space-y-5">
                  {inviteError && (
                    <div
                      className="mb-4 p-4 rounded-xl text-center"
                      style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
                    >
                      <p className="text-sm text-red-500 mb-1">{inviteError}</p>
                      <p className="text-xs text-red-500 mb-3">
                        {lang === 'es'
                          ? 'Por favor revisa tu invitación o contáctanos.'
                          : 'Please check your invitation or contact us.'}
                      </p>
                      <div className="flex flex-row gap-4 justify-center items-center">
                        {[t.contact.marijo, t.contact.juanca].map((c, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-xs" style={{ color: C.blue }}>{c.name}:</span>
                            <button onClick={() => window.open(`https://wa.me/${c.wa}`, '_blank')} className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer" style={{ backgroundColor: C.blue, color: 'white' }}><Icons.Whatsapp /></button>
                            <button onClick={() => window.open(`sms:${c.phone}`, '_self')} className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer" style={{ backgroundColor: C.blue, color: 'white' }}><Icons.Imessage /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Invitation context (token vs manual) */}
                  {invite ? (
                    <p
                      className="text-xs md:text-sm mb-4 px-3 py-2 rounded-full text-center"
                      style={{ backgroundColor: C.creamDark, color: C.blue }}
                    >
                      {lang === 'es'
                        ? `Invitación para ${invite.household}`
                        : `Invitation for ${invite.household}`}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs md:text-sm mb-1 md:mb-1.5" style={{ color: C.blue }}>
                          {lang === 'es' ? 'Nombre completo *' : 'Full name *'}
                        </label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => {
                            setForm({ ...form, name: e.target.value });
                            setInviteError("");
                          }}
                          className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border bg-white text-sm md:text-base"
                          style={{ borderColor: inviteError ? '#ef4444' : '#E8E4DF' }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm mb-1 md:mb-1.5" style={{ color: C.blue }}>
                          {lang === 'es' ? 'Teléfono *' : 'Phone number *'}
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={lookupCountryCode}
                            onChange={(e) => {
                              setLookupCountryCode(e.target.value);
                              setInviteError("");
                            }}
                            className="px-2 md:px-3 py-2.5 md:py-3 rounded-xl border bg-white text-sm md:text-base"
                            style={{ borderColor: inviteError ? '#ef4444' : '#E8E4DF' }}
                          >
                            {COUNTRY_CODES.map(cc => (
                              <option key={cc.code} value={cc.code}>{cc.label}</option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            value={lookupPhone}
                            onChange={(e) => {
                              setLookupPhone(e.target.value);
                              setInviteError("");
                            }}
                            placeholder="xxx-xxx-xxxx"
                            className="flex-1 px-3 md:px-4 py-2.5 md:py-3 rounded-xl border bg-white text-sm md:text-base"
                            style={{ borderColor: inviteError ? '#ef4444' : '#E8E4DF' }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const result = findPartyByNameAndPhone(parties, form.name, lookupCountryCode, lookupPhone);

                          if (!result) {
                            setInviteError(
                              lang === "es"
                                ? "No encontramos tu invitación. Revisa el nombre y teléfono."
                                : "We couldn't find your invitation. Please check your name and phone number."
                            );
                            setInvite(null);
                            setMaxGuests(null);
                            return;
                          }

                          const { party, matchedMember } = result;

                          setInvite({
                            household: party.household,
                            token: party.partyId,
                            max_guests: party.maxGuests,
                            primary_name: matchedMember.name,
                            lang: party.lang,
                          });

                          setMaxGuests(party.maxGuests);
                          if (matchedMember.lang) setLang(matchedMember.lang);

                          // Use the actual matched member's name to filter others
                          const others = party.members.filter(m => m.name !== matchedMember.name);

                          setForm(f => ({
                            ...f,
                            name: matchedMember.name, // Update to the correct full name
                            token: party.partyId,
                            attending: '',
                            guests: Math.min(party.maxGuests, Math.max(1, party.members.length)),
                            additionalGuests: others.map(m => ({
                              name: m.name,
                              email: '',
                              allergies: [],
                              other: ""
                            })),
                          }));
                        }}
                        className="w-full py-2.5 md:py-3 rounded-xl text-sm md:text-base font-medium transition-all hover:opacity-90"
                        style={{ backgroundColor: C.blue, color: 'white' }}
                      >
                        {lang === 'es' ? 'Buscar invitación' : 'Find invitation'}
                      </button>
                    </div>
                  )}


                  {invite && (
                    <>
                      {maxGuests === 1 && (
                        <div className="text-center">
                          <p className="text-lg md:text-xl font-medium" style={{ color: C.blue }}>{form.name}</p>
                        </div>
                      )}

                      <div className="text-center pt-6 md:pt-8 pb-6 md:pb-8">
                        <label className="block text-xl md:text-2xl font-medium mb-4 md:mb-6" style={{ color: C.blue }}>{t.rsvp.fields.attending}</label>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                          <label
                            className="flex items-center gap-3 px-6 md:px-10 py-4 md:py-5 rounded-2xl cursor-pointer transition-all hover:scale-105"
                            style={{
                              backgroundColor: form.attending === 'yes' ? C.blue : 'white',
                              color: form.attending === 'yes' ? 'white' : C.blue,
                              border: `2px solid ${C.blue}`,
                              boxShadow: form.attending === 'yes' ? '0 8px 25px rgba(91,123,148,0.4)' : '0 2px 8px rgba(0,0,0,0.08)'
                            }}
                          >
                            <div
                              className="w-6 h-6 md:w-7 md:h-7 rounded-md border-2 flex items-center justify-center transition-all"
                              style={{
                                borderColor: form.attending === 'yes' ? 'white' : C.blue,
                                backgroundColor: form.attending === 'yes' ? 'white' : 'transparent'
                              }}
                            >
                              {form.attending === 'yes' && <span style={{ color: C.blue, fontSize: '18px', fontWeight: 'bold' }}>✓</span>}
                            </div>
                            <input type="checkbox" checked={form.attending === 'yes'} onChange={() => setForm({ ...form, attending: form.attending === 'yes' ? '' : 'yes', additionalGuests: form.additionalGuests.map(g => ({ ...g, attending: true })), guests: 1 + form.additionalGuests.length })} className="sr-only" />
                            <span className="text-base md:text-lg font-medium">{t.rsvp.fields.yes}</span>
                          </label>
                          <label
                            className="flex items-center gap-3 px-6 md:px-10 py-4 md:py-5 rounded-2xl cursor-pointer transition-all hover:scale-105"
                            style={{
                              backgroundColor: form.attending === 'no' ? C.blue : 'white',
                              color: form.attending === 'no' ? 'white' : C.blue,
                              border: `2px solid ${C.blue}`,
                              boxShadow: form.attending === 'no' ? '0 8px 25px rgba(91,123,148,0.4)' : '0 2px 8px rgba(0,0,0,0.08)'
                            }}
                          >
                            <div
                              className="w-6 h-6 md:w-7 md:h-7 rounded-md border-2 flex items-center justify-center transition-all"
                              style={{
                                borderColor: form.attending === 'no' ? 'white' : C.blue,
                                backgroundColor: form.attending === 'no' ? 'white' : 'transparent'
                              }}
                            >
                              {form.attending === 'no' && <span style={{ color: C.blue, fontSize: '18px', fontWeight: 'bold' }}>✓</span>}
                            </div>
                            <input type="checkbox" checked={form.attending === 'no'} onChange={() => setForm({ ...form, attending: form.attending === 'no' ? '' : 'no', additionalGuests: form.additionalGuests.map(g => ({ ...g, attending: false })), guests: 0 })} className="sr-only" />
                            <span className="text-base md:text-lg font-medium">{t.rsvp.fields.no}</span>
                          </label>
                        </div>
                      </div>

                      {/* Who will attend - only show for multi-guest parties when attending */}
                      {form.attending === 'yes' && maxGuests && maxGuests > 1 && (
                        <div className="p-4 rounded-xl" style={{ backgroundColor: C.creamDark }}>
                          <p className="text-sm font-medium mb-3" style={{ color: C.blue }}>
                            {lang === 'es' ? 'Selecciona quiénes asistirán:' : 'Select who will attend:'}
                          </p>
                          <div className="space-y-3">
                            {/* Primary guest - always attending if they selected yes */}
                            <div className="flex items-center gap-4 p-3 rounded-lg bg-white">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.blue, boxShadow: '0 2px 8px rgba(91,123,148,0.3)' }}>
                                <span className="text-white text-lg font-bold">✓</span>
                              </div>
                              <span className="text-base font-medium" style={{ color: C.blue }}>{form.name}</span>
                              <span className="text-xs ml-auto px-2 py-1 rounded-full" style={{ color: C.blueLight, backgroundColor: 'rgba(91,123,148,0.1)' }}>({lang === 'es' ? 'tú' : 'you'})</span>
                            </div>
                            {/* Additional guests */}
                            {form.additionalGuests.map((guest, index) => (
                              <label key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white cursor-pointer hover:shadow-md transition-all">
                                <div
                                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                                  style={{
                                    border: `3px solid ${C.blue}`,
                                    backgroundColor: guest.attending !== false ? C.blue : 'white',
                                    boxShadow: guest.attending !== false ? '0 2px 8px rgba(91,123,148,0.3)' : 'none'
                                  }}
                                >
                                  {guest.attending !== false && <span className="text-white text-lg font-bold">✓</span>}
                                </div>
                                <input
                                  type="checkbox"
                                  checked={guest.attending !== false}
                                  onChange={(e) => {
                                    const newGuests = [...form.additionalGuests];
                                    newGuests[index] = { ...newGuests[index], attending: e.target.checked };
                                    setForm({ ...form, additionalGuests: newGuests, guests: 1 + newGuests.filter(g => g.attending !== false).length });
                                  }}
                                  className="sr-only"
                                />
                                <span className="text-base font-medium" style={{ color: guest.attending !== false ? C.blue : C.blueLight }}>
                                  {guest.name}
                                </span>
                                {guest.attending === false && (
                                  <span className="text-xs ml-auto" style={{ color: C.blueLight }}>
                                    {lang === 'es' ? 'Click para añadir' : 'Click to add'}
                                  </span>
                                )}
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Primary guest section - for multi-guest parties */}
                      {form.attending === 'yes' && maxGuests && maxGuests > 1 && (
                        <div className="p-4 rounded-xl border-t-4" style={{ backgroundColor: C.creamDark, borderTopColor: C.gold }}>
                          <p className="text-base font-medium mb-3" style={{ color: C.blue }}>
                            1. {form.name}
                          </p>

                          <div className="mb-3">
                            <label className="block text-xs mb-1" style={{ color: C.blue }}>
                              {lang === 'es' ? 'Correo electrónico (opcional)' : 'Email (optional)'}
                            </label>
                            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border bg-white text-sm" style={{ borderColor: '#E8E4DF' }} />
                          </div>

                          <div>
                            <label className="block text-xs mb-1" style={{ color: C.blue }}>
                              {lang === 'es' ? 'Alergias o restricciones' : 'Allergies or restrictions'}
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                              {t.rsvp.fields.allergyOpts.map(a => (
                                <button
                                  key={a}
                                  type="button"
                                  onClick={() => toggleAllergy(a)}
                                  className="px-3 py-1.5 rounded-full text-xs transition-all"
                                  style={{ border: '1px solid', borderColor: form.allergies.includes(a) ? C.blue : '#E8E4DF', backgroundColor: form.allergies.includes(a) ? C.blue : 'white', color: form.allergies.includes(a) ? 'white' : C.blueLight }}
                                >{a}</button>
                              ))}
                              <button
                                type="button"
                                onClick={() => toggleAllergy('Otra')}
                                className="px-3 py-1.5 rounded-full text-xs transition-all"
                                style={{ border: '1px solid', borderColor: form.allergies.includes('Otra') ? C.blue : '#E8E4DF', backgroundColor: form.allergies.includes('Otra') ? C.blue : 'white', color: form.allergies.includes('Otra') ? 'white' : C.blueLight }}
                              >{lang === 'es' ? 'Otra' : 'Other'}</button>
                            </div>
                            {form.allergies.includes('Otra') && (
                              <input
                                type="text"
                                value={form.other}
                                onChange={e => setForm({ ...form, other: e.target.value })}
                                placeholder={lang === 'es' ? 'Especifica tu restricción...' : 'Specify your restriction...'}
                                className="w-full mt-2 px-3 py-2 rounded-lg border bg-white text-sm"
                                style={{ borderColor: '#E8E4DF' }}
                              />
                            )}
                          </div>
                        </div>
                      )}

                      {/* Single guest - show email and allergies without numbered header */}
                      {form.attending === 'yes' && (!maxGuests || maxGuests === 1) && (
                        <>
                          <div className="">
                            <label className="block text-xs md:text-sm mb-1 md:mb-1.5" style={{ color: C.blue }}>{t.rsvp.fields.email}</label>
                            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border bg-white text-sm md:text-base" style={{ borderColor: '#E8E4DF' }} />
                          </div>

                          <div>
                            <label className="block text-xs md:text-sm mb-1.5 md:mb-2" style={{ color: C.blue }}>
                              {lang === 'es' ? 'Alergias o restricciones' : 'Allergies or restrictions'}
                            </label>
                            <div className="flex flex-wrap gap-1.5 md:gap-2">
                              {t.rsvp.fields.allergyOpts.map(a => (
                                <button
                                  key={a}
                                  type="button"
                                  onClick={() => toggleAllergy(a)}
                                  className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition-all"
                                  style={{ border: '1px solid', borderColor: form.allergies.includes(a) ? C.blue : '#E8E4DF', backgroundColor: form.allergies.includes(a) ? C.blue : 'white', color: form.allergies.includes(a) ? 'white' : C.blueLight }}
                                >{a}</button>
                              ))}
                              <button
                                type="button"
                                onClick={() => toggleAllergy('Otra')}
                                className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition-all"
                                style={{ border: '1px solid', borderColor: form.allergies.includes('Otra') ? C.blue : '#E8E4DF', backgroundColor: form.allergies.includes('Otra') ? C.blue : 'white', color: form.allergies.includes('Otra') ? 'white' : C.blueLight }}
                              >{lang === 'es' ? 'Otra' : 'Other'}</button>
                            </div>
                            {form.allergies.includes('Otra') && (
                              <input
                                type="text"
                                value={form.other}
                                onChange={e => setForm({ ...form, other: e.target.value })}
                                placeholder={lang === 'es' ? 'Especifica tu restricción...' : 'Specify your restriction...'}
                                className="w-full mt-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl border bg-white text-sm md:text-base"
                                style={{ borderColor: '#E8E4DF' }}
                              />
                            )}
                          </div>
                        </>
                      )}

                      {/* Additional guests - only show those who are attending */}
                      {form.attending === 'yes' && form.additionalGuests.filter(g => g.attending !== false).map((guest, index) => {
                        const originalIndex = form.additionalGuests.findIndex(g => g.name === guest.name);
                        return (
                          <div key={originalIndex} className="p-4 rounded-xl border-t-4" style={{ backgroundColor: C.creamDark, borderTopColor: C.gold }}>
                            <p className="text-base font-medium mb-3" style={{ color: C.blue }}>
                              {index + 2}. {guest.name}
                            </p>

                            <div className="mb-3">
                              <label className="block text-xs mb-1" style={{ color: C.blue }}>
                                {lang === 'es' ? 'Correo electrónico (opcional)' : 'Email (optional)'}
                              </label>
                              <input
                                type="email"
                                value={guest.email || ''}
                                onChange={e => updateAdditionalGuest(originalIndex, 'email', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border bg-white text-sm"
                                style={{ borderColor: '#E8E4DF' }}
                              />
                            </div>

                            <div>
                              <label className="block text-xs mb-1" style={{ color: C.blue }}>
                                {lang === 'es' ? 'Alergias o restricciones' : 'Allergies or restrictions'}
                              </label>
                              <div className="flex flex-wrap gap-1.5">
                                {t.rsvp.fields.allergyOpts.map(a => (
                                  <button
                                    key={a}
                                    type="button"
                                    onClick={() => toggleAdditionalGuestAllergy(originalIndex, a)}
                                    className="px-3 py-1.5 rounded-full text-xs transition-all"
                                    style={{ border: '1px solid', borderColor: guest.allergies.includes(a) ? C.blue : '#E8E4DF', backgroundColor: guest.allergies.includes(a) ? C.blue : 'white', color: guest.allergies.includes(a) ? 'white' : C.blueLight }}
                                  >{a}</button>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => toggleAdditionalGuestAllergy(originalIndex, 'Otra')}
                                  className="px-3 py-1.5 rounded-full text-xs transition-all"
                                  style={{ border: '1px solid', borderColor: guest.allergies.includes('Otra') ? C.blue : '#E8E4DF', backgroundColor: guest.allergies.includes('Otra') ? C.blue : 'white', color: guest.allergies.includes('Otra') ? 'white' : C.blueLight }}
                                >{lang === 'es' ? 'Otra' : 'Other'}</button>
                              </div>
                              {guest.allergies.includes('Otra') && (
                                <input
                                  type="text"
                                  value={guest.other}
                                  onChange={e => updateAdditionalGuest(originalIndex, 'other', e.target.value)}
                                  placeholder={lang === 'es' ? 'Especifica la restricción...' : 'Specify the restriction...'}
                                  className="w-full mt-2 px-3 py-2 rounded-lg border bg-white text-sm"
                                  style={{ borderColor: '#E8E4DF' }}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {form.attending === 'yes' && (
                        <>
                          <div>
                            <label className="block text-xs md:text-sm mb-1 md:mb-1.5" style={{ color: C.blue }}>{t.rsvp.fields.msg}</label>
                            <textarea value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border bg-white text-sm md:text-base resize-none" style={{ borderColor: '#E8E4DF' }} rows={3} />
                          </div>

                          <button
                            onClick={submitRSVP}
                            disabled={isSubmitting}
                            className="w-full py-3 md:py-4 rounded-full text-white flex items-center justify-center gap-2 text-xs md:text-sm tracking-wider transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            style={{
                              backgroundColor: C.blue,
                              boxShadow: isSubmitting ? 'none' : '0 4px 20px rgba(91,123,148,0.3)',
                              transform: isSubmitting ? 'scale(0.98)' : 'scale(1)'
                            }}
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {lang === 'es' ? 'Enviando...' : 'Sending...'}
                              </>
                            ) : (
                              <>
                                <Icons.Send /> {isUpdating
                                  ? (lang === 'es' ? 'Actualizar RSVP' : 'Update RSVP')
                                  : t.rsvp.fields.submit
                                }
                              </>
                            )}
                          </button>

                          {formError && (
                            <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
                              <p className="text-center text-sm text-red-500 mb-3">{formError}</p>
                              <div className="flex flex-row gap-4 justify-center items-center">
                                {[t.contact.marijo, t.contact.juanca].map((c, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <span className="text-xs" style={{ color: C.blue }}>{c.name}:</span>
                                    <button onClick={() => window.open(`https://wa.me/${c.wa}`, '_blank')} className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer" style={{ backgroundColor: C.blue, color: 'white' }}><Icons.Whatsapp /></button>
                                    <button onClick={() => window.open(`sms:${c.phone}`, '_self')} className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer" style={{ backgroundColor: C.blue, color: 'white' }}><Icons.Imessage /></button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {form.attending === 'no' && (
                        <>
                          {/* Who won't attend - only show for multi-guest parties */}
                          {maxGuests && maxGuests > 1 && (
                            <div className="p-4 rounded-xl" style={{ backgroundColor: C.creamDark }}>
                              <p className="text-sm font-medium mb-3" style={{ color: C.blue }}>
                                {lang === 'es' ? '¿Alguien más de tu grupo asistirá?' : 'Will anyone else from your group attend?'}
                              </p>
                              <div className="space-y-3">
                                {/* Primary guest - not attending since they selected no */}
                                <div className="flex items-center gap-4 p-3 rounded-lg bg-white opacity-70">
                                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ border: `3px solid #ccc`, backgroundColor: 'white' }}>
                                  </div>
                                  <span className="text-base font-medium line-through" style={{ color: '#999' }}>{form.name}</span>
                                  <span className="text-xs ml-auto px-2 py-1 rounded-full" style={{ color: '#999', backgroundColor: 'rgba(0,0,0,0.05)' }}>({lang === 'es' ? 'tú' : 'you'})</span>
                                </div>
                                {/* Additional guests */}
                                {form.additionalGuests.map((guest, index) => (
                                  <label key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white cursor-pointer hover:shadow-md transition-all">
                                    <div
                                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                                      style={{
                                        border: `3px solid ${guest.attending !== false ? C.blue : '#ccc'}`,
                                        backgroundColor: guest.attending !== false ? C.blue : 'white',
                                        boxShadow: guest.attending !== false ? '0 2px 8px rgba(91,123,148,0.3)' : 'none'
                                      }}
                                    >
                                      {guest.attending !== false && <span className="text-white text-lg font-bold">✓</span>}
                                    </div>
                                    <input
                                      type="checkbox"
                                      checked={guest.attending !== false}
                                      onChange={(e) => {
                                        const newGuests = [...form.additionalGuests];
                                        newGuests[index] = { ...newGuests[index], attending: e.target.checked };
                                        setForm({ ...form, additionalGuests: newGuests, guests: newGuests.filter(g => g.attending !== false).length });
                                      }}
                                      className="sr-only"
                                    />
                                    <span
                                      className="text-base font-medium"
                                      style={{
                                        color: guest.attending !== false ? C.blue : '#999',
                                        textDecoration: guest.attending === false ? 'line-through' : 'none'
                                      }}
                                    >
                                      {guest.name}
                                    </span>
                                    <span className="text-xs ml-auto" style={{ color: guest.attending !== false ? C.blue : '#999' }}>
                                      {guest.attending !== false
                                        ? (lang === 'es' ? 'Asistirá' : 'Attending')
                                        : (lang === 'es' ? 'No asistirá' : 'Not attending')
                                      }
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Allergy info for attending guests when primary selected "no" */}
                          {maxGuests && maxGuests > 1 && form.additionalGuests.filter(g => g.attending !== false).map((guest, index) => {
                            const originalIndex = form.additionalGuests.findIndex(g => g.name === guest.name);
                            return (
                              <div key={originalIndex} className="p-4 rounded-xl border-t-4" style={{ backgroundColor: C.creamDark, borderTopColor: C.gold }}>
                                <p className="text-base font-medium mb-3" style={{ color: C.blue }}>
                                  {index + 1}. {guest.name}
                                </p>

                                <div className="mb-3">
                                  <label className="block text-xs mb-1" style={{ color: C.blue }}>
                                    {lang === 'es' ? 'Correo electrónico (opcional)' : 'Email (optional)'}
                                  </label>
                                  <input
                                    type="email"
                                    value={guest.email || ''}
                                    onChange={e => updateAdditionalGuest(originalIndex, 'email', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border bg-white text-sm"
                                    style={{ borderColor: '#E8E4DF' }}
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs mb-1" style={{ color: C.blue }}>
                                    {lang === 'es' ? 'Alergias o restricciones' : 'Allergies or restrictions'}
                                  </label>
                                  <div className="flex flex-wrap gap-1.5">
                                    {t.rsvp.fields.allergyOpts.map(a => (
                                      <button
                                        key={a}
                                        type="button"
                                        onClick={() => toggleAdditionalGuestAllergy(originalIndex, a)}
                                        className="px-2.5 py-1 rounded-full text-xs transition-all"
                                        style={{
                                          backgroundColor: (guest.allergies || []).includes(a) ? C.blue : 'white',
                                          color: (guest.allergies || []).includes(a) ? 'white' : C.blue,
                                          border: `1px solid ${C.blue}`
                                        }}
                                      >
                                        {a}
                                      </button>
                                    ))}
                                  </div>
                                  <input
                                    type="text"
                                    value={guest.other || ''}
                                    onChange={e => updateAdditionalGuest(originalIndex, 'other', e.target.value)}
                                    placeholder={lang === 'es' ? 'Otro...' : 'Other...'}
                                    className="w-full mt-2 px-3 py-2 rounded-lg border bg-white text-sm"
                                    style={{ borderColor: '#E8E4DF' }}
                                  />
                                </div>
                              </div>
                            );
                          })}

                          <div className="">
                            <label className="block text-xs md:text-sm mb-1 md:mb-1.5" style={{ color: C.blue }}>{t.rsvp.fields.msg}</label>
                            <textarea value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border bg-white text-sm md:text-base resize-none" style={{ borderColor: '#E8E4DF' }} rows={3} />
                          </div>

                          <button
                            onClick={submitRSVP}
                            disabled={isSubmitting}
                            className="w-full py-3 md:py-4 rounded-full text-white flex items-center justify-center gap-2 text-xs md:text-sm tracking-wider transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            style={{
                              backgroundColor: C.blue,
                              boxShadow: isSubmitting ? 'none' : '0 4px 20px rgba(91,123,148,0.3)',
                              transform: isSubmitting ? 'scale(0.98)' : 'scale(1)'
                            }}
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {lang === 'es' ? 'Enviando...' : 'Sending...'}
                              </>
                            ) : (
                              <>
                                <Icons.Send /> {isUpdating
                                  ? (lang === 'es' ? 'Actualizar RSVP' : 'Update RSVP')
                                  : t.rsvp.fields.submit
                                }
                              </>
                            )}
                          </button>

                          {formError && (
                            <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
                              <p className="text-center text-sm text-red-500 mb-3">{formError}</p>
                              <div className="flex flex-row gap-4 justify-center items-center">
                                {[t.contact.marijo, t.contact.juanca].map((c, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <span className="text-xs" style={{ color: C.blue }}>{c.name}:</span>
                                    <button onClick={() => window.open(`https://wa.me/${c.wa}`, '_blank')} className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer" style={{ backgroundColor: C.blue, color: 'white' }}><Icons.Whatsapp /></button>
                                    <button onClick={() => window.open(`sms:${c.phone}`, '_self')} className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer" style={{ backgroundColor: C.blue, color: 'white' }}><Icons.Imessage /></button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }


  return (
  <div className="relative">
    {/* Global animation styles */}
    <style>{`
      @keyframes mjcDance {
        0%   { transform: translateY(0) rotate(-1.2deg) scale(1); }
        50%  { transform: translateY(-6px) rotate(1.2deg) scale(1.02); }
        100% { transform: translateY(0) rotate(-1.2deg) scale(1); }
      }
      @media (prefers-reduced-motion: reduce) {
        img[data-dance="true"] { animation: none !important; }
      }
    `}</style>
    <div
      style={{
        opacity: showSite ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
    >
      <div className="min-h-screen" style={{ backgroundColor: C.cream, fontFamily: FONTS.body }}>

      
      <nav className="fixed top-0 left-0 right-0 z-50 md:backdrop-blur-md" style={{ backgroundColor: C.cream, borderBottom: '1px solid rgba(91,123,148,0.1)' }}>
        <div className="max-w-5xl mx-auto px-3 md:px-4 py-2 md:py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl"
            aria-label="Open menu"
            style={{ color: C.blue }}
          >
            {mobileMenuOpen ? (
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            ) : (
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            )}
          </button>

          <div className="hidden lg:flex items-center gap-1.5 md:gap-2">
            <Img src="mjc_doodle_dancing_dark_blue.png" alt="Dancing" className="w-12 h-10 rounded" />
          </div>
          <div className="flex items-center gap-1.5 md:gap-4 text-xs md:text-sm leading-snug">
           {NAV_TARGETS[lang].map((item, i) =>
    item.action === "gifts" ? (
      <button
        key={i}
        onClick={goToGifts}
        className="hidden lg:block px-2 py-1 hover:opacity-70"
        style={{ color: C.blueLight }}
      >
        {item.label}
      </button>
    ) : (
      <a
        key={i}
        href={item.href}
        className="hidden lg:block px-2 py-1 hover:opacity-70"
        style={{ color: item.href === "#s0" ? C.blue : C.blueLight }}
      >
        {item.label}
      </a>
    )
  )}

  <a
    href="#s0"
    className="lg:hidden px-2.5 py-1 rounded-full text-white text-xs"
    style={{ backgroundColor: C.blue }}
    onClick={goToRsvp("yes")}
  >
    RSVP
  </a>

  <button
    onClick={() => setLang(lang === "es" ? "en" : "es")}
    className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm"
    style={{ border: `1px solid ${C.blue}`, color: C.blue }}
  >
    {t.lang}
  </button>
</div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop - click to close */}
            <div 
              className="lg:hidden fixed inset-0 top-[52px] z-40" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
            />
            <div className="lg:hidden absolute top-full left-0 right-0 shadow-lg z-50" style={{ backgroundColor: C.cream, borderTop: `1px solid ${C.bluePale}` }}>
              <div className="px-4 py-3 space-y-1">
                {[
                  { label: lang === 'es' ? 'RSVP' : 'RSVP', action: () => { setMobileMenuOpen(false); goToRsvp('yes')({ preventDefault: () => {} }); } },
                  { label: lang === 'es' ? 'Itinerario' : 'Itinerary', href: '#s1' },
                  { label: lang === 'es' ? 'Hospedaje' : 'Stay', href: '#s2' },
                  { label: lang === 'es' ? 'Vestimenta' : 'Dress Code', href: '#s3' },
                  { label: lang === 'es' ? 'Nuestra Historia' : 'Our Story', href: '#s4' },
                  { label: lang === 'es' ? 'Regalos' : 'Gifts', href: '#gifts' },
                  { label: 'FAQ', href: '#faq' },
                ].map((item, i) => (
                  item.action ? (
                    <button
                      key={i}
                      onClick={item.action}
                      className="block w-full text-left px-3 py-2.5 rounded-xl text-sm hover:opacity-70 transition-opacity"
                      style={{ color: C.blue }}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a
                      key={i}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2.5 rounded-xl text-sm hover:opacity-70 transition-opacity"
                      style={{ color: C.blue }}
                    >
                      {item.label}
                    </a>
                  )
                ))}
              </div>
            </div>
          </>
        )}
      </nav>

      <section className="min-h-screen flex flex-col items-center justify-center pt-12 md:pt-16 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><Img src="mjc_couple_vineyard_bw.jpg" alt="Background" className="w-full h-full" position="center 40%" /></div>
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${C.cream} 0%, transparent 30%, transparent 70%, ${C.cream} 100%)` }} />
        <div className="relative z-10 flex flex-col items-center mt-4 md:mt-0">
          <p className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-6 uppercase" style={{ color: C.blueLight }}>{t.hero.subtitle}</p>
         <div
            className="flex justify-center items-center overflow-visible"
            style={{
              height: "clamp(190px, 26vh, 280px)", // more room for the bigger title
              marginTop: 4,
            }}
          >
            <CoupleWordmark
              variant="hero"
              // optional: fine tune the & centering if needed
              // offsetPct={-3.2}
              style={{
                transform: "translateY(-10px)", // keep your optical vertical centering
              }}
            />
          </div>


          <p className="text-lg md:text-2xl mb-1" style={{ color: C.blue }}>{t.date.full}</p>
          <p className="text-sm md:text-base mb-6 md:mb-8" style={{ color: C.blueLight, fontStyle: 'italic' }}>{t.hero.location}</p>
          <div className="flex gap-3 md:gap-8 mb-6 md:mb-8">
            {[{ v: countdown.d, l: lang === 'es' ? 'días' : 'days', path: "M 50,2 C 75,-2 92,8 97,25 C 103,45 95,70 92,85 C 82,100 65,102 45,98 C 22,95 5,85 3,65 C 0,45 8,20 20,8 C 32,-2 42,4 50,2 Z" }, { v: countdown.h, l: lang === 'es' ? 'horas' : 'hours', path: "M 55,3 C 78,0 95,15 98,35 C 102,55 98,78 88,92 C 72,105 48,102 30,95 C 8,85 -2,65 2,42 C 6,20 25,5 55,3 Z" }, { v: countdown.m, l: 'min', path: "M 48,2 C 72,0 90,10 96,30 C 104,52 100,75 90,90 C 75,103 52,100 32,95 C 10,88 0,68 3,45 C 7,18 28,3 48,2 Z" }].map((x, i) => (
              <div key={i} className="relative text-center px-6 md:px-10 py-5 md:py-6" style={{ transform: `rotate(${i === 0 ? -2 : i === 1 ? 1 : -1}deg)` }}>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d={x.path} fill={C.cream} stroke={C.bluePale} strokeWidth="1.5" /></svg>
                <div className="relative z-10"><div className="text-2xl md:text-4xl font-light" style={{ color: C.blue }}>{x.v}</div><div className="text-xs md:text-sm tracking-wider" style={{ color: C.blueLight }}>{x.l}</div></div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-5">
            <a href="#s0" onClick={goToRsvp('yes')} className="px-8 md:px-14 py-4 md:py-6 rounded-full text-white text-lg md:text-2xl tracking-wider hover:scale-105 transition-transform font-medium text-center transform-gpu" style={{ backgroundColor: C.blue, boxShadow: '0 10px 35px rgba(91,123,148,0.5)' }}>{lang === 'es' ? 'Asistiré' : 'Will Attend'}</a>
            <a href="#s0" onClick={goToRsvp('no')} className="px-8 md:px-14 py-4 md:py-6 rounded-full text-lg md:text-2xl tracking-wider hover:scale-105 transition-transform font-medium text-center transform-gpu" style={{ backgroundColor: 'transparent', border: `2px solid ${C.blue}`, color: C.blue, boxShadow: '0 6px 25px rgba(91,123,148,0.15)' }}>{lang === 'es' ? 'No Asistiré' : 'Will Not Attend'}</a>
          </div>
          <p className="mt-8 md:mt-10 text-xs md:text-sm tracking-wider animate-bounce" style={{ color: C.blueLight }}>↓ {t.hero.scroll}</p>
        </div>
      </section>
      
      <section className="py-2 md:py-4"><Img src="mjc_couple_portrait.jpg" alt="Engagement" className="w-full h-[350px] md:h-[700px]" position="center 60%" /></section>

      <section id="s1" className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl text-center mb-2" style={{ color: C.blue, fontStyle: 'italic' }}>{t.itinerary.title}</h2>
          <p className="text-center text-xs md:text-sm mb-6 md:mb-8" style={{ color: C.blueLight }}>{t.itinerary.subtitle}</p>
          
          <MonthCalendar lang={lang} />
          
          <div className="space-y-6 md:space-y-8">
            {t.itinerary.days.map((dayGroup, di) => (
              <div key={di} className="flex gap-4 md:gap-6 items-start">
                <CalendarCard date={dayGroup.date} month={dayGroup.month} day={dayGroup.day} />
                
                <div className="flex-1 relative">
                  {dayGroup.events.length > 1 && (
                    <svg className="absolute left-6 top-16 bottom-16 w-2 hidden md:block" style={{ height: 'calc(100% - 8rem)' }}>
                      <path d="M 4,0 C 8,20 0,40 4,60 C 8,80 0,100 4,120 C 8,140 0,160 4,180" stroke={C.bluePale} strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="4 6" style={{ vectorEffect: 'non-scaling-stroke' }}/>
                    </svg>
                  )}
                  <div className="space-y-3 md:space-y-4">
                  {dayGroup.events.map((e, ei) => (
                    <HandDrawnCard key={ei} className="p-4 md:p-6">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center relative" style={{ backgroundColor: C.cream }}>
                            <ItineraryIcon type={e.icon} className="w-5 h-5 md:w-6 md:h-6" style={{ color: C.blue }} />
                            <DoodleSparkle size={10} color={C.gold} className="absolute -top-1 -right-1 opacity-80" />
                          </div>
                          <div>
                            <h3 className="text-lg md:text-xl font-medium" style={{ color: C.blue }}>{e.title}</h3>
                            {!e.tbd && <p className="text-sm md:text-base" style={{ color: C.blueLight }}>{e.time}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="ml-[52px] md:ml-[60px]" style={{ color: C.text }}>
                        <p className="text-sm md:text-base font-medium">{e.venue}</p>
                        {e.address && <p className="text-xs md:text-sm opacity-70">{e.address}</p>}
                      </div>
                    </HandDrawnCard>
                  ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Final details note */}
          <div
            className="mt-6 md:mt-8 text-center text-xs md:text-sm"
            style={{ color: C.blueLight, fontStyle: "italic" }}
          >
            {lang === "es"
              ? "Compartiremos horarios y detalles finales más cerca de la fecha."
              : "We'll share final schedules and details closer to the date."}
          </div>
        </div>
      </section>

     <section className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: C.cream }}>
      <div className="max-w-5xl mx-auto">
        <div className="relative mx-auto">
          {/* soft wash behind */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(90% 70% at 35% 30%, rgba(50,70,110,0.14), transparent 65%)," +
                "radial-gradient(80% 70% at 70% 65%, rgba(0,0,0,0.10), transparent 60%)",
              filter: "blur(16px)",
              opacity: 0.9,
            }}
          />

          <div className="relative">
            <img
              src="/images/cordoba_pencil_sketch.png"
              alt="Córdoba"
              draggable={false}
              className="w-full h-[260px] md:h-[420px] object-cover object-top"
              style={{
                // watercolor mask (this is the key)
                WebkitMaskImage: watercolorMaskUrl,
                maskImage: watercolorMaskUrl,
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",

                // watercolor feel
                mixBlendMode: "multiply",
                opacity: 0.9,
                filter: "contrast(1.03) saturate(0.78) blur(0.35px)",
              }}
            />

            {/* paper grain overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)",
                backgroundSize: "3px 3px",
                opacity: 0.10,
                mixBlendMode: "soft-light",
              }}
            />
          </div>
        </div>
      </div>
    </section>

    <section id="s2" className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: C.creamDark }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-4xl text-center mb-4 md:mb-6" style={{ color: C.blue, fontStyle: 'italic' }}>{t.hotels.title}</h2>
        {t.hotels.subtitle && <p className="text-center text-xs md:text-sm mb-2" style={{ color: C.blueLight }}>{t.hotels.subtitle}</p>}
        <p className="text-center text-xs md:text-sm mb-2" style={{ color: C.blueLight }}>{t.hotels.intro}</p>
        <p className="text-center text-xs md:text-sm mb-3 md:mb-4 italic" style={{ color: C.blueLight }}>{t.hotels.disclaimer}</p>
        {t.hotels.bookBy && <p className="text-center text-xs md:text-sm mb-6 md:mb-10 px-3 md:px-4 py-1.5 md:py-2 rounded-full mx-auto" style={{ backgroundColor: C.blue, color: C.cream, display: 'table' }}>{t.hotels.bookBy}</p>}
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {t.hotels.list.map((h, i) => {
            const rotations = ['-0.4deg', '0.5deg', '-0.6deg', '0.4deg', '-0.5deg', '0.3deg'];
            const cardPaths = [
              "M 2,4 Q 25,1 50,3 Q 75,1 98,4 Q 101,25 99,50 Q 101,75 98,96 Q 75,99 50,97 Q 25,99 2,96 Q -1,75 1,50 Q -1,25 2,4 Z",
              "M 3,3 Q 30,0 55,4 Q 80,1 97,3 Q 100,30 98,55 Q 101,80 97,97 Q 70,100 45,96 Q 20,100 3,97 Q 0,70 2,45 Q -1,20 3,3 Z",
              "M 4,2 Q 28,0 52,3 Q 76,0 96,2 Q 100,28 98,52 Q 101,76 96,98 Q 72,101 48,97 Q 24,101 4,98 Q 0,72 2,48 Q -1,24 4,2 Z",
              "M 2,3 Q 26,0 50,2 Q 74,0 98,3 Q 101,26 99,50 Q 102,74 98,97 Q 74,100 50,98 Q 26,101 2,97 Q -1,74 1,50 Q -2,26 2,3 Z",
              "M 3,4 Q 27,1 51,3 Q 75,0 97,4 Q 100,27 98,51 Q 101,75 97,97 Q 73,100 49,97 Q 25,100 3,97 Q 0,73 2,49 Q -1,25 3,4 Z",
              "M 2,2 Q 28,0 54,3 Q 78,0 98,2 Q 101,28 99,54 Q 102,78 98,98 Q 72,101 46,98 Q 22,101 2,98 Q -1,72 1,46 Q -2,22 2,2 Z"
            ];

            return (
            <a key={i} href={h.url} target="_blank" rel="noopener noreferrer" className="group relative block" style={{ transform: `rotate(${rotations[i % 6]})` }}>
              <svg className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d={cardPaths[i % 6]} fill={C.cream} stroke={C.bluePale} strokeWidth={"1.5"} vectorEffect="non-scaling-stroke"/>
              </svg>

              <div className="relative z-10 p-4 md:p-5">
                <div className="relative mb-3 overflow-hidden rounded-xl">
                  {/* Auto-scrolling synchronized images */}
                  <div className="relative w-full h-32 md:h-44">
                    {(h.images || [h.img]).map((img, imgIdx) => (
                      <div
                        key={imgIdx}
                        className="absolute inset-0 transition-opacity duration-700"
                        style={{ opacity: imgIdx === hotelImageIndex ? 1 : 0 }}
                      >
                        <Img src={img} alt={`${h.name} ${imgIdx + 1}`} className="w-full h-full group-hover:scale-105 transition-transform duration-300" position="center" />
                      </div>
                    ))}
                  </div>
                  {h.images && h.images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {h.images.map((_, dotIdx) => (
                        <div
                          key={dotIdx}
                          className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: dotIdx === hotelImageIndex ? 'white' : 'rgba(255,255,255,0.4)',
                            transform: dotIdx === hotelImageIndex ? 'scale(1.2)' : 'scale(1)'
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {h.top && (
                    <div className="absolute top-2 right-2">
                      <DoodleSparkle size={18} color={C.gold} />
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <h3 className="text-sm md:text-base font-medium leading-tight mb-1" style={{ color: C.blue }}>{h.name}</h3>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    {/* Stars derived from the number of € in the existing data */}
                    <div className="flex items-center gap-0.5 opacity-80" aria-label="Hotel rating">
                      {Array.from({ length: Math.min(5, (h.price || "").length || 0) }).map((_, si) => (
                        <DoodleStar key={si} size={14} color={C.blue} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs md:text-sm leading-snug" style={{ color: C.text }}>{h.note}</p>
                  {h.discountCode && (
                    <p className="mt-2 text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: C.creamDark, color: C.blue }}>
                      {lang === 'es' ? 'Código: ' : 'Code: '}<span className="font-bold">{h.discountCode}</span>
                    </p>
                  )}
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: C.blue, color: 'white' }}>{lang === 'es' ? 'Reservar' : 'Book'}</span>
                </div>
              </div>
            </a>
          )})}
        </div>
      </div>
      </section>

      <section
        id="transport"
        className="relative py-12 md:py-20 px-4 md:px-6 overflow-hidden"
      >
        {/* Background doodle */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/monclova_doodle.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "420px auto",
            backgroundPosition: "center",
            opacity: 0.3,
            filter: "contrast(1.05)",
          }}
        />
        
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl text-center mb-2 text-white" style={{color: C.blue}}>
            {t.transport.title}
          </h2>
          <p className="text-center text-xs md:text-sm mb-8 md:mb-10 text-white/70" style={{color: C.blue}}>
            {t.transport.subtitle}
          </p>

          <div className="relative">
            {/* Hand-drawn "paper" blob */}
            <svg
              className="absolute -inset-6 md:-inset-8 w-[calc(100%+48px)] md:w-[calc(100%+64px)] h-[calc(100%+48px)] md:h-[calc(100%+64px)]"
              viewBox="0 0 200 120"
              preserveAspectRatio="none"
              style={{ overflow: "visible" }}
            >
              <path
                d="M 8,10 Q 40,4 70,8 T 130,6 Q 165,4 192,12
                  Q 197,30 195,60 T 190,110
                  Q 165,116 130,112 T 70,114
                  Q 35,116 10,110
                  Q 3,85 6,60 T 8,10 Z"
                fill={C.cream}
                stroke={C.bluePale}
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <div className="relative z-10 pt-10 pb-10 px-6 md:p-8">
              <div className="space-y-5 md:space-y-6">
                {t.transport.cards.map((c, i) => (
                  <div key={i}>
                    <h3 className="text-lg md:text-2xl" style={{ color: C.blue, fontStyle: 'italic' }}>
                      {c.title}
                    </h3>

                    <p className="text-xs md:text-sm mt-2 leading-relaxed" style={{ color: C.text }}>
                      {c.text}
                    </p>

                    {/* divider, but not after last */}
                    {i !== t.transport.cards.length - 1 && (
                      <div className="mt-5 md:mt-6 h-px opacity-60" style={{ backgroundColor: C.bluePale }} />
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>


      <section id="s3" className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl text-center mb-2" style={{ color: C.blue, fontStyle: 'italic' }}>{t.dress.title}</h2>
          <p className="text-center text-xs md:text-sm mb-2" style={{ color: C.blueLight }}>{t.dress.subtitle}</p>
          <p className="text-center text-xs md:text-sm mb-6 md:mb-10" style={{ color: C.blue }}>{t.dress.note}</p>
          <div className="grid grid-cols-2 gap-3 md:gap-4 w-full max-w-lg mx-auto">
            {t.dress.codes.map((d, i) => {
              const images = d.inspo ? (Array.isArray(d.inspo) ? d.inspo : [d.inspo]) : [];
              return (
                <HandDrawnCard key={i} className="px-5 md:px-7 pt-8 md:pt-10 pb-5 md:pb-7 text-center">
                  <h3 className="text-base md:text-xl mb-2" style={{ color: C.blue }}>{d.event}</h3>
                  <p className="text-xs md:text-sm font-medium mb-4" style={{ color: C.blue }}>{d.code}</p>
                  {images.length > 0 && (
                    <div className="relative mb-3 rounded-xl" style={{ backgroundColor: C.creamDark }}>
                      {images.map((img, imgIdx) => (
                        <img
                          key={imgIdx}
                          src={`/images/${img}`}
                          alt={`${d.event} inspo ${imgIdx + 1}`}
                          className="w-full h-auto rounded-xl transition-opacity duration-700"
                          style={{
                            opacity: imgIdx === hotelImageIndex % images.length ? 1 : 0,
                            display: imgIdx === hotelImageIndex % images.length ? 'block' : 'none'
                          }}
                        />
                      ))}
                      {images.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {images.map((_, dotIdx) => (
                            <div
                              key={dotIdx}
                              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                              style={{
                                backgroundColor: dotIdx === hotelImageIndex % images.length ? 'white' : 'rgba(255,255,255,0.4)',
                                transform: dotIdx === hotelImageIndex % images.length ? 'scale(1.2)' : 'scale(1)'
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </HandDrawnCard>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 md:px-6 relative" style={{ backgroundColor: C.blue }}>
        <div className="absolute inset-0 opacity-20"><Img src="mjc_cordoba_mezquita.jpg" alt="Mezquita" className="w-full h-full" /></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl text-center mb-2 text-white" style={{ fontStyle: 'italic' }}>{t.travel.title}</h2>
          <p className="text-center text-xs md:text-sm mb-6 md:mb-10 text-white/70">{t.travel.subtitle}</p>
          <div className="grid md:grid-cols-3 gap-3 md:gap-4">
            {t.travel.sections.map((s, i) => (
              <HandDrawnCard key={i} className="p-4 md:p-5">
                <div style={{ color: C.blue }}>{getTravelIcon(s.icon)}</div>
                <h3 className="text-base md:text-lg mt-2 mb-1 md:mb-2" style={{ color: C.blue }}>{s.title}</h3>
                <p className="text-xs md:text-sm mb-2 md:mb-3" style={{ color: C.blueLight }}>{s.text}</p>
                <ul className="text-xs md:text-sm space-y-0.5 md:space-y-1" style={{ color: C.text }}>
                  {s.tips.map((tip, j) => <li key={j}>• {tip}</li>)}
                </ul>
                {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs md:text-sm underline" style={{ color: C.blue }}>{s.urlText}</a>}
              </HandDrawnCard>
            ))}
          </div>
        </div>
      </section>

      <section id="s0" className="py-16 md:py-24 px-4 md:px-6 relative" style={{ backgroundColor: C.cream }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-8 md:gap-10 items-center">
          {/* left: copy */}
          <div className="md:col-span-7">
            <h2 className="text-3xl md:text-6xl leading-tight" style={{ color: C.blue, fontStyle: "italic" }}>
              {t.rsvp.title}
            </h2>
            <p className="text-xs md:text-sm mt-3 max-w-md" style={{ color: C.blueLight }}>
              {t.rsvp.subtitle}
            </p>

            {/* deadline as “handwritten line” */}
            <div className="mt-6 inline-flex items-center gap-2">
              <span className="text-sm md:text-base" style={{ color: C.blue }}>
                🕊️ {t.rsvp.deadline}
              </span>
              <svg width="120" height="16" viewBox="0 0 120 16" className="opacity-60">
                <path
                  d="M2 10 C 20 2, 40 14, 60 8 S 100 12, 118 6"
                  fill="none"
                  stroke={C.goldDark}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <p className="mt-8 text-xs md:text-sm" style={{ color: C.blueLight, fontStyle: "italic" }}>
              {lang === "es" ? "¡Nos ayuda muchísimo saberlo con tiempo!" : "It helps us a lot to know in advance!"}
            </p>
          </div>

          {/* right: actions */}
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-5">
            <button
              onClick={goToRsvp("yes")}
              className="px-10 py-5 rounded-full text-white text-lg md:text-2xl tracking-wider hover:scale-105 transition-transform"
              style={{ backgroundColor: C.blue, boxShadow: "0 12px 30px rgba(91,123,148,0.35)" }}
            >
              {lang === "es" ? "Asistiré" : "Will Attend"}
            </button>

            <button
              onClick={goToRsvp("no")}
              className="px-10 py-5 rounded-full text-lg md:text-2xl tracking-wider hover:scale-105 transition-transform"
              style={{ backgroundColor: "white", border: `2px solid ${C.blue}`, color: C.blue }}
            >
              {lang === "es" ? "No Asistiré" : "Won't Attend"}
            </button>

            {/* tiny hint, no container */}
            <div className="flex items-center gap-2 justify-center opacity-70">
              <DoodleSparkle size={18} color={C.goldDark} />
              <span className="text-xs" style={{ color: C.blueLight }}>
                {lang === "es" ? "Toma 20 segundos" : "Takes 20 seconds"}
              </span>
            </div>
          </div>
        </div>
      </section>

  <section
    id="gifts"
    className="py-12 md:py-20 px-4 md:px-6 relative overflow-hidden"
    style={{ backgroundColor: C.blue }}
  >
    {/* Background doodle */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/images/kyoto.jpg')",
              backgroundRepeat: "repeat",
              backgroundSize: "420px auto",
              backgroundPosition: "center",
              opacity: 0.3,
              filter: "contrast(1.05)",
            }}
          />
      {/* soft vignette so text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(70% 60% at 50% 40%, rgba(0,0,0,0.15), rgba(0,0,0,0.45))`,
          opacity: 0.55,
        }}
      />


          <div className="max-w-4xl mx-auto relative">
            <WigglyPostcard className="mx-auto max-w-3xl">
              <div
                className="px-6 pt-10 pb-7 md:px-10 md:pt-14 md:pb-10 text-center relative"
                style={{
                  backgroundColor: "transparent",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.20)"
                }}
              >
                

                <div className="relative z-10">
                  <h2 className="text-2xl md:text-4xl mb-4 md:mb-6" style={{ color: C.blue, fontStyle: "italic" }}>
                    {t.gifts.title}
                  </h2>

                  <p className="text-xs md:text-sm mb-4" style={{ color: C.blueLight, fontStyle: "italic" }}>
                    {t.gifts.subtitle}
                  </p>

                  <button
                    onClick={goToGifts}
                    className="px-8 md:px-10 py-3 md:py-4 rounded-full text-sm md:text-base hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: C.blue,
                      color: "white",
                      boxShadow: "0 10px 30px rgba(91,123,148,0.35)"
                    }}
                  >
                    {lang === "es" ? "Ver opciones" : "View options"}
                  </button>

                  <div className="mt-6 flex justify-center opacity-70">
                  </div>
                </div>
              </div>
            </WigglyPostcard>
          </div>
      </section>

      <section
        id="faq"
        className="py-12 md:py-20 px-4 md:px-6"
        style={{ backgroundColor: C.cream }}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-2xl md:text-4xl text-center mb-6 md:mb-10"
            style={{ color: C.blue, fontStyle: "italic" }}
          >
            {t.faq.title}
          </h2>

          {t.faq.items.map((f, i) => (
            <FAQWiggleCard
              key={i}
              className="mb-3 md:mb-4 rounded-2xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
            >
              {/* tiny stroke clearance */}
              <div className="p-1.5 md:p-2">
                {/* asymmetric safe zone + anchor for icon */}
                <div className="relative pl-9 pr-7 md:pl-11 md:pr-9 py-4 md:py-5">
                  {/* Plus / Minus — pinned to top-right of the card */}
                  <span
                    className="absolute top-2.5 md:top-0 right-6 md:right-8 text-lg md:text-xl select-none"
                    style={{ color: C.blue }}
                    aria-hidden="true"
                  >
                    {expandedFaq === i ? "−" : "+"}
                  </span>

                  {/* Question */}
                  <div className="w-full text-left">
                    <span
                      className="block text-sm md:text-base pr-10 md:pr-12 leading-snug break-words"
                      style={{ color: C.blue }}
                    >
                      {f.q}
                    </span>
                  </div>

                  {/* Answer */}
                  {expandedFaq === i && (
                    <div
                      className="pt-3 text-sm md:text-base leading-relaxed break-words"
                      style={{ color: C.blueLight }}
                    >
                      {f.a}
                    </div>
                  )}
                </div>
              </div>
            </FAQWiggleCard>
          ))}
        </div>
      </section>


      
      <section className="relative h-48 md:h-80"><Img src="mjc_ring_bw.jpg" alt="Ring" className="w-full h-full" /><div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(91,123,148,0.4)' }}><p className="text-white text-xl md:text-4xl flex items-center gap-2" style={{ fontStyle: 'italic' }}>Sí, quiero</p></div></section>

      <section id="s4" className="py-12 md:py-20 px-4 md:px-6 relative overflow-visible" style={{ backgroundColor: C.creamDark }}>
        <StoryTimeline items={t.story.items} intro={t.story.intro} title={t.story.title} subtitle={t.story.subtitle} />
      </section>

      <footer className="relative py-6 md:py-10 text-center overflow-hidden" style={{ backgroundColor: C.blue }}>
        <div className="absolute inset-0 opacity-10"><Img src="mjc_couple_vineyard.jpg" alt="Footer" className="w-full h-full" /></div>
        <div className="relative z-10">
          <Img src="mjc_doodle_dancing_dark_blue.png" alt="Dancing" className="w-20 h-16 md:w-32 md:h-28 rounded-xl mx-auto -mb-10 md:-mb-16 opacity-70" style={{ filter: 'brightness(0) invert(1)' }}/>
          <CoupleWordmark
            variant="footer"
            offsetPct={2}
            style={{
              filter: "brightness(0) invert(1)",
              marginTop: "-20px",
              marginBottom: "-24px",
            }}
          />
          <p className="text-white/60 text-xs -mt-6">{t.date.full} · {t.hero.location}</p>
          <p className="text-white/80 text-sm md:text-base mt-2">{t.footer.hash}</p>

          <div className="mt-4 md:mt-5 mb-3">
            <p className="text-white/50 text-xs mb-2">{lang === 'es' ? '¿Preguntas? Contáctanos' : 'Questions? Contact us'}</p>
            <div className="flex flex-col md:flex-row gap-3 md:gap-6 justify-center items-center">
              {[t.contact.marijo, t.contact.juanca].map((c, i) => (
                <div key={i} className="flex items-center gap-2 relative z-30">
                  <span className="text-white/70 text-xs">{c.name}:</span>
                  <button onClick={() => window.open(`https://wa.me/${c.wa}`, '_blank')} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}><Icons.Whatsapp /></button>
                  <button onClick={() => window.open(`sms:${c.phone}`, '_self')} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}><Icons.Imessage /></button>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/40 text-xs mt-4 flex items-center justify-center gap-1">{t.footer.made} <Icons.Heart /></p>
        </div>
      </footer>
    </div>
    </div>
    </div>
  );
}