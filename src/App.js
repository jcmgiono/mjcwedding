import React, { useState, useEffect } from 'react';

const C = {
  blue: '#60798D',
  blueDark: '#4F6374',
  blueLight: '#8096A8',
  bluePale: '#B1BFCA',
  cream: '#F6F0E7',
  creamDark: '#EEE6DC',
  gold: '#D4C4A8',
  goldLight: '#EDE5D8',
  goldDark: '#B8A888',
  text: '#5E6F7E',
};

const SHEETS_URL = 'https://script.google.com/macros/s/YOUR_NEW_SCRIPT_ID_HERE/exec';

// Alternative: Use a Google Form or Formspree as backup

const CoupleWordmark = ({ className = "", style = {} }) => {
  return (
    <div className={className} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img src="/images/mjc_doodle_names.png" alt="Marijo & Juanca" style={{ width: '100%', height: 'auto', ...style }} draggable={false} />
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
  Imessage: () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2A1.5 1.5 0 003.8 21.454l3.032-.892A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>)
};

const DoodleHeart = ({ size = 24, color = C.blue, filled = false, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={filled ? color : "none"} stroke={color} strokeWidth="2"/>
  </svg>
);

const DoodleRings = ({ size = 24, color = C.blue, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
    <circle cx="9" cy="12" r="5" fill="none" stroke={color} strokeWidth="2"/>
    <circle cx="15" cy="12" r="5" fill="none" stroke={color} strokeWidth="2"/>
    <path d="M15 7l2-3 2 3" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DoodleRose = ({ size = 24, color = C.blue, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
    <path d="M12 22c0-4 0-8 0-10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 18c-2-1-3-3-2-5 1 1 3 1 4 0" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 18c2-1 3-3 2-5-1 1-3 1-4 0" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <ellipse cx="12" cy="8" rx="4" ry="5" fill="none" stroke={color} strokeWidth="2"/>
    <path d="M10 6c0 2 1 3 2 3s2-1 2-3" fill="none" stroke={color} strokeWidth="1.5"/>
    <path d="M9 8c1 1 2 1 3 0" fill="none" stroke={color} strokeWidth="1"/>
  </svg>
);

const DoodleSparkle = ({ size = 24, color = C.blue, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
    <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DoodleLeaf = ({ size = 24, color = C.blue, className = "", flip = false }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={{ transform: flip ? 'scaleX(-1)' : 'none' }}>
    <path d="M6 21c0-9 9-15 15-15-3 6-6 12-15 15z" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M7 20c4-4 8-8 12-12" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
  </svg>
);

const DoodleBow = ({ size = 24, color = C.blue, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
    <path d="M12 12c-3-2-6-2-6 1s3 4 6 3" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 12c3-2 6-2 6 1s-3 4-6 3" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 16c1 2 1 4 0 6" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 16c-1 2-1 4 0 6" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const DoodleChampagne = ({ size = 24, color = C.blue, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
    <path d="M9 2h6l-1 10H10L9 2z" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12v6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 22h8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 18h0" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <path d="M7 4l-2-2M17 4l2-2M6 7l-2 0M18 7l2 0" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const Img = ({ src, alt, className = "", style = {}, position = "center" }) => {
  const [error, setError] = React.useState(false);
  if (error) return (<div className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`} style={style}><div className="text-center p-4"><Icons.Image /><p className="text-sm mt-2">Image unavailable</p></div></div>);
  return <img src={`/images/${src}`} alt={alt} className={`object-cover ${className}`} style={{ objectPosition: position, ...style }} onError={() => setError(true)} />;
};

const SideDoodles = ({ stroke = 'rgba(96,121,141,0.38)' }) => {
  const [scene, setScene] = React.useState(0);
  const scenesCount = 7;
  React.useEffect(() => {
    let raf = null;
    const onScroll = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = null; const vh = Math.max(window.innerHeight || 0, 1); setScene(Math.floor(window.scrollY / (vh * 2)) % scenesCount); }); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  const VinePath = ({ variant = 0, dx = 0, opacity = 1, width = 2.2 }) => {
    const vines = [`M85 20 C58 100, 110 170, 70 245 C40 320, 116 400, 74 470 C44 545, 115 620, 72 700 C38 785, 110 860, 76 940 C52 1015, 106 1090, 72 1160`,`M82 20 C54 95, 118 165, 72 240 C36 315, 112 395, 78 470 C44 550, 120 625, 74 705 C38 790, 110 860, 80 945 C56 1020, 110 1095, 74 1160`,`M88 20 C60 105, 112 175, 74 250 C38 328, 120 402, 70 480 C42 555, 116 630, 78 710 C44 790, 110 862, 74 940 C48 1018, 112 1092, 78 1160`,`M84 20 C56 95, 112 165, 68 240 C36 312, 118 390, 72 470 C44 546, 112 622, 76 705 C44 785, 112 862, 70 940 C48 1016, 110 1092, 74 1160`];
    return <path d={vines[variant % vines.length]} transform={`translate(${dx} 0)`} stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={opacity} />;
  };
  const Leaves = () => (<g fill="none" stroke={stroke} strokeWidth="1.9" opacity="0.9" strokeLinecap="round" strokeLinejoin="round">{[{ x: 58, y: 150, flip: 1 }, { x: 92, y: 260, flip: -1 }, { x: 60, y: 420, flip: 1 }, { x: 94, y: 560, flip: -1 }, { x: 62, y: 720, flip: 1 }, { x: 94, y: 860, flip: -1 }, { x: 64, y: 1020, flip: 1 }].map((p, i) => (<path key={i} d="M0 0 C6 -10, 22 -10, 28 -2 C18 10, 8 12, 0 0 Z" transform={`translate(${p.x} ${p.y}) scale(${p.flip} 1) rotate(${p.flip === 1 ? -8 : 10})`} />))}</g>);
  const DoodleSvg = ({ mirrored = false }) => (<svg viewBox="0 0 160 1200" className={`h-full w-full ${mirrored ? 'scale-x-[-1]' : ''}`}><VinePath variant={scene} dx={-12} opacity={0.55} width={2.0} /><VinePath variant={scene + 1} dx={0} opacity={0.92} width={2.4} /><VinePath variant={scene + 2} dx={12} opacity={0.55} width={2.0} /><Leaves /></svg>);
  return (<><div className="hidden lg:block fixed inset-y-0 left-0 w-28 xl:w-32 pointer-events-none z-20 opacity-95"><DoodleSvg /></div><div className="hidden lg:block fixed inset-y-0 right-0 w-28 xl:w-32 pointer-events-none z-20 opacity-95"><DoodleSvg mirrored /></div></>);
};

const FloatingDoodles = () => {
  const doodles = [
    { type: 'heart', x: '2%', y: '5%', size: 32, rotate: -15, opacity: 0.7 },
    { type: 'rings', x: '5%', y: '18%', size: 30, rotate: 10, opacity: 0.6 },
    { type: 'rose', x: '3%', y: '32%', size: 34, rotate: -8, opacity: 0.7 },
    { type: 'sparkle', x: '6%', y: '48%', size: 26, rotate: 15, opacity: 0.65 },
    { type: 'leaf', x: '2%', y: '62%', size: 30, rotate: -12, opacity: 0.7 },
    { type: 'bow', x: '5%', y: '78%', size: 28, rotate: 8, opacity: 0.6 },
    { type: 'champagne', x: '3%', y: '92%', size: 30, rotate: -5, opacity: 0.7 },
    { type: 'rings', x: '92%', y: '8%', size: 30, rotate: 18, opacity: 0.7 },
    { type: 'heart', x: '94%', y: '22%', size: 28, rotate: -10, opacity: 0.6 },
    { type: 'champagne', x: '91%', y: '38%', size: 32, rotate: 5, opacity: 0.7 },
    { type: 'rose', x: '95%', y: '52%', size: 30, rotate: -15, opacity: 0.65 },
    { type: 'bow', x: '92%', y: '68%', size: 28, rotate: 8, opacity: 0.7 },
    { type: 'sparkle', x: '94%', y: '82%', size: 26, rotate: -12, opacity: 0.6 },
    { type: 'heart', x: '91%', y: '95%', size: 32, rotate: 15, opacity: 0.7 },
    { type: 'sparkle', x: '12%', y: '12%', size: 20, rotate: 25, opacity: 0.5 },
    { type: 'leaf', x: '85%', y: '15%', size: 22, rotate: -20, opacity: 0.5, flip: true },
    { type: 'heart', x: '15%', y: '42%', size: 22, rotate: -30, opacity: 0.5 },
    { type: 'rings', x: '82%', y: '45%', size: 24, rotate: 22, opacity: 0.5 },
    { type: 'rose', x: '13%', y: '72%', size: 24, rotate: 35, opacity: 0.5 },
    { type: 'bow', x: '84%', y: '75%', size: 22, rotate: -25, opacity: 0.5 },
  ];

  const renderDoodle = (d, i) => {
    const style = { left: d.x, top: d.y, transform: `rotate(${d.rotate}deg)`, opacity: d.opacity };
    const props = { size: d.size, color: C.blue, className: "absolute", key: i };
    switch (d.type) {
      case 'heart': return <div style={style} className="absolute" key={i}><DoodleHeart {...props} /></div>;
      case 'rings': return <div style={style} className="absolute" key={i}><DoodleRings {...props} /></div>;
      case 'rose': return <div style={style} className="absolute" key={i}><DoodleRose {...props} /></div>;
      case 'sparkle': return <div style={style} className="absolute" key={i}><DoodleSparkle {...props} /></div>;
      case 'leaf': return <div style={style} className="absolute" key={i}><DoodleLeaf {...props} flip={d.flip} /></div>;
      case 'bow': return <div style={style} className="absolute" key={i}><DoodleBow {...props} /></div>;
      case 'champagne': return <div style={style} className="absolute" key={i}><DoodleChampagne {...props} /></div>;
      default: return null;
    }
  };

  return (
    <div className="absolute inset-0 overflow-visible pointer-events-none" style={{ zIndex: 0 }}>
      {doodles.map(renderDoodle)}
    </div>
  );
};

const StoryTimeline = ({ items, intro, title, subtitle }) => {
  const itemDoodles = [
    { top: DoodleSparkle, bottom: DoodleLeaf },
    { top: DoodleRings, bottom: DoodleHeart },
    { top: DoodleRose, bottom: DoodleBow },
    { top: DoodleChampagne, bottom: DoodleSparkle },
  ];

  return (
    <div className="relative">
      <FloatingDoodles />
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-2xl md:text-4xl text-center mb-2" style={{ color: C.blue, fontStyle: 'italic' }}>{title}</h2>
        <p className="text-center text-xs md:text-sm mb-3 md:mb-4" style={{ color: C.blueLight }}>{subtitle}</p>
        <p className="text-center text-sm md:text-base mb-10 md:mb-16 leading-relaxed max-w-2xl mx-auto" style={{ color: C.blueLight, fontStyle: 'italic' }}>{intro}</p>
        
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 hidden md:block" style={{ background: `linear-gradient(180deg, transparent 0%, ${C.bluePale} 5%, ${C.bluePale} 95%, transparent 100%)` }} />
          <div className="absolute left-8 top-0 bottom-0 w-0.5 md:hidden" style={{ background: `linear-gradient(180deg, transparent 0%, ${C.bluePale} 5%, ${C.bluePale} 95%, transparent 100%)` }}/>

          {items.map((item, i) => {
            const doodle = itemDoodles[i % itemDoodles.length];
            const TopDoodle = doodle.top;
            const BottomDoodle = doodle.bottom;
            
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
                  <TopDoodle size={14} className="absolute -top-2 -right-1 opacity-70" color={C.blue}/>
                  <BottomDoodle size={12} className="absolute -bottom-1 -left-2 opacity-60" color={C.blue}/>
                </div>
                <div className="w-5/12 relative">
                  <div className="relative group">
                    <TopDoodle size={20} className={`absolute -top-3 ${i % 2 === 0 ? '-left-3' : '-right-3'} opacity-70 z-10`} color={C.blue}/>
                    <BottomDoodle size={16} className={`absolute -bottom-2 ${i % 2 === 0 ? '-right-2' : '-left-2'} opacity-60 z-10`} color={C.blue}/>
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
                    <TopDoodle size={16} className="absolute -top-2 -right-1 opacity-70 z-10" color={C.blue}/>
                    <Img src={item.img} alt={item.title} className="w-full h-36 rounded-xl" style={{ border: `2px solid ${C.cream}` }}/>
                  </div>
                </div>
              </div>
            </div>
          )})}

          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-4">
              <DoodleLeaf size={20} color={C.blue} className="opacity-60"/>
              <DoodleRose size={22} color={C.blue} className="opacity-70"/>
              <DoodleRings size={28} color={C.blue}/>
              <DoodleHeart size={24} color={C.blue} filled={true}/>
              <DoodleRings size={28} color={C.blue}/>
              <DoodleRose size={22} color={C.blue} className="opacity-70"/>
              <DoodleLeaf size={20} color={C.blue} className="opacity-60" flip={true}/>
            </div>
          </div>
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
    nav: ["Confirmar", "Itinerario", "Hospedaje", "Vestimenta", "Historia", "Regalos", "FAQ", "Contacto"],
    story: { title: "Nuestra Historia", subtitle: "6 años de amor", intro: "Algo en todos estos años dejó macerar la forma de amor que sentimos por el otro... lo que nos permite elegirnos día a día de forma libre y poder mirarnos y acompañarnos con más amor, aceptación, paciencia, apañe y ternura.",
      items: [
        { year: "2019", title: "Nos Conocimos", text: "El destino nos cruzó hace 6 años. Una mirada, una sonrisa, y supimos que algo especial estaba comenzando.", img: "mjc_couple_portrait.jpg" },
        { year: "8 Feb 2020", title: "Empezamos a Salir", text: "Justo antes de que el mundo cambiara, nosotros empezamos nuestra aventura juntos.", img: "mjc_couple_vineyard.jpg" },
        { year: "21 Feb 2025", title: "La Propuesta", text: "En Napa Valley, entre viñedos y bajo el cielo de California, Juanca se arrodilló y le pidió a Marijo que fuera su compañera de vida.", img: "mjc_ring_closeup.jpg" },
        { year: "1 Oct 2026", title: "Para Siempre", text: "Celebramos nuestro amor en la hermosa Córdoba, rodeados de quienes más queremos.", img: "mjc_cordoba_mezquita.jpg" }
      ]
    },
    itinerary: { title: "Itinerario", subtitle: "Celebra con nosotros", days: [
      { day: "Miércoles", date: "30", month: "Sep", events: [
        { title: "Rompe Hielo", time: "20:00", venue: "Por confirmar", dress: "Smart Casual", desc: "Una noche de tapas, vino y reencuentros.", tbd: true, icon: "sunset" }
      ]},
      { day: "Jueves", date: "1", month: "Oct", events: [
        { title: "La Ceremonia", time: "16:00", venue: "Por confirmar", dress: "Formal", desc: "Nos damos el 'Sí, quiero' rodeados de historia y amor.", tbd: true, icon: "church" },
        { title: "La Celebración", time: "20:00", venue: "Por confirmar", dress: "Etiqueta", desc: "Cena bajo las estrellas, música y baile.", tbd: true, icon: "sparkles" }
      ]}
    ]},
    hotels: { title: "Hospedaje", subtitle: "Dónde Quedarse", bookBy: "Reserva antes del 1 Ago 2026", intro: "Hoteles seleccionados por su ubicación y encanto.", list: [{ name: "Hospes Palacio del Bailío", dist: "5 min", price: "€€€€", note: "Palacio siglo XVI. Código: BODA26", top: true, img: "hotel_hospes.jpg", url: "#" },{ name: "Hotel Balcón de Córdoba", dist: "8 min", price: "€€€", note: "Vistas a la Mezquita", top: false, img: "hotel_balcon.jpg", url: "#" },{ name: "Las Casas de la Judería", dist: "10 min", price: "€€€", note: "Casas históricas conectadas", top: false, img: "hotel_juderia.jpg", url: "#" },{ name: "Hotel Madinat", dist: "12 min", price: "€€", note: "Moderno, buena relación calidad-precio", top: false, img: "hotel_madinat.jpg", url: "#" }] },
    dress: { title: "Vestimenta", subtitle: "Qué Ponerse", note: "Octubre en Córdoba: 68-77°F de día, noches frescas.", codes: [{ event: "Rompe Hielo", code: "Smart Casual", desc: "Casual elegante. Lino, vestidos de verano.", icon: "Sunset", colors: ["Tonos tierra", "Pasteles"] },{ event: "Ceremonia", code: "Formal", desc: "Trajes, vestidos de cóctel.", icon: "Church", colors: ["Evitar blanco"] },{ event: "Celebración", code: "Etiqueta", desc: "Vestidos largos, trajes oscuros.", icon: "Sparkles", colors: ["Elegancia"] }] },
    travel: { title: "Cómo Llegar", subtitle: "Tu guía de viaje", sections: [{ icon: "Plane", title: "Por Avión", text: "Sevilla (SVQ) 1.5h, Málaga (AGP) 2h.", tips: ["Vuelos desde Europa", "Reserva temprano"] },{ icon: "Train", title: "Por Tren", text: "AVE: Madrid 1h 45min, Sevilla 45min.", tips: ["Reserva en renfe.com", "Muy cómodo"] },{ icon: "Car", title: "Por Coche", text: "Sevilla 1.5h, Madrid 4h, Málaga 2h.", tips: ["Parking difícil en centro", "GPS recomendado"] }] },
    gifts: { title: "Regalos", subtitle: "Vuestra presencia es el mejor regalo", msg: "Si deseáis hacernos un regalo, una contribución para nuestra luna de miel sería muy apreciada.", bank: { title: "Datos Bancarios", iban: "ES00 0000 0000 0000 0000 0000", swift: "XXXXESXX", holder: "Maria Jose Licona / Juan Carlos Moreno" }, cta: "Ver datos bancarios", note: "Bizum y PayPal también" },
    faq: { title: "Preguntas Frecuentes", items: [{ q: "¿Cómo será el clima?", a: "68-77°F de día, noches frescas. Trae chaqueta ligera." },{ q: "¿Puedo traer a mis hijos?", a: "Esta celebración es solo para adultos (18+)." },{ q: "¿Puedo llevar acompañante?", a: "Consulta tu invitación para detalles." },{ q: "¿Hay parking?", a: "Sí, y servicio de shuttle desde hoteles." },{ q: "¿Idioma de la ceremonia?", a: "Bilingüe: español e inglés." },{ q: "¿Aeropuerto más cercano?", a: "Sevilla (1.5h) o Málaga (2h)." },{ q: "¿Necesito visa?", a: "UE, EEUU, México: no necesitan visa hasta 90 días." },{ q: "¿Opciones vegetarianas?", a: "¡Sí! Indica restricciones en el formulario." }] },
    contact: { title: "¿Preguntas?", subtitle: "Estamos aquí para ayudaros", msg: "Cualquier duda, no dudéis en contactarnos.", marijo: { name: "Marijo", phone: "+1-832-388-9435", wa: "18323889435" }, juanca: { name: "Juanca", phone: "+1-915-588-9258", wa: "19155889258" } },
    rsvp: { title: "Confirma tu Asistencia", subtitle: "Esperamos contar contigo", deadline: "Confirma antes del 1 Ago 2026", fields: { name: "Nombre completo *", email: "Email (opcional)", attending: "¿Asistirás?", yes: "Sí, asistiré", no: "No podré", guests: "Número de invitados", allergies: "Alergias", allergyOpts: ["Frutos secos", "Mariscos", "Gluten", "Lácteos", "Vegetariano", "Vegano"], other: "Otras restricciones", msg: "Mensaje (opcional)", submit: "Enviar" }, thanks: { title: "¡Gracias!", subtitle: "Confirmación recibida", msg: "Estamos emocionados de celebrar contigo." } },
    footer: { made: "Hecho con amor", hash: "#MJC2026" },
    lang: "EN"
  },
  en: {
    couple: { name1: "Marijo", name2: "Juanca", full1: "Maria Jose Licona", full2: "Juan Carlos Moreno" },
    date: { full: "October 1, 2026", short: "01.10.26" },
    hero: { location: "Córdoba, Spain", scroll: "Scroll to discover" },
    nav: ["RSVP", "Itinerary", "Stay", "Dress Code", "Story", "Gifts", "FAQ", "Contact"],
    story: { title: "Our Story", subtitle: "6 years of love", intro: "Something in all these years allowed our love to mature... what allows us to choose each other day by day, freely, and to look at and accompany each other with more love, acceptance, patience, support and tenderness.",
      items: [
        { year: "2019", title: "We Met", text: "Destiny brought us together 6 years ago. One look, one smile, and we knew something special was beginning.", img: "mjc_couple_portrait.jpg" },
        { year: "Feb 8, 2020", title: "Started Dating", text: "Right before the world changed, we started our adventure together.", img: "mjc_couple_vineyard.jpg" },
        { year: "Feb 21, 2025", title: "The Proposal", text: "In Napa Valley, among vineyards and under California skies, Juanca got on one knee.", img: "mjc_ring_closeup.jpg" },
        { year: "Oct 1, 2026", title: "Forever", text: "We celebrate our love in beautiful Córdoba, surrounded by those we love most.", img: "mjc_cordoba_mezquita.jpg" }
      ]
    },
    itinerary: { title: "Itinerary", subtitle: "Celebrate with us", days: [
      { day: "Wednesday", date: "30", month: "Sep", events: [
        { title: "Ice Breaker", time: "8:00 PM", venue: "TBD", dress: "Smart Casual", desc: "Tapas, wine and reunions.", tbd: true, icon: "sunset" }
      ]},
      { day: "Thursday", date: "1", month: "Oct", events: [
        { title: "Ceremony", time: "4:00 PM", venue: "TBD", dress: "Formal", desc: "We say 'I do' surrounded by love.", tbd: true, icon: "church" },
        { title: "Celebration", time: "8:00 PM", venue: "TBD", dress: "Black Tie", desc: "Dinner, music and dancing.", tbd: true, icon: "sparkles" }
      ]}
    ]},
    hotels: { title: "Where to Stay", subtitle: "Accommodation", bookBy: "Book before Aug 1, 2026", intro: "Hotels selected for location and charm.", list: [{ name: "Hospes Palacio del Bailío", dist: "5 min", price: "€€€€", note: "16th century palace. Code: WEDDING26", top: true, img: "hotel_hospes.jpg", url: "#" },{ name: "Hotel Balcón de Córdoba", dist: "8 min", price: "€€€", note: "Mezquita views from rooftop", top: false, img: "hotel_balcon.jpg", url: "#" },{ name: "Las Casas de la Judería", dist: "10 min", price: "€€€", note: "Connected historic houses", top: false, img: "hotel_juderia.jpg", url: "#" },{ name: "Hotel Madinat", dist: "12 min", price: "€€", note: "Modern, great value", top: false, img: "hotel_madinat.jpg", url: "#" }] },
    dress: { title: "Dress Code", subtitle: "What to Wear", note: "October in Córdoba: 68-77°F days, cool evenings.", codes: [{ event: "Ice Breaker", code: "Smart Casual", desc: "Elevated casual. Linen, sundresses.", icon: "Sunset", colors: ["Earth tones", "Pastels"] },{ event: "Ceremony", code: "Formal", desc: "Suits, cocktail dresses.", icon: "Church", colors: ["Avoid white"] },{ event: "Celebration", code: "Black Tie", desc: "Gowns, dark suits.", icon: "Sparkles", colors: ["Elegant"] }] },
    travel: { title: "Getting There", subtitle: "Travel guide", sections: [{ icon: "Plane", title: "By Air", text: "Seville (SVQ) 1.5h, Málaga (AGP) 2h.", tips: ["Flights from Europe", "Book early"] },{ icon: "Train", title: "By Train", text: "AVE: Madrid 1h 45min, Seville 45min.", tips: ["Book at renfe.com", "Very comfortable"] },{ icon: "Car", title: "By Car", text: "Seville 1.5h, Madrid 4h, Málaga 2h.", tips: ["Downtown parking tricky", "GPS recommended"] }] },
    gifts: { title: "Gifts", subtitle: "Your presence is our greatest gift", msg: "If you'd like to give a gift, a honeymoon contribution would be appreciated.", bank: { title: "Bank Details", iban: "ES00 0000 0000 0000 0000 0000", swift: "XXXXESXX", holder: "Maria Jose Licona / Juan Carlos Moreno" }, cta: "View bank details", note: "Venmo and PayPal also accepted" },
    faq: { title: "FAQ", items: [{ q: "What's the weather like?", a: "68-77°F days, cool evenings. Bring a light jacket." },{ q: "Can I bring children?", a: "This celebration is adults only (18+)." },{ q: "Can I bring a plus one?", a: "Check your invitation for details." },{ q: "Is there parking?", a: "Yes, and shuttle service from hotels." },{ q: "What language is the ceremony?", a: "Bilingual: Spanish and English." },{ q: "Nearest airport?", a: "Seville (1.5h) or Málaga (2h)." },{ q: "Do I need a visa?", a: "EU, US, Mexico: no visa needed up to 90 days." },{ q: "Vegetarian options?", a: "Yes! Note restrictions in the RSVP form." }] },
    contact: { title: "Questions?", subtitle: "We're here to help", msg: "Any questions, don't hesitate to reach out.", marijo: { name: "Marijo", phone: "+1-832-388-9435", wa: "18323889435" }, juanca: { name: "Juanca", phone: "+1-915-588-9258", wa: "19155889258" } },
    rsvp: { title: "RSVP", subtitle: "We hope to celebrate with you", deadline: "Confirm by Aug 1, 2026", fields: { name: "Full name *", email: "Email (optional)", attending: "Will you attend?", yes: "Yes, I'll be there", no: "Can't make it", guests: "Number of guests", allergies: "Allergies", allergyOpts: ["Tree nuts", "Shellfish", "Gluten", "Dairy", "Vegetarian", "Vegan"], other: "Other restrictions", msg: "Message (optional)", submit: "Send" }, thanks: { title: "Thank You!", subtitle: "RSVP received", msg: "We're excited to celebrate with you." } },
    footer: { made: "Made with love", hash: "#MJC2026" },
    lang: "ES"
  }
};

const ItineraryIcon = ({ type, className = "", style = {} }) => {
  const icons = {
    sunset: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={style}><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" /><path d="M12 8a4 4 0 100 8 4 4 0 000-8z" /><path d="M4 19h16" /></svg>),
    church: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={style}><path d="M12 2v4m0 0l3 2v3H9V8l3-2z" /><path d="M6 11h12v10H6z" /><path d="M10 21v-4h4v4" /><path d="M12 6V2M10 4h4" /></svg>),
    sparkles: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={style}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" /><path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" /></svg>),
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

const getDressIcon = (n) => { const m = { Sunset: Icons.Sunset, Church: Icons.Church, Sparkles: Icons.Sparkles, Sun: Icons.Sun }; const I = m[n]; return I ? <I /> : null; };
const getTravelIcon = (n) => { const m = { Plane: Icons.Plane, Train: Icons.Train, Car: Icons.Car }; const I = m[n]; return I ? <I /> : null; };

// Guest codes - maps code to max allowed guests
const GUEST_CODES = {
  'FAMILIA2026': 4,
  'AMIGOS2026': 2,
  'PAREJA2026': 2,
  'SOLO2026': 1,
  'VIP2026': 6,
  // Add more codes as needed
};

// Japan honeymoon experiences for gifts
const GIFT_EXPERIENCES = {
  es: [
    { id: 1, title: 'Tour Gastronómico en Tokyo', desc: 'Explora los mejores ramen, sushi y street food de Tokyo con nosotros.', amount: 75, img: 'japan_food.jpg', emoji: '🍜' },
    { id: 2, title: 'Templos de Kyoto', desc: 'Visita guiada por los templos más icónicos de Kyoto incluyendo Fushimi Inari.', amount: 100, img: 'japan_temple.jpg', emoji: '⛩️' },
    { id: 3, title: 'Excursión al Monte Fuji', desc: 'Un día mágico contemplando el icónico Monte Fuji.', amount: 150, img: 'japan_fuji.jpg', emoji: '🗻' },
    { id: 4, title: 'Noche en Ryokan Tradicional', desc: 'Experiencia auténtica en una posada japonesa tradicional con onsen.', amount: 200, img: 'japan_ryokan.jpg', emoji: '🏯' },
    { id: 5, title: 'Clase de Sushi', desc: 'Aprende a hacer sushi con un maestro japonés.', amount: 125, img: 'japan_sushi.jpg', emoji: '🍣' },
    { id: 6, title: 'Ceremonia del Té', desc: 'Participa en una auténtica ceremonia del té japonesa.', amount: 50, img: 'japan_tea.jpg', emoji: '🍵' },
    { id: 7, title: 'Tren Bala a Osaka', desc: 'Viaja en el famoso Shinkansen de Tokyo a Osaka.', amount: 175, img: 'japan_train.jpg', emoji: '🚄' },
    { id: 8, title: 'Noche en Tokyo', desc: 'Cena romántica con vistas al skyline de Tokyo.', amount: 250, img: 'japan_night.jpg', emoji: '🌃' },
  ],
  en: [
    { id: 1, title: 'Tokyo Food Tour', desc: 'Explore the best ramen, sushi, and street food in Tokyo with us.', amount: 75, img: 'japan_food.jpg', emoji: '🍜' },
    { id: 2, title: 'Kyoto Temples', desc: 'Guided tour of Kyoto\'s most iconic temples including Fushimi Inari.', amount: 100, img: 'japan_temple.jpg', emoji: '⛩️' },
    { id: 3, title: 'Mount Fuji Day Trip', desc: 'A magical day contemplating the iconic Mount Fuji.', amount: 150, img: 'japan_fuji.jpg', emoji: '🗻' },
    { id: 4, title: 'Traditional Ryokan Stay', desc: 'Authentic experience at a traditional Japanese inn with onsen.', amount: 200, img: 'japan_ryokan.jpg', emoji: '🏯' },
    { id: 5, title: 'Sushi Making Class', desc: 'Learn to make sushi with a Japanese master chef.', amount: 125, img: 'japan_sushi.jpg', emoji: '🍣' },
    { id: 6, title: 'Tea Ceremony', desc: 'Participate in an authentic Japanese tea ceremony.', amount: 50, img: 'japan_tea.jpg', emoji: '🍵' },
    { id: 7, title: 'Bullet Train to Osaka', desc: 'Travel on the famous Shinkansen from Tokyo to Osaka.', amount: 175, img: 'japan_train.jpg', emoji: '🚄' },
    { id: 8, title: 'Tokyo Night Out', desc: 'Romantic dinner with views of the Tokyo skyline.', amount: 250, img: 'japan_night.jpg', emoji: '🌃' },
  ]
};

// Payment info
const PAYMENT_INFO = {
  venmo: '@JuanCarlos-Moreno-2',
  zelle: '+1-915-588-9258',
};

export default function Wedding() {
  const [showIntro, setShowIntro] = useState(true);
  const [lang, setLang] = useState('es');
  const [loaded, setLoaded] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [rsvpDone, setRsvpDone] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', attending: 'yes', guests: 1, allergies: [], other: '', msg: '', code: '', additionalGuests: [] });
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0 });
  const [page, setPage] = useState('home'); // 'home', 'gifts', 'rsvp'
  const [maxGuests, setMaxGuests] = useState(null);
  const [codeError, setCodeError] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [formError, setFormError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = content[lang];

  // Check if this code was already submitted (client-side backup)
  const checkPreviousSubmission = (code) => {
    try {
      const submitted = JSON.parse(localStorage.getItem('mjc_rsvp_submitted') || '{}');
      return submitted[code.toUpperCase()] || null;
    } catch {
      return null;
    }
  };

  const markAsSubmitted = (code, name) => {
    try {
      const submitted = JSON.parse(localStorage.getItem('mjc_rsvp_submitted') || '{}');
      submitted[code.toUpperCase()] = { name, timestamp: new Date().toISOString() };
      localStorage.setItem('mjc_rsvp_submitted', JSON.stringify(submitted));
    } catch {
      // localStorage not available
    }
  };
   
  useEffect(() => {
    setTimeout(() => setLoaded(true), 300);
    const tick = () => { const diff = new Date('2026-10-01T16:00:00') - new Date(); if (diff > 0) setCountdown({ d: Math.floor(diff / 86400000), h: Math.floor((diff / 3600000) % 24), m: Math.floor((diff / 60000) % 60) }); };
    tick(); const timer = setInterval(tick, 60000); return () => clearInterval(timer);
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
    setSelectedGift(null);
    setFormError('');
    setRsvpDone(false);
    setMaxGuests(null);
    setCodeError(false);
    setIsUpdating(false);
    setMobileMenuOpen(false);
    setForm({ name: '', email: '', attending: 'yes', guests: 1, allergies: [], other: '', msg: '', code: '', additionalGuests: [] });
    window.scrollTo(0, 0);
  };

  const validateCode = (code) => {
    const upperCode = code.toUpperCase();
    if (GUEST_CODES[upperCode] !== undefined) {
      const max = GUEST_CODES[upperCode];
      setMaxGuests(max);
      
      // Check if already submitted
      const previous = checkPreviousSubmission(upperCode);
      if (previous) {
        setIsUpdating(true);
        setForm(f => ({ 
          ...f, 
          code: upperCode, 
          guests: 1,
          additionalGuests: []
        }));
      } else {
        setIsUpdating(false);
        setForm(f => ({ 
          ...f, 
          code: upperCode, 
          guests: 1,
          additionalGuests: []
        }));
      }
      
      setCodeError(false);
      return true;
    } else {
      setCodeError(true);
      setMaxGuests(null);
      setIsUpdating(false);
      return false;
    }
  };

  const updateGuestCount = (newCount) => {
    const count = Math.max(1, Math.min(maxGuests || 1, newCount));
    const additionalCount = count - 1;
    
    // Create or trim additional guests array
    let newAdditionalGuests = [...form.additionalGuests];
    if (additionalCount > newAdditionalGuests.length) {
      // Add new empty guest entries
      for (let i = newAdditionalGuests.length; i < additionalCount; i++) {
        newAdditionalGuests.push({ name: '', allergies: [], other: '' });
      }
    } else {
      // Trim excess guests
      newAdditionalGuests = newAdditionalGuests.slice(0, additionalCount);
    }
    
    setForm({ ...form, guests: count, additionalGuests: newAdditionalGuests });
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

  const handleGiftSelect = (gift) => {
    setSelectedGift(gift);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (showIntro) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center ${loaded ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: C.cream, transition: 'opacity 0.8s' }}>
        <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="absolute top-3 right-3 md:top-4 md:right-4 z-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm tracking-wider" style={{ color: C.blue, border: `1px solid ${C.blue}` }}>{t.lang}</button>
        <video autoPlay muted playsInline onEnded={() => setShowIntro(false)} className="w-full h-auto max-h-[100vh] object-contain"><source src="/images/mjc_doodle_dancing.mp4" type="video/mp4" /></video>
        <button onClick={() => setShowIntro(false)} className="absolute bottom-4 right-4 md:bottom-8 md:right-8 px-4 py-2 md:px-6 rounded-full text-xs md:text-sm tracking-wider hover:opacity-80 transition-opacity" style={{ backgroundColor: 'rgba(96,121,141,0.2)', color: C.blue, backdropFilter: 'blur(4px)' }}>{lang === 'es' ? 'Saltar' : 'Skip'}</button>
      </div>
    );
  }

  const submitRSVP = async () => { 
    setFormError('');
    
    if (!form.name.trim()) {
      setFormError(lang === 'es' ? 'Por favor ingresa tu nombre' : 'Please enter your name');
      return;
    }
    
    if (!maxGuests && form.attending === 'yes') {
      setCodeError(true);
      setFormError(lang === 'es' ? 'Por favor ingresa un código válido' : 'Please enter a valid code');
      return;
    }
    
    // Validate additional guest names
    if (form.attending === 'yes' && form.additionalGuests.length > 0) {
      const missingNames = form.additionalGuests.some(g => !g.name.trim());
      if (missingNames) {
        setFormError(lang === 'es' ? 'Por favor ingresa el nombre de todos los invitados' : 'Please enter names for all guests');
        return;
      }
    }
    
    // Format additional guests for submission
    const formattedAdditionalGuests = form.additionalGuests.map((g, i) => ({
      name: g.name,
      allergies: g.allergies.join(', '),
      other: g.other
    }));
    
    const payload = {
      ...form,
      allergies: form.allergies.join(', '),
      additionalGuests: JSON.stringify(formattedAdditionalGuests),
      timestamp: new Date().toISOString(),
      lang
    };
    
    try { 
      await fetch(SHEETS_URL, { 
        method: 'POST', 
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      // Mark as submitted in localStorage
      markAsSubmitted(form.code, form.name);
      setRsvpDone(true);
    } catch (e) { 
      console.error('RSVP submission error:', e);
      markAsSubmitted(form.code, form.name);
      setRsvpDone(true);
    }
  };
  const toggleAllergy = (a) => setForm(f => ({ ...f, allergies: f.allergies.includes(a) ? f.allergies.filter(x => x !== a) : [...f.allergies, a] }));

  // GIFTS PAGE
  if (page === 'gifts') {
    const experiences = GIFT_EXPERIENCES[lang];
    return (
      <div className="min-h-screen" style={{ backgroundColor: C.cream, fontFamily: "'Nothing You Could Do', cursive" }}>
        <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: C.cream, borderBottom: '1px solid rgba(91,123,148,0.1)' }}>
          <div className="max-w-5xl mx-auto px-3 md:px-4 py-2 md:py-3 flex items-center justify-between">
            <button onClick={goHome} className="flex items-center gap-1.5 md:gap-2 hover:opacity-70">
              <span className="text-lg" style={{ color: C.blue }}>←</span>
              <span className="text-base md:text-lg" style={{ color: C.blue, fontStyle: 'italic' }}>MJC</span>
            </button>
            <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm" style={{ border: `1px solid ${C.blue}`, color: C.blue }}>{t.lang}</button>
          </div>
        </nav>

        <div className="pt-20 pb-12 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <p className="text-4xl md:text-6xl mb-4">🇯🇵</p>
              <h1 className="text-2xl md:text-4xl mb-2" style={{ color: C.blue, fontStyle: 'italic' }}>
                {lang === 'es' ? 'Luna de Miel en Japón' : 'Honeymoon in Japan'}
              </h1>
              <p className="text-sm md:text-base max-w-lg mx-auto" style={{ color: C.blueLight }}>
                {lang === 'es' 
                  ? 'Vuestra presencia es el mejor regalo. Si deseáis contribuir a nuestra luna de miel, podéis regalarnos una experiencia.' 
                  : 'Your presence is the best gift. If you\'d like to contribute to our honeymoon, you can gift us an experience.'}
              </p>
            </div>

            {selectedGift ? (
              <div className="max-w-md mx-auto">
                <button onClick={() => setSelectedGift(null)} className="flex items-center gap-2 mb-6 hover:opacity-70" style={{ color: C.blue }}>
                  <span>←</span> {lang === 'es' ? 'Volver' : 'Back'}
                </button>
                
                <div className="rounded-2xl p-6 md:p-8 text-center" style={{ backgroundColor: C.creamDark }}>
                  <p className="text-5xl mb-4">{selectedGift.emoji}</p>
                  <h2 className="text-xl md:text-2xl mb-2" style={{ color: C.blue }}>{selectedGift.title}</h2>
                  <p className="text-sm mb-4" style={{ color: C.blueLight }}>{selectedGift.desc}</p>
                  <p className="text-3xl md:text-4xl font-light mb-6" style={{ color: C.blue }}>${selectedGift.amount}</p>
                  
                  <p className="text-xs mb-4" style={{ color: C.blueLight }}>
                    {lang === 'es' ? 'Elige tu método de pago:' : 'Choose your payment method:'}
                  </p>
                  
                  <div className="space-y-3">
                    <a 
                      href={`https://venmo.com/${PAYMENT_INFO.venmo.replace('@', '')}?txn=pay&amount=${selectedGift.amount}&note=${encodeURIComponent(selectedGift.title + ' - MJC Wedding')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 rounded-full text-white text-sm md:text-base hover:scale-[1.02] transition-transform"
                      style={{ backgroundColor: '#3D95CE' }}
                    >
                      Venmo {PAYMENT_INFO.venmo}
                    </a>
                    
                    <button 
                      onClick={() => copyToClipboard(PAYMENT_INFO.zelle)}
                      className="block w-full py-3 rounded-full text-white text-sm md:text-base hover:scale-[1.02] transition-transform"
                      style={{ backgroundColor: '#6D1ED4' }}
                    >
                      Zelle: {PAYMENT_INFO.zelle}
                      <span className="ml-2 text-xs opacity-70">({lang === 'es' ? 'clic para copiar' : 'click to copy'})</span>
                    </button>
                    
                    <div className="relative mt-4 pt-4">
                      <div className="absolute inset-x-0 top-0 flex items-center">
                        <div className="flex-1 h-px" style={{ backgroundColor: C.bluePale }}></div>
                        <span className="px-3 text-xs" style={{ color: C.blueLight }}>{lang === 'es' ? 'o' : 'or'}</span>
                        <div className="flex-1 h-px" style={{ backgroundColor: C.bluePale }}></div>
                      </div>
                      <div 
                        className="mt-2 py-4 px-6 rounded-2xl text-center"
                        style={{ backgroundColor: C.cream, border: `1.5px dashed ${C.bluePale}` }}
                      >
                        <p className="text-lg mb-1" style={{ color: C.blue }}>
                          {lang === 'es' ? '✉️ Sobre en la boda' : '✉️ Card at the wedding'}
                        </p>
                        <p className="text-xs" style={{ color: C.blueLight }}>
                          {lang === 'es' 
                            ? 'También puedes darnos tu regalo en persona' 
                            : 'You can also give your gift in person'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs mt-6 opacity-60" style={{ color: C.text }}>
                    {lang === 'es' 
                      ? 'Por favor incluye tu nombre en la nota del pago.' 
                      : 'Please include your name in the payment note.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {experiences.map((exp) => (
                  <button 
                    key={exp.id}
                    onClick={() => handleGiftSelect(exp)}
                    className="group rounded-2xl p-4 md:p-5 text-left hover:scale-[1.02] transition-transform"
                    style={{ backgroundColor: C.creamDark }}
                  >
                    <p className="text-3xl md:text-4xl mb-3">{exp.emoji}</p>
                    <h3 className="text-sm md:text-base font-medium mb-1 leading-tight" style={{ color: C.blue }}>{exp.title}</h3>
                    <p className="text-xs mb-2 leading-snug opacity-80" style={{ color: C.blueLight }}>{exp.desc}</p>
                    <p className="text-lg md:text-xl font-light" style={{ color: C.blue }}>${exp.amount}</p>
                  </button>
                ))}
              </div>
            )}

            <div className="text-center mt-10">
              <p className="text-xs" style={{ color: C.blueLight }}>
                {lang === 'es' 
                  ? '¿Prefieres contribuir con otra cantidad?' 
                  : 'Prefer to contribute a different amount?'}
              </p>
              <button 
                onClick={() => handleGiftSelect({ 
                  id: 'custom', 
                  title: lang === 'es' ? 'Contribución Personalizada' : 'Custom Contribution', 
                  desc: lang === 'es' ? 'Cualquier cantidad es bienvenida.' : 'Any amount is welcome.',
                  amount: '___',
                  emoji: '💝'
                })}
                className="mt-2 px-6 py-2 rounded-full text-sm hover:scale-105 transition-transform"
                style={{ border: `1px solid ${C.blue}`, color: C.blue }}
              >
                {lang === 'es' ? 'Cantidad personalizada' : 'Custom amount'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RSVP PAGE
  if (page === 'rsvp') {
    return (
      <div className="min-h-screen" style={{ backgroundColor: C.cream, fontFamily: "'Nothing You Could Do', cursive" }}>
        <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: C.cream, borderBottom: '1px solid rgba(91,123,148,0.1)' }}>
          <div className="max-w-5xl mx-auto px-3 md:px-4 py-2 md:py-3 flex items-center justify-between">
            <button onClick={goHome} className="flex items-center gap-1.5 md:gap-2 hover:opacity-70">
              <span className="text-lg" style={{ color: C.blue }}>←</span>
              <span className="text-base md:text-lg" style={{ color: C.blue, fontStyle: 'italic' }}>MJC</span>
            </button>
            <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm" style={{ border: `1px solid ${C.blue}`, color: C.blue }}>{t.lang}</button>
          </div>
        </nav>

        <div className="pt-20 pb-12 px-4 md:px-6">
          <div className="max-w-md mx-auto">
            {rsvpDone ? (
              <div className="text-center py-8 md:py-10">
                <div className="flex justify-center" style={{ color: C.gold }}><Icons.Celebration /></div>
                <h2 className="text-2xl md:text-3xl mt-4 mb-2" style={{ color: C.blue, fontStyle: 'italic' }}>
                  {isUpdating 
                    ? (lang === 'es' ? '¡Actualizado!' : 'Updated!')
                    : t.rsvp.thanks.title
                  }
                </h2>
                <p className="text-xs md:text-sm mb-3 md:mb-4" style={{ color: C.blueLight }}>
                  {isUpdating
                    ? (lang === 'es' ? 'Tu RSVP ha sido actualizado' : 'Your RSVP has been updated')
                    : t.rsvp.thanks.subtitle
                  }
                </p>
                <p className="text-xs md:text-sm mb-6 md:mb-8" style={{ color: C.blueLight }}>{t.rsvp.thanks.msg}</p>
                <Img src="mjc_doodle_dancing.png" alt="Celebration" className="w-32 h-28 md:w-40 md:h-32 rounded-xl mx-auto opacity-60" />
                <button onClick={goHome} className="mt-6 px-6 py-2 rounded-full text-sm" style={{ border: `1px solid ${C.blue}`, color: C.blue }}>
                  {lang === 'es' ? 'Volver al inicio' : 'Back to home'}
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl text-center mb-1" style={{ color: C.blue, fontStyle: 'italic' }}>{t.rsvp.title}</h2>
                <p className="text-center text-xs md:text-sm mb-2" style={{ color: C.blueLight }}>{t.rsvp.subtitle}</p>
                <p className="text-center text-xs md:text-sm mb-6 md:mb-8 px-3 py-1.5 rounded-full mx-auto" style={{ backgroundColor: C.creamDark, color: C.blue, display: 'table' }}>{t.rsvp.deadline}</p>
                
                <div className="space-y-4 md:space-y-5">
                  {/* Invitation Code */}
                  <div>
                    <label className="block text-xs md:text-sm mb-1 md:mb-1.5" style={{ color: C.blue }}>
                      {lang === 'es' ? 'Código de invitación *' : 'Invitation code *'}
                    </label>
                    <input 
                      type="text" 
                      value={form.code} 
                      onChange={e => {
                        setForm({ ...form, code: e.target.value.toUpperCase() });
                        setCodeError(false);
                      }}
                      onBlur={e => e.target.value && validateCode(e.target.value)}
                      placeholder={lang === 'es' ? 'Ej: FAMILIA2026' : 'Ex: FAMILIA2026'}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border bg-white text-sm md:text-base focus:ring-2 focus:outline-none uppercase" 
                      style={{ borderColor: codeError ? '#ef4444' : '#E8E4DF' }} 
                    />
                    {codeError && (
                      <p className="text-xs mt-1 text-red-500">
                        {lang === 'es' ? 'Código no válido. Revisa tu invitación.' : 'Invalid code. Check your invitation.'}
                      </p>
                    )}
                    {maxGuests && (
                      <p className="text-xs mt-1" style={{ color: C.blueLight }}>
                        ✓ {lang === 'es' ? `Código válido - hasta ${maxGuests} invitado${maxGuests > 1 ? 's' : ''}` : `Valid code - up to ${maxGuests} guest${maxGuests > 1 ? 's' : ''}`}
                      </p>
                    )}
                    {isUpdating && (
                      <p className="text-xs mt-1 px-2 py-1 rounded-full inline-block" style={{ backgroundColor: C.gold, color: '#5C4D3C' }}>
                        {lang === 'es' ? '⚠️ Ya enviaste una respuesta. Esta actualizará tu RSVP anterior.' : '⚠️ You already submitted. This will update your previous RSVP.'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm mb-1 md:mb-1.5" style={{ color: C.blue }}>{t.rsvp.fields.name}</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border bg-white text-sm md:text-base focus:ring-2 focus:outline-none" style={{ borderColor: '#E8E4DF' }} />
                  </div>
                  
                  <div>
                    <label className="block text-xs md:text-sm mb-1 md:mb-1.5" style={{ color: C.blue }}>{t.rsvp.fields.email}</label>
                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border bg-white text-sm md:text-base" style={{ borderColor: '#E8E4DF' }} />
                  </div>
                  
                  <div>
                    <label className="block text-xs md:text-sm mb-1.5 md:mb-2" style={{ color: C.blue }}>{t.rsvp.fields.attending}</label>
                    <div className="flex gap-4">
                      {[{ v: 'yes', l: t.rsvp.fields.yes }, { v: 'no', l: t.rsvp.fields.no }].map(x => (
                        <label key={x.v} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" checked={form.attending === x.v} onChange={() => setForm({ ...form, attending: x.v })} className="w-4 h-4" style={{ accentColor: C.blue }} />
                          <span className="text-xs md:text-sm" style={{ color: form.attending === x.v ? C.blue : C.blueLight }}>{x.l}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {form.attending === 'yes' && (
                    <>
                      {/* Only show guest count if allowed more than 1 */}
                      {maxGuests && maxGuests > 1 && (
                        <div>
                          <label className="block text-xs md:text-sm mb-1.5 md:mb-2" style={{ color: C.blue }}>
                            {lang === 'es' ? '¿Cuántos asistirán?' : 'How many will attend?'}
                          </label>
                          <div className="flex items-center gap-3 md:gap-4">
                            <button 
                              type="button" 
                              onClick={() => updateGuestCount(form.guests - 1)} 
                              className="w-10 h-10 md:w-11 md:h-11 rounded-full border text-lg md:text-xl hover:opacity-90" 
                              style={{ borderColor: C.blue, color: C.blue }}
                            >−</button>
                            <span className="text-xl md:text-2xl w-8 md:w-10 text-center" style={{ color: C.blue }}>{form.guests}</span>
                            <button 
                              type="button" 
                              onClick={() => updateGuestCount(form.guests + 1)} 
                              disabled={!maxGuests || form.guests >= maxGuests}
                              className="w-10 h-10 md:w-11 md:h-11 rounded-full border text-lg md:text-xl hover:opacity-90 disabled:opacity-40" 
                              style={{ borderColor: C.blue, color: C.blue }}
                            >+</button>
                          </div>
                          <p className="text-xs mt-1" style={{ color: C.blueLight }}>
                            {lang === 'es' ? `Máximo: ${maxGuests}` : `Maximum: ${maxGuests}`}
                          </p>
                        </div>
                      )}
                      
                      {/* Primary guest allergies */}
                      <div>
                        <label className="block text-xs md:text-sm mb-1.5 md:mb-2" style={{ color: C.blue }}>
                          {form.guests > 1 
                            ? (lang === 'es' ? 'Tus alergias' : 'Your allergies')
                            : t.rsvp.fields.allergies
                          }
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
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs md:text-sm mb-1 md:mb-1.5" style={{ color: C.blue }}>
                          {form.guests > 1 
                            ? (lang === 'es' ? 'Tus otras restricciones' : 'Your other restrictions')
                            : t.rsvp.fields.other
                          }
                        </label>
                        <input type="text" value={form.other} onChange={e => setForm({ ...form, other: e.target.value })} className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border bg-white text-sm md:text-base" style={{ borderColor: '#E8E4DF' }} />
                      </div>

                      {/* Additional guests */}
                      {form.additionalGuests.map((guest, index) => (
                        <div key={index} className="p-4 rounded-xl" style={{ backgroundColor: C.creamDark }}>
                          <p className="text-sm font-medium mb-3" style={{ color: C.blue }}>
                            {lang === 'es' ? `Invitado ${index + 2}` : `Guest ${index + 2}`}
                          </p>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs mb-1" style={{ color: C.blue }}>
                                {lang === 'es' ? 'Nombre completo *' : 'Full name *'}
                              </label>
                              <input 
                                type="text" 
                                value={guest.name} 
                                onChange={e => updateAdditionalGuest(index, 'name', e.target.value)} 
                                className="w-full px-3 py-2 rounded-lg border bg-white text-sm" 
                                style={{ borderColor: '#E8E4DF' }} 
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs mb-1" style={{ color: C.blue }}>
                                {lang === 'es' ? 'Alergias' : 'Allergies'}
                              </label>
                              <div className="flex flex-wrap gap-1">
                                {t.rsvp.fields.allergyOpts.map(a => (
                                  <button 
                                    key={a} 
                                    type="button" 
                                    onClick={() => toggleAdditionalGuestAllergy(index, a)} 
                                    className="px-2 py-1 rounded-full text-xs transition-all" 
                                    style={{ border: '1px solid', borderColor: guest.allergies.includes(a) ? C.blue : '#E8E4DF', backgroundColor: guest.allergies.includes(a) ? C.blue : 'white', color: guest.allergies.includes(a) ? 'white' : C.blueLight }}
                                  >{a}</button>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs mb-1" style={{ color: C.blue }}>
                                {lang === 'es' ? 'Otras restricciones' : 'Other restrictions'}
                              </label>
                              <input 
                                type="text" 
                                value={guest.other} 
                                onChange={e => updateAdditionalGuest(index, 'other', e.target.value)} 
                                className="w-full px-3 py-2 rounded-lg border bg-white text-sm" 
                                style={{ borderColor: '#E8E4DF' }} 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  
                  <div>
                    <label className="block text-xs md:text-sm mb-1 md:mb-1.5" style={{ color: C.blue }}>{t.rsvp.fields.msg}</label>
                    <textarea value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border bg-white text-sm md:text-base resize-none" style={{ borderColor: '#E8E4DF' }} rows={3} />
                  </div>
                  
                  <button onClick={submitRSVP} className="w-full py-3 md:py-4 rounded-full text-white flex items-center justify-center gap-2 text-xs md:text-sm tracking-wider hover:scale-[1.02] transition-transform" style={{ backgroundColor: C.blue, boxShadow: '0 4px 20px rgba(91,123,148,0.3)' }}>
                    <Icons.Send /> {isUpdating 
                      ? (lang === 'es' ? 'Actualizar RSVP' : 'Update RSVP')
                      : t.rsvp.fields.submit
                    }
                  </button>
                  
                  {formError && (
                    <p className="text-center text-sm text-red-500 mt-2">{formError}</p>
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
    <div className="min-h-screen" style={{ backgroundColor: C.cream, fontFamily: "'Nothing You Could Do', cursive" }}>
      <SideDoodles />
      
      <nav className="fixed top-0 left-0 right-0 z-50 md:backdrop-blur-md" style={{ backgroundColor: C.cream, borderBottom: '1px solid rgba(91,123,148,0.1)' }}>
        <div className="max-w-5xl mx-auto px-3 md:px-4 py-2 md:py-3 flex items-center justify-between">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden flex items-center gap-2">
            <div className="relative">
              <Img src="mjc_doodle_dancing.png" alt="Menu" className="w-12 h-10 rounded" />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: C.blue }}>
                <span className="text-white text-[10px]">{mobileMenuOpen ? '×' : '≡'}</span>
              </div>
            </div>
            <span className="text-lg" style={{ color: C.blue, fontStyle: 'italic' }}>MJC</span>
          </button>
          <div className="hidden md:flex items-center gap-1.5 md:gap-2">
            <Img src="mjc_doodle_dancing.png" alt="Dancing" className="w-12 h-10 rounded" />
            <span className="text-lg" style={{ color: C.blue, fontStyle: 'italic' }}>MJC</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-4 text-xs md:text-sm leading-snug">
            {t.nav.slice(0, 5).map((n, i) => <a key={i} href={`#s${i}`} className="hidden md:block px-2 py-1 hover:opacity-70" style={{ color: i === 0 ? C.blue : C.blueLight }}>{n}</a>)}
            <a href="#s0" className="md:hidden px-2.5 py-1 rounded-full text-white text-xs" style={{ backgroundColor: C.blue }}>RSVP</a>
            <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm" style={{ border: `1px solid ${C.blue}`, color: C.blue }}>{t.lang}</button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 shadow-lg" style={{ backgroundColor: C.cream, borderTop: `1px solid ${C.bluePale}` }}>
            <div className="px-4 py-3 space-y-1">
              {[
                { label: lang === 'es' ? 'Confirmar Asistencia' : 'RSVP', action: () => { setMobileMenuOpen(false); goToRsvp('yes')({ preventDefault: () => {} }); } },
                { label: lang === 'es' ? 'Itinerario' : 'Itinerary', href: '#s1' },
                { label: lang === 'es' ? 'Hospedaje' : 'Stay', href: '#s2' },
                { label: lang === 'es' ? 'Vestimenta' : 'Dress Code', href: '#s3' },
                { label: lang === 'es' ? 'Nuestra Historia' : 'Our Story', href: '#s4' },
                { label: lang === 'es' ? 'Regalos' : 'Gifts', action: () => { setMobileMenuOpen(false); goToGifts({ preventDefault: () => {} }); } },
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
        )}
      </nav>

      <section className="min-h-screen flex flex-col items-center justify-center pt-12 md:pt-16 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><Img src="mjc_couple_vineyard_bw.jpg" alt="Background" className="w-full h-full" position="center 40%" /></div>
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${C.cream} 0%, transparent 30%, transparent 70%, ${C.cream} 100%)` }} />
        <div className="relative z-10 flex flex-col items-center mt-4 md:mt-0">
          <p className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-6 uppercase" style={{ color: C.blueLight }}>{t.hero.subtitle}</p>
          <div className="w-screen overflow-visible flex justify-center">
            <CoupleWordmark className="w-[180vw] md:w-[800px] mb-6 md:mb-8" />
          </div>
          <p className="text-lg md:text-2xl mb-1" style={{ color: C.blue }}>{t.date.full}</p>
          <p className="text-sm md:text-base mb-6 md:mb-8" style={{ color: C.blueLight, fontStyle: 'italic' }}>{t.hero.location}</p>
          <div className="flex gap-3 md:gap-8 mb-6 md:mb-8">
            {[{ v: countdown.d, l: lang === 'es' ? 'días' : 'days', path: "M 50,2 C 75,-2 92,8 97,25 C 103,45 95,70 92,85 C 82,100 65,102 45,98 C 22,95 5,85 3,65 C 0,45 8,20 20,8 C 32,-2 42,4 50,2 Z" }, { v: countdown.h, l: lang === 'es' ? 'horas' : 'hours', path: "M 55,3 C 78,0 95,15 98,35 C 102,55 98,78 88,92 C 72,105 48,102 30,95 C 8,85 -2,65 2,42 C 6,20 25,5 55,3 Z" }, { v: countdown.m, l: 'min', path: "M 48,2 C 72,0 90,10 96,30 C 104,52 100,75 90,90 C 75,103 52,100 32,95 C 10,88 0,68 3,45 C 7,18 28,3 48,2 Z" }].map((x, i) => (
              <div key={i} className="relative text-center px-6 md:px-10 py-5 md:py-6" style={{ transform: `rotate(${i === 0 ? -2 : i === 1 ? 1 : -1}deg)` }}>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d={x.path} fill="rgba(91,123,141,0.08)" stroke={C.bluePale} strokeWidth="1.5" /></svg>
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
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center relative" style={{ backgroundColor: C.blue + '15' }}>
                            <ItineraryIcon type={e.icon} className="w-5 h-5 md:w-6 md:h-6" style={{ color: C.blue }} />
                            <DoodleSparkle size={10} color={C.gold} className="absolute -top-1 -right-1 opacity-80" />
                          </div>
                          <div>
                            <h3 className="text-lg md:text-xl font-medium" style={{ color: C.blue }}>{e.title}</h3>
                            <p className="text-sm md:text-base" style={{ color: C.blueLight }}>{e.time}</p>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm md:text-base mb-4" style={{ color: C.text }}>{e.desc}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full text-xs md:text-sm text-white relative overflow-hidden" style={{ backgroundColor: C.blue }}>{e.dress}</span>
                        <span className="px-3 py-1 rounded-full text-xs md:text-sm flex items-center gap-1" style={{ backgroundColor: 'rgba(91,123,148,0.1)', color: C.blueLight }}><Icons.Location /> {e.venue}</span>
                        {e.tbd && (<span className="px-3 py-1 rounded-full text-xs md:text-sm" style={{ backgroundColor: C.gold, color: '#5C4D3C' }}>{lang === 'es' ? 'Pronto' : 'Soon'}</span>)}
                      </div>
                    </HandDrawnCard>
                  ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative h-48 md:h-64"><Img src="cordoba.jpg" alt="Córdoba" className="w-full h-full" style={{ filter: 'brightness(1.1)' }} position="top" /><div className="absolute inset-0" style={{ backgroundColor: 'rgba(96,121,141,0.2)' }} /><div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)' }} /></section>

      <section id="s2" className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: C.creamDark }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl text-center mb-2" style={{ color: C.blue, fontStyle: 'italic' }}>{t.hotels.title}</h2>
          <p className="text-center text-xs md:text-sm mb-2" style={{ color: C.blueLight }}>{t.hotels.subtitle}</p>
          <p className="text-center text-xs md:text-sm mb-3 md:mb-4" style={{ color: C.blueLight }}>{t.hotels.intro}</p>
          <p className="text-center text-xs md:text-sm mb-6 md:mb-10 px-3 md:px-4 py-1.5 md:py-2 rounded-full mx-auto" style={{ backgroundColor: C.gold, color: '#5C4D3C', display: 'table' }}>{t.hotels.bookBy}</p>
          
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {t.hotels.list.map((h, i) => {
              const rotations = ['-0.4deg', '0.5deg', '-0.6deg', '0.4deg'];
              const cardPaths = [
                "M 2,4 Q 25,1 50,3 Q 75,1 98,4 Q 101,25 99,50 Q 101,75 98,96 Q 75,99 50,97 Q 25,99 2,96 Q -1,75 1,50 Q -1,25 2,4 Z",
                "M 3,3 Q 30,0 55,4 Q 80,1 97,3 Q 100,30 98,55 Q 101,80 97,97 Q 70,100 45,96 Q 20,100 3,97 Q 0,70 2,45 Q -1,20 3,3 Z",
                "M 4,2 Q 28,0 52,3 Q 76,0 96,2 Q 100,28 98,52 Q 101,76 96,98 Q 72,101 48,97 Q 24,101 4,98 Q 0,72 2,48 Q -1,24 4,2 Z",
                "M 2,3 Q 26,0 50,2 Q 74,0 98,3 Q 101,26 99,50 Q 102,74 98,97 Q 74,100 50,98 Q 26,101 2,97 Q -1,74 1,50 Q -2,26 2,3 Z"
              ];
              
              return (
              <a key={i} href={h.url} target="_blank" rel="noopener noreferrer" className="group relative block" style={{ transform: `rotate(${rotations[i]})` }}>
                <svg className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d={cardPaths[i]} fill={C.cream} stroke={h.top ? C.gold : C.bluePale} strokeWidth={h.top ? "2.5" : "1.5"} vectorEffect="non-scaling-stroke"/>
                </svg>
                
                <div className="relative z-10 p-4 md:p-5">
                  <div className="relative mb-3 overflow-hidden rounded-xl">
                    <Img src={h.img} alt={h.name} className="w-full h-32 md:h-44 group-hover:scale-105 transition-transform duration-300" position="center" />
                    {h.top && (
                      <div className="absolute top-2 right-2">
                        <DoodleSparkle size={18} color={C.gold} />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-sm md:text-base font-medium leading-tight mb-1" style={{ color: C.blue }}>{h.name}</h3>
                    <p className="text-xs md:text-sm mb-1" style={{ color: C.blueLight }}>{h.dist} · {h.price}</p>
                    <p className="text-xs md:text-sm leading-snug" style={{ color: C.text }}>{h.note}</p>
                  </div>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: C.blue, color: 'white' }}>{lang === 'es' ? 'Reservar' : 'Book'}</span>
                  </div>
                </div>
              </a>
            )})}
          </div>
        </div>
      </section>

      <section className="relative h-48 md:h-80"><Img src="mjc_ring_bw.jpg" alt="Ring" className="w-full h-full" /><div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(91,123,148,0.4)' }}><p className="text-white text-xl md:text-4xl flex items-center gap-2" style={{ fontStyle: 'italic' }}>Sí, quiero</p></div></section>

      <section id="s3" className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl text-center mb-2" style={{ color: C.blue, fontStyle: 'italic' }}>{t.dress.title}</h2>
          <p className="text-center text-xs md:text-sm mb-2" style={{ color: C.blueLight }}>{t.dress.subtitle}</p>
          <p className="text-center text-xs md:text-sm mb-6 md:mb-10" style={{ color: C.blue }}>{t.dress.note}</p>
          <div className="flex flex-col items-center gap-3 md:gap-4">
            <div className="w-full max-w-xs">
              {t.dress.codes.slice(0, 1).map((d, i) => (
                <HandDrawnCard key={i} className="p-4 md:p-6 text-center">
                  <div className="flex justify-center" style={{ color: C.blue }}>{getDressIcon(d.icon)}</div>
                  <h3 className="text-base md:text-xl mt-2 md:mt-3 mb-1" style={{ color: C.blue }}>{d.event}</h3>
                  <p className="text-xs md:text-sm font-medium mb-1 md:mb-2" style={{ color: C.blue }}>{d.code}</p>
                  <p className="text-xs md:text-sm" style={{ color: C.blueLight }}>{d.desc}</p>
                </HandDrawnCard>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4 w-full max-w-lg">
              {t.dress.codes.slice(1).map((d, i) => (
                <HandDrawnCard key={i} className="p-4 md:p-6 text-center">
                  <div className="flex justify-center" style={{ color: C.blue }}>{getDressIcon(d.icon)}</div>
                  <h3 className="text-base md:text-xl mt-2 md:mt-3 mb-1" style={{ color: C.blue }}>{d.event}</h3>
                  <p className="text-xs md:text-sm font-medium mb-1 md:mb-2" style={{ color: C.blue }}>{d.code}</p>
                  <p className="text-xs md:text-sm" style={{ color: C.blueLight }}>{d.desc}</p>
                </HandDrawnCard>
              ))}
            </div>
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
              </HandDrawnCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: C.blue }}>
        <div className="max-w-xl mx-auto text-center">
          <p className="text-4xl md:text-6xl mb-4">🇯🇵</p>
          <h2 className="text-2xl md:text-4xl mb-2 text-white" style={{ fontStyle: 'italic' }}>{t.gifts.title}</h2>
          <p className="text-white/70 text-xs md:text-sm mb-3 md:mb-4" style={{ fontStyle: 'italic' }}>{t.gifts.subtitle}</p>
          <p className="text-white/80 text-xs md:text-sm mb-6 md:mb-8">
            {lang === 'es' 
              ? 'Regaladnos experiencias para nuestra luna de miel en Japón.' 
              : 'Gift us experiences for our honeymoon in Japan.'}
          </p>
          <button onClick={goToGifts} className="px-8 md:px-10 py-3 md:py-4 rounded-full bg-white text-sm md:text-base hover:scale-105 transition-transform" style={{ color: C.blue }}>
            {lang === 'es' ? 'Ver experiencias' : 'View experiences'}
          </button>
        </div>
      </section>

      <section id="s0" className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl md:text-3xl mb-2" style={{ color: C.blue, fontStyle: 'italic' }}>{t.rsvp.title}</h2>
          <p className="text-xs md:text-sm mb-2" style={{ color: C.blueLight }}>{t.rsvp.subtitle}</p>
          <p className="text-xs md:text-sm mb-6 md:mb-8 px-3 py-1.5 rounded-full mx-auto" style={{ backgroundColor: C.creamDark, color: C.blue, display: 'table' }}>{t.rsvp.deadline}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <button onClick={goToRsvp('yes')} className="px-8 md:px-12 py-3 md:py-4 rounded-full text-white text-base md:text-lg tracking-wider hover:scale-105 transition-transform" style={{ backgroundColor: C.blue, boxShadow: '0 6px 25px rgba(91,123,148,0.4)' }}>
              {lang === 'es' ? 'Asistiré' : 'Will Attend'}
            </button>
            <button onClick={goToRsvp('no')} className="px-8 md:px-12 py-3 md:py-4 rounded-full text-base md:text-lg tracking-wider hover:scale-105 transition-transform" style={{ border: `2px solid ${C.blue}`, color: C.blue }}>
              {lang === 'es' ? 'No Asistiré' : "Won't Attend"}
            </button>
          </div>
        </div>
      </section>

      <section id="faq" className="py-12 md:py-20 px-4 md:px-6" style={{ backgroundColor: C.creamDark }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-4xl text-center mb-6 md:mb-10" style={{ color: C.blue, fontStyle: 'italic' }}>{t.faq.title}</h2>
          {t.faq.items.map((f, i) => (<div key={i} className="mb-2 md:mb-3 rounded-2xl overflow-hidden" style={{ backgroundColor: C.cream }}><button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="w-full px-4 md:px-6 py-4 md:py-5 flex justify-between items-center text-left hover:opacity-90"><span className="text-sm md:text-base pr-3 md:pr-4" style={{ color: C.blue }}>{f.q}</span><span className="text-lg md:text-xl shrink-0" style={{ color: C.blueLight }}>{expandedFaq === i ? '−' : '+'}</span></button>{expandedFaq === i && <div className="px-4 md:px-6 pb-4 md:pb-5 text-sm md:text-base" style={{ color: C.blueLight }}>{f.a}</div>}</div>))}
        </div>
      </section>

      <section id="s4" className="py-12 md:py-20 px-4 md:px-6 relative overflow-visible" style={{ backgroundColor: C.creamDark }}>
        <StoryTimeline items={t.story.items} intro={t.story.intro} title={t.story.title} subtitle={t.story.subtitle} />
      </section>

      <footer className="relative py-10 md:py-16 text-center overflow-hidden" style={{ backgroundColor: C.blue }}>
        <div className="absolute inset-0 opacity-10"><Img src="mjc_couple_vineyard.jpg" alt="Footer" className="w-full h-full" /></div>
        <div className="relative z-10">
          <Img src="mjc_doodle_dancing.png" alt="Dancing" className="w-28 h-24 md:w-48 md:h-40 rounded-xl mx-auto mb-3 md:mb-4 opacity-70" style={{ filter: 'brightness(0) invert(1)' }}/>
          <CoupleWordmark className="w-[220px] md:w-[320px] mx-auto mb-2 md:mb-4" style={{ filter: 'brightness(0) invert(1)' }} />
          <p className="text-white/60 text-xs md:text-sm">{t.date.full} · {t.hero.location}</p>
          <p className="text-white/80 text-base md:text-lg mt-3 md:mt-4">{t.footer.hash}</p>
          
          <div className="mt-6 md:mt-8 mb-4">
            <p className="text-white/50 text-xs md:text-sm mb-3">{lang === 'es' ? '¿Preguntas? Contáctanos' : 'Questions? Contact us'}</p>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-center">
              {[t.contact.marijo, t.contact.juanca].map((c, i) => (
                <div key={i} className="flex items-center gap-2 md:gap-3 relative z-30">
                  <span className="text-white/70 text-xs md:text-sm">{c.name}:</span>
                  <button onClick={() => window.open(`https://wa.me/${c.wa}`, '_blank')} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}><Icons.Whatsapp /></button>
                  <button onClick={() => window.open(`sms:${c.phone}`, '_self')} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}><Icons.Imessage /></button>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-white/40 text-xs md:text-sm mt-6 md:mt-8 flex items-center justify-center gap-1">{t.footer.made} <Icons.Heart /></p>
        </div>
      </footer>
    </div>
  );
}