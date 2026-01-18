import React, { useState, useEffect } from 'react';

const C = { blue: '#5B7B94', blueDark: '#4A6A82', blueLight: '#7A9BB5', bluePale: '#A8C0D4', cream: '#FAF8F5', creamDark: '#F0EDE8', gold: '#D4C4A8', goldLight: '#EDE5D8', goldDark: '#B8A888', text: '#6B7B8B' };

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyfRhJ1OTWeCgiEg1qzzEh4UYBwdUX_lNl6EE_4HD42Cim_B_FOC2XtuYaHEWwUWH9b/exec';

const Icons = {
  Image: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  Sunset: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
      <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
      <path d="M4 19h16" />
    </svg>
  ),
  Church: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M12 2v4m0 0l3 2v3H9V8l3-2z" />
      <path d="M6 11h12v10H6z" />
      <path d="M10 21v-4h4v4" />
      <path d="M12 6V2M10 4h4" />
    </svg>
  ),
  Sparkles: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
      <path d="M18 14l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5L16 16l1.5-.5.5-1.5z" />
    </svg>
  ),
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636" />
    </svg>
  ),
  Plane: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  ),
  Train: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <rect x="4" y="3" width="16" height="16" rx="2" />
      <path d="M4 11h16M12 3v8M8 19l-2 3M16 19l2 3" />
      <circle cx="8" cy="15" r="1" />
      <circle cx="16" cy="15" r="1" />
    </svg>
  ),
  Car: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
      <path d="M5 17h14v-5l-2-4H7l-2 4v5z" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
      <path d="M5 12h14" />
    </svg>
  ),
  Gift: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12">
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M12 8v13M3 12h18" />
      <path d="M12 8c-2-2-5-2.5-5 0s3 2.5 5 2.5c2 0 5-.5 5-2.5s-3-2-5 0z" />
    </svg>
  ),
  Celebration: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
      <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7l2-7z" />
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </svg>
  ),
  Location: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 inline">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  Heart: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 inline text-red-400">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  Send: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  ),
  Whatsapp: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  Imessage: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2A1.5 1.5 0 003.8 21.454l3.032-.892A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
    </svg>
  )
};

const Img = ({ src, alt, className = "", style = {}, position = "center" }) => {
  const [error, setError] = React.useState(false);
  const imgPath = `/images/${src}`;
  
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`} style={style}>
        <div className="text-center p-4">
          <Icons.Image />
          <p className="text-xs mt-2 break-all">{src}</p>
        </div>
      </div>
    );
  }
  
  return (
    <img src={imgPath} alt={alt} className={`object-cover ${className}`} style={{ objectPosition: position, ...style }}
      onError={() => { console.log('Failed to load:', src); setError(true); }} />
  );
};

const content = {
  es: {
    couple: { name1: "Marijo", name2: "Juanca", full1: "Maria Jose Licona", full2: "Juan Carlos Moreno" },
    date: { full: "1 de Octubre, 2026", short: "01.10.26" },
    envelope: { exclusive: "Esta invitación es", forYou: "exclusiva para ti", tap: "Toca el sello para abrir" },
    hero: { subtitle: "¡Nos casamos!", location: "Córdoba, España", scroll: "Desliza para descubrir nuestra historia" },
    nav: ["Confirmar", "Historia", "Itinerario", "Hospedaje", "Vestimenta", "Regalos", "FAQ", "Contacto"],
    story: {
      title: "Nuestra Historia", subtitle: "6 años de amor",
      intro: "Algo en todos estos años dejó macerar la forma de amor que sentimos por el otro... lo que nos permite elegirnos día a día de forma libre y poder mirarnos y acompañarnos con más amor, aceptación, paciencia, apañe y ternura.",
      items: [
        { year: "2019", title: "Nos Conocimos", text: "El destino nos cruzó hace 6 años. Una mirada, una sonrisa, y supimos que algo especial estaba comenzando.", img: "mjc_couple_portrait.jpg" },
        { year: "8 Feb 2020", title: "Empezamos a Salir", text: "Justo antes de que el mundo cambiara, nosotros empezamos nuestra aventura juntos. El amor en tiempos de pandemia.", img: "mjc_couple_vineyard.jpg" },
        { year: "21 Feb 2025", title: "La Propuesta", text: "En Napa Valley, entre viñedos y bajo el cielo de California, Juanca se arrodilló y le pidió a Marijo que fuera su compañera de vida para siempre.", img: "mjc_ring_closeup.jpg" },
        { year: "1 Oct 2026", title: "Para Siempre", text: "Celebramos nuestro amor en la hermosa Córdoba, rodeados de quienes más queremos.", img: "mjc_cordoba_mezquita.jpg" }
      ]
    },
    itinerary: {
      title: "Itinerario del Fin de Semana", subtitle: "Tres días de celebración",
      events: [
        { day: "Martes", date: "29 de Septiembre", title: "Llegada de Invitados", time: "Todo el día", venue: "Córdoba, España", dress: "Casual", desc: "Día libre para explorar la ciudad, descansar del viaje y prepararse para la celebración. ¡Córdoba os espera!", tbd: false },
        { day: "Miércoles", date: "30 de Septiembre", title: "Rompe Hielo", time: "20:00", venue: "Ubicación por confirmar", dress: "Smart Casual", desc: "Una noche de tapas, vino y reencuentros. La oportunidad perfecta para conocernos todos antes del gran día.", tbd: true },
        { day: "Jueves", date: "1 de Octubre", title: "La Ceremonia", time: "16:00", venue: "Por confirmar", dress: "Formal", desc: "Nos damos el 'Sí, quiero' rodeados de historia y amor. Una ceremonia íntima y emotiva.", tbd: true },
        { day: "Jueves", date: "1 de Octubre", title: "La Celebración", time: "20:00", venue: "Por confirmar", dress: "Etiqueta Opcional", desc: "Cena bajo las estrellas andaluzas, música, baile y una noche que nunca olvidaremos. ¡Traigan zapatos cómodos para bailar!", tbd: true },
        { day: "Viernes", date: "2 de Octubre", title: "Brunch de Despedida", time: "12:00", venue: "Por confirmar", dress: "Casual", desc: "Un último momento juntos antes de despedirnos. Café, churros y recuerdos de una celebración inolvidable.", tbd: true }
      ]
    },
    hotels: {
      title: "Hospedaje", subtitle: "Dónde Quedarse en Córdoba", bookBy: "Por favor reserva antes del 1 de Agosto, 2026",
      intro: "Hemos seleccionado estos hoteles por su ubicación, encanto y cercanía a los eventos.",
      list: [
        { name: "Hospes Palacio del Bailío", dist: "5 min de la ceremonia", price: "€€€€", note: "Palacio del siglo XVI con piscina romana. Código: BODA26", top: true, img: "hotel_hospes.jpg", url: "https://www.hospes.com/hotel-cordoba-palacio-bailio/" },
        { name: "Hotel Balcón de Córdoba", dist: "8 min de la ceremonia", price: "€€€", note: "Vistas espectaculares a la Mezquita desde la terraza", top: false, img: "hotel_balcon.jpg", url: "https://www.balcondecordoba.com/" },
        { name: "Las Casas de la Judería", dist: "10 min de la ceremonia", price: "€€€", note: "Casas históricas conectadas en la Judería", top: false, img: "hotel_juderia.jpg", url: "https://www.casasypalacios.com/lascasasdelajuderiadecordoba/" },
        { name: "Hotel Madinat", dist: "12 min de la ceremonia", price: "€€", note: "Moderno y cómodo, excelente relación calidad-precio", top: false, img: "hotel_madinat.jpg", url: "https://www.hotelmadinat.com/" }
      ]
    },
    dress: {
      title: "Código de Vestimenta", subtitle: "Qué Ponerse en Cada Evento",
      note: "Octubre en Córdoba: 20-25°C de día, noches frescas (15-18°C). Recomendamos traer una chaqueta ligera.",
      codes: [
        { event: "Rompe Hielo", code: "Smart Casual", desc: "Casual elegante. Lino, vestidos de verano, mocasines.", icon: "Sunset", colors: ["Tonos tierra", "Pasteles", "Blanco"] },
        { event: "Ceremonia", code: "Formal", desc: "Trajes, vestidos de cóctel. Hombros cubiertos para las damas.", icon: "Church", colors: ["Colores sobrios", "Evitar blanco/crudo"] },
        { event: "Celebración", code: "Etiqueta Opcional", desc: "Vestidos largos, trajes oscuros. Zapatos cómodos para bailar.", icon: "Sparkles", colors: ["Elegancia nocturna"] },
        { event: "Brunch", code: "Casual", desc: "Relax total. Algo cómodo para un brunch tranquilo.", icon: "Sun", colors: ["Lo que sea cómodo"] }
      ]
    },
    travel: {
      title: "Cómo Llegar a Córdoba", subtitle: "Tu guía de viaje",
      sections: [
        { icon: "Plane", title: "Por Avión", text: "Aeropuertos más cercanos: Sevilla (SVQ) a 1.5h, Málaga (AGP) a 2h.", tips: ["Vuelos directos desde Europa", "Reserva con anticipación", "Alquiler de coche recomendado"] },
        { icon: "Train", title: "Por Tren", text: "El AVE conecta Córdoba con Madrid en 1h 45min y con Sevilla en 45min.", tips: ["Reserva en renfe.com", "Estación céntrica", "Muy cómodo y puntual"] },
        { icon: "Car", title: "Por Coche", text: "Bien conectada por autopista. Desde Sevilla (1.5h), Madrid (4h), Málaga (2h).", tips: ["Parking difícil en centro", "Hoteles con parking privado", "GPS recomendado"] }
      ]
    },
    gifts: {
      title: "Regalos", subtitle: "Vuestra presencia es nuestro mejor regalo",
      msg: "No contamos con lista de novios tradicional. Si deseáis hacernos un regalo, una contribución para nuestra luna de miel sería muy apreciada.",
      bank: { title: "Datos Bancarios", iban: "ES00 0000 0000 0000 0000 0000", swift: "XXXXESXX", holder: "Maria Jose Licona / Juan Carlos Moreno" },
      cta: "Ver datos bancarios", note: "También aceptamos Bizum y PayPal"
    },
    faq: {
      title: "Preguntas Frecuentes",
      items: [
        { q: "¿Cómo será el clima en Córdoba en octubre?", a: "Octubre es precioso — temperaturas de 20-25°C durante el día con noches más frescas (15-18°C). Recomendamos traer una chaqueta ligera." },
        { q: "¿Puedo traer a mis hijos?", a: "Queremos mucho a vuestros pequeños, pero esta celebración es solo para adultos (mayores de 18)." },
        { q: "¿Puedo llevar acompañante?", a: "Por favor, consulta tu invitación para detalles sobre acompañantes." },
        { q: "¿Hay parking en los venues?", a: "Sí, habrá parking disponible. También organizaremos servicio de shuttle desde los hoteles recomendados." },
        { q: "¿En qué idioma será la ceremonia?", a: "La ceremonia será bilingüe (español e inglés)." },
        { q: "¿Cuál es el aeropuerto más cercano?", a: "Sevilla (SVQ) a 1.5 horas y Málaga (AGP) a 2 horas. También hay tren AVE desde Madrid." },
        { q: "¿Necesito visa para España?", a: "Ciudadanos de la UE, EEUU, México y la mayoría de países latinoamericanos no necesitan visa para estancias de hasta 90 días." },
        { q: "¿Hay opciones vegetarianas/veganas?", a: "¡Por supuesto! Indica tus restricciones alimentarias en el formulario de confirmación." }
      ]
    },
    contact: {
      title: "¿Preguntas?", subtitle: "Estamos aquí para ayudaros",
      msg: "Si tenéis cualquier duda sobre el viaje, alojamiento, o cualquier otra cosa, no dudéis en contactarnos.",
      marijo: { name: "Marijo", phone: "+1-832-388-9435", wa: "18323889435" },
      juanca: { name: "Juanca", phone: "+1-915-588-9258", wa: "19155889258" }
    },
    rsvp: {
      title: "Confirma tu Asistencia", subtitle: "Esperamos contar contigo", deadline: "Por favor confirma antes del 1 de Agosto, 2026",
      fields: { name: "Nombre completo *", email: "Email (opcional)", attending: "¿Asistirás?", yes: "Sí, asistiré", no: "No podré asistir", guests: "Número de invitados (incluyéndote)", allergies: "Alergias alimentarias", allergyOpts: ["Frutos secos", "Mariscos", "Gluten", "Lácteos", "Vegetariano", "Vegano"], other: "Otras alergias o restricciones", msg: "Mensaje para los novios (opcional)", submit: "Enviar confirmación" },
      thanks: { title: "¡Gracias!", subtitle: "Tu confirmación ha sido recibida", msg: "Estamos muy emocionados de celebrar contigo. Te enviaremos más detalles pronto." }
    },
    footer: { made: "Hecho con mucho amor", hash: "#MarijoYJuanca2026" },
    lang: "EN"
  },
  en: {
    couple: { name1: "Marijo", name2: "Juanca", full1: "Maria Jose Licona", full2: "Juan Carlos Moreno" },
    date: { full: "October 1, 2026", short: "01.10.26" },
    envelope: { exclusive: "This invitation is", forYou: "exclusively for you", tap: "Tap the seal to open" },
    hero: { subtitle: "We're getting married!", location: "Córdoba, Spain", scroll: "Scroll to discover our story" },
    nav: ["RSVP", "Story", "Itinerary", "Stay", "Dress Code", "Gifts", "FAQ", "Contact"],
    story: {
      title: "Our Story", subtitle: "6 years of love",
      intro: "Something in all these years allowed our love to mature... what allows us to choose each other day by day, freely, and to look at and accompany each other with more love, acceptance, patience, support and tenderness.",
      items: [
        { year: "2019", title: "We Met", text: "Destiny brought us together 6 years ago. One look, one smile, and we knew something special was beginning.", img: "mjc_couple_portrait.jpg" },
        { year: "Feb 8, 2020", title: "Started Dating", text: "Right before the world changed, we started our adventure together. Love in the time of pandemic.", img: "mjc_couple_vineyard.jpg" },
        { year: "Feb 21, 2025", title: "The Proposal", text: "In Napa Valley, among vineyards and under California skies, Juanca got on one knee and asked Marijo to be his partner for life.", img: "mjc_ring_closeup.jpg" },
        { year: "Oct 1, 2026", title: "Forever", text: "We celebrate our love in beautiful Córdoba, surrounded by those we love most.", img: "mjc_cordoba_mezquita.jpg" }
      ]
    },
    itinerary: {
      title: "Weekend Itinerary", subtitle: "Three days of celebration",
      events: [
        { day: "Tuesday", date: "September 29", title: "Guest Arrivals", time: "All day", venue: "Córdoba, Spain", dress: "Casual", desc: "Free day to explore the city, rest from your journey and prepare for the celebration.", tbd: false },
        { day: "Wednesday", date: "September 30", title: "Ice Breaker", time: "8:00 PM", venue: "Location TBD", dress: "Smart Casual", desc: "An evening of tapas, wine and reunions. The perfect opportunity for everyone to meet before the big day.", tbd: true },
        { day: "Thursday", date: "October 1", title: "The Ceremony", time: "4:00 PM", venue: "TBD", dress: "Formal", desc: "We say 'I do' surrounded by history and love. An intimate and emotional ceremony.", tbd: true },
        { day: "Thursday", date: "October 1", title: "The Celebration", time: "8:00 PM", venue: "TBD", dress: "Black Tie Optional", desc: "Dinner under Andalusian stars, music, dancing and a night we'll never forget.", tbd: true },
        { day: "Friday", date: "October 2", title: "Farewell Brunch", time: "12:00 PM", venue: "TBD", dress: "Casual", desc: "One last moment together before we say goodbye. Coffee, churros and memories.", tbd: true }
      ]
    },
    hotels: {
      title: "Where to Stay", subtitle: "Accommodation in Córdoba", bookBy: "Please book before August 1, 2026",
      intro: "We've selected these hotels for their location, charm and proximity to events.",
      list: [
        { name: "Hospes Palacio del Bailío", dist: "5 min from ceremony", price: "€€€€", note: "16th century palace with Roman pool. Code: WEDDING26", top: true, img: "hotel_hospes.jpg", url: "https://www.hospes.com/hotel-cordoba-palacio-bailio/" },
        { name: "Hotel Balcón de Córdoba", dist: "8 min from ceremony", price: "€€€", note: "Spectacular views of the Mezquita from the rooftop", top: false, img: "hotel_balcon.jpg", url: "https://www.balcondecordoba.com/" },
        { name: "Las Casas de la Judería", dist: "10 min from ceremony", price: "€€€", note: "Connected historic houses in the Jewish Quarter", top: false, img: "hotel_juderia.jpg", url: "https://www.casasypalacios.com/lascasasdelajuderiadecordoba/" },
        { name: "Hotel Madinat", dist: "12 min from ceremony", price: "€€", note: "Modern and comfortable, great value", top: false, img: "hotel_madinat.jpg", url: "https://www.hotelmadinat.com/" }
      ]
    },
    dress: {
      title: "Dress Code", subtitle: "What to Wear at Each Event",
      note: "October in Córdoba: 68-77°F (20-25°C) days, cool evenings (59-64°F). Bring a light jacket.",
      codes: [
        { event: "Ice Breaker", code: "Smart Casual", desc: "Elevated casual. Linen, sundresses, loafers.", icon: "Sunset", colors: ["Earth tones", "Pastels", "White"] },
        { event: "Ceremony", code: "Formal", desc: "Suits, cocktail dresses. Shoulders covered for ladies.", icon: "Church", colors: ["Muted colors", "Avoid white/ivory"] },
        { event: "Celebration", code: "Black Tie Optional", desc: "Gowns, dark suits. Comfy shoes for dancing.", icon: "Sparkles", colors: ["Evening elegance"] },
        { event: "Brunch", code: "Casual", desc: "Total relaxation. Something comfy for a chill brunch.", icon: "Sun", colors: ["Whatever's comfortable"] }
      ]
    },
    travel: {
      title: "Getting to Córdoba", subtitle: "Your travel guide",
      sections: [
        { icon: "Plane", title: "By Air", text: "Nearest airports: Seville (SVQ) 1.5h, Málaga (AGP) 2h.", tips: ["Direct flights from Europe", "Book in advance", "Car rental recommended"] },
        { icon: "Train", title: "By Train", text: "AVE high-speed connects Córdoba with Madrid in 1h 45min and Seville in 45min.", tips: ["Book at renfe.com", "Central station", "Very comfortable"] },
        { icon: "Car", title: "By Car", text: "Well connected by highway. From Seville (1.5h), Madrid (4h), Málaga (2h).", tips: ["Parking tricky downtown", "Hotels have parking", "GPS recommended"] }
      ]
    },
    gifts: {
      title: "Gifts", subtitle: "Your presence is our greatest gift",
      msg: "We don't have a traditional registry. If you'd like to give us a gift, a contribution toward our honeymoon would be greatly appreciated.",
      bank: { title: "Bank Details", iban: "ES00 0000 0000 0000 0000 0000", swift: "XXXXESXX", holder: "Maria Jose Licona / Juan Carlos Moreno" },
      cta: "View bank details", note: "We also accept Venmo and PayPal"
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        { q: "What will the weather be like?", a: "October in Córdoba is beautiful — 68-77°F (20-25°C) days with cooler evenings. Bring a light jacket." },
        { q: "Can I bring my children?", a: "We love your little ones, but this celebration is adults only (18+)." },
        { q: "Can I bring a plus one?", a: "Please check your invitation for guest details." },
        { q: "Is there parking?", a: "Yes, parking will be available. We'll also arrange shuttle service from recommended hotels." },
        { q: "What language will the ceremony be in?", a: "The ceremony will be bilingual (Spanish and English)." },
        { q: "What's the nearest airport?", a: "Seville (SVQ) at 1.5 hours and Málaga (AGP) at 2 hours. Also AVE train from Madrid." },
        { q: "Do I need a visa?", a: "EU, US, Mexican and most Latin American citizens don't need a visa for stays up to 90 days." },
        { q: "Are there vegetarian options?", a: "Absolutely! Note your dietary restrictions in the RSVP form." }
      ]
    },
    contact: {
      title: "Questions?", subtitle: "We're here to help",
      msg: "If you have any questions about travel, accommodation, or anything else, don't hesitate to reach out.",
      marijo: { name: "Marijo", phone: "+1-832-388-9435", wa: "18323889435" },
      juanca: { name: "Juanca", phone: "+1-915-588-9258", wa: "19155889258" }
    },
    rsvp: {
      title: "RSVP", subtitle: "We hope to celebrate with you", deadline: "Please confirm by August 1, 2026",
      fields: { name: "Full name *", email: "Email (optional)", attending: "Will you attend?", yes: "Yes, I'll be there", no: "Sorry, can't make it", guests: "Number of guests (including yourself)", allergies: "Food allergies", allergyOpts: ["Tree nuts", "Shellfish", "Gluten", "Dairy", "Vegetarian", "Vegan"], other: "Other allergies or restrictions", msg: "Message for the couple (optional)", submit: "Send confirmation" },
      thanks: { title: "Thank You!", subtitle: "Your RSVP has been received", msg: "We're so excited to celebrate with you. We'll send more details soon." }
    },
    footer: { made: "Made with lots of love", hash: "#MarijoAndJuanca2026" },
    lang: "ES"
  }
};

const getDressIcon = (iconName) => {
  const iconMap = { Sunset: Icons.Sunset, Church: Icons.Church, Sparkles: Icons.Sparkles, Sun: Icons.Sun };
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent /> : null;
};

const getTravelIcon = (iconName) => {
  const iconMap = { Plane: Icons.Plane, Train: Icons.Train, Car: Icons.Car };
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent /> : null;
};

export default function Wedding() {
  const [lang, setLang] = useState('es');
  const [stage, setStage] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showBank, setShowBank] = useState(false);
  const [rsvpDone, setRsvpDone] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', attending: 'yes', guests: 1, allergies: [], other: '', msg: '' });
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0 });
  const [sealHover, setSealHover] = useState(false);
  const t = content[lang];

  useEffect(() => {
    setTimeout(() => setLoaded(true), 300);
    const tick = () => {
      const diff = new Date('2026-10-01T16:00:00') - new Date();
      if (diff > 0) setCountdown({ d: Math.floor(diff / 86400000), h: Math.floor((diff / 3600000) % 24), m: Math.floor((diff / 60000) % 60) });
    };
    tick();
    const timer = setInterval(tick, 60000);
    return () => clearInterval(timer);
  }, []);

  const openEnvelope = () => {
    if (stage === 0) { setStage(1); setTimeout(() => setStage(2), 1200); setTimeout(() => setStage(3), 4000); }
  };

  const submitRSVP = async () => {
    if (!form.name.trim()) return;
    try { await fetch(SHEETS_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ ...form, allergies: form.allergies.join(', '), timestamp: new Date().toISOString(), lang }) }); } catch (e) { console.log(e); }
    setRsvpDone(true);
  };

  const toggleAllergy = (a) => setForm(f => ({ ...f, allergies: f.allergies.includes(a) ? f.allergies.filter(x => x !== a) : [...f.allergies, a] }));

  // ENVELOPE SCREEN
  if (stage < 3) {
    return (
      <div className={`fixed inset-0 overflow-hidden ${loaded ? 'opacity-100' : 'opacity-0'}`} style={{ transition: 'opacity 0.8s' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #6B8A9F 0%, #5B7B94 30%, #4A6A82 70%, #3A5A72 100%)' }} />
        
        <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="absolute top-4 right-4 z-50 px-4 py-2 rounded-full text-sm tracking-wider backdrop-blur-sm" style={{ color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.08)' }}>
          {t.lang}
        </button>

        <div className="absolute top-0 left-0 right-0 origin-top" style={{ height: '52vh', zIndex: stage >= 1 ? 5 : 30, transform: stage >= 1 ? 'perspective(1200px) rotateX(-178deg)' : 'perspective(1200px) rotateX(0deg)', transition: 'transform 1.4s cubic-bezier(0.32, 0, 0.67, 0)', transformStyle: 'preserve-3d' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(178deg, #7A9BB8 0%, #6B8CA8 15%, #5B7B94 40%, #5A7A93 60%, #6B8BA5 85%, #7A9AB5 100%)', clipPath: 'polygon(0 0, 100% 0, 50% 100%)', backfaceVisibility: 'hidden' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(5deg, #3A5565 0%, #4A6575 50%, #3D5868 100%)', clipPath: 'polygon(0 0, 100% 0, 50% 100%)', backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }} />
        </div>

        <div className="absolute bottom-0 left-0 right-0" style={{ height: '35vh', zIndex: 18 }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, #3A5565 0%, #4A6575 30%, #5A7585 60%, #5B7B94 85%, transparent 100%)' }} />
        </div>

        <div className="absolute left-3 right-3 md:left-[15%] md:right-[15%] rounded-sm overflow-hidden" style={{ top: stage >= 2 ? '5%' : '58%', bottom: stage >= 2 ? '5%' : '18%', opacity: stage >= 1 ? 1 : 0, zIndex: 15, transition: 'all 1.8s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: stage >= 2 ? '0 50px 100px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.3)', backgroundColor: '#FAF9F6' }}>
          <div className="relative h-full flex flex-col items-center justify-center p-6 md:p-10">
            <Img src="mjc_doodle_dancing.png" alt="Dancing" className="w-48 h-40 md:w-64 md:h-52 rounded-lg mb-4" />
            <p className="text-xs tracking-[0.3em] mb-4 uppercase" style={{ color: C.blueLight }}>{t.hero.subtitle}</p>
            <h1 className="text-4xl md:text-6xl text-center" style={{ color: C.blue, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Marijo</h1>
            <span className="text-2xl md:text-3xl my-1" style={{ color: C.blue, fontFamily: 'Georgia, serif' }}>&</span>
            <h1 className="text-4xl md:text-6xl text-center mb-6" style={{ color: C.blue, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Juanca</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.blueLight})` }} />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.gold }} />
              <div className="w-12 h-px" style={{ background: `linear-gradient(90deg, ${C.blueLight}, transparent)` }} />
            </div>
            <p className="text-lg md:text-xl" style={{ color: C.blue, fontFamily: 'Georgia, serif' }}>{t.date.full}</p>
            <p className="text-sm md:text-base" style={{ color: C.blueLight, fontStyle: 'italic' }}>{t.hero.location}</p>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 z-40" style={{ top: 'calc(52vh - 65px)' }}>
          <div onClick={openEnvelope} onMouseEnter={() => setSealHover(true)} onMouseLeave={() => setSealHover(false)} className={`relative cursor-pointer ${stage >= 1 ? 'pointer-events-none' : ''}`} style={{ transform: stage >= 1 ? 'scale(0) rotate(180deg)' : sealHover ? 'scale(1.05)' : 'scale(1)', opacity: stage >= 1 ? 0 : 1, transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}>
            <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle at 50% 50%, #D4C4A8 0%, #C4B498 30%, #B8A888 60%, #A89878 80%, #988868 100%)', boxShadow: '0 12px 40px rgba(0,0,0,0.4), inset 0 3px 12px rgba(255,255,255,0.35), inset 0 -4px 15px rgba(0,0,0,0.25)' }}>
              <div style={{ color: '#6B5B4B', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.4rem', textShadow: '0 1px 0 rgba(255,255,255,0.5)', letterSpacing: '0.15em' }}>M & J</div>
            </div>
          </div>
        </div>

        <div className={`absolute left-0 right-0 text-center px-8 ${stage >= 1 ? 'opacity-0 translate-y-10' : ''}`} style={{ top: 'calc(52vh + 85px)', zIndex: 35, transition: 'all 0.8s ease' }}>
          <p className="text-xl md:text-2xl mb-1" style={{ color: C.goldLight, fontFamily: 'Georgia, serif', fontStyle: 'italic', textShadow: '0 2px 15px rgba(0,0,0,0.4)' }}>{t.envelope.exclusive}</p>
          <p className="text-2xl md:text-3xl" style={{ color: C.goldLight, fontFamily: 'Georgia, serif', fontStyle: 'italic', textShadow: '0 2px 15px rgba(0,0,0,0.4)' }}>{t.envelope.forYou}</p>
        </div>

        {stage === 0 && <p className="absolute bottom-6 left-0 right-0 text-center text-xs tracking-[0.2em] animate-pulse" style={{ color: 'rgba(255,255,255,0.5)', zIndex: 35 }}>{t.envelope.tap}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.cream, fontFamily: 'Georgia, serif' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: 'rgba(250,248,245,0.92)', borderBottom: '1px solid rgba(91,123,148,0.1)' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-lg" style={{ color: C.blue, fontStyle: 'italic' }}>M & J</span>
          <div className="flex items-center gap-2 md:gap-4 text-xs">
            {t.nav.slice(0, 5).map((n, i) => <a key={i} href={`#s${i}`} className="hidden md:block px-2 py-1 hover:opacity-70" style={{ color: i === 0 ? C.blue : C.blueLight }}>{n}</a>)}
            <a href="#s0" className="md:hidden px-3 py-1 rounded-full text-white" style={{ backgroundColor: C.blue }}>{t.nav[0]}</a>
            <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="px-3 py-1.5 rounded-full text-xs" style={{ border: `1px solid ${C.blue}`, color: C.blue }}>{t.lang}</button>
          </div>
        </div>
      </nav>

      <section className="min-h-screen flex flex-col items-center justify-center pt-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><Img src="mjc_couple_vineyard_bw.jpg" alt="Background" className="w-full h-full" position="bottom" /></div>
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${C.cream} 0%, transparent 30%, transparent 70%, ${C.cream} 100%)` }} />
        <div className="relative z-10 flex flex-col items-center">
          <p className="text-xs tracking-[0.3em] mb-6 uppercase" style={{ color: C.blueLight }}>{t.hero.subtitle}</p>
          <Img src="mjc_doodle_dancing.png" alt="Dancing" className="w-52 h-44 md:w-64 md:h-56 rounded-xl mb-6" />
          <h1 className="text-5xl md:text-7xl text-center" style={{ color: C.blue, fontStyle: 'italic' }}>Marijo</h1>
          <span className="text-3xl my-2" style={{ color: C.blue }}>&</span>
          <h1 className="text-5xl md:text-7xl text-center mb-6" style={{ color: C.blue, fontStyle: 'italic' }}>Juanca</h1>
          <p className="text-xl md:text-2xl mb-1" style={{ color: C.blue }}>{t.date.full}</p>
          <p className="text-base mb-8" style={{ color: C.blueLight, fontStyle: 'italic' }}>{t.hero.location}</p>
          <div className="flex gap-4 md:gap-8 mb-8">
            {[{ v: countdown.d, l: lang === 'es' ? 'días' : 'days' }, { v: countdown.h, l: lang === 'es' ? 'horas' : 'hours' }, { v: countdown.m, l: 'min' }].map((x, i) => (
              <div key={i} className="text-center px-4 md:px-6 py-3 rounded-xl" style={{ backgroundColor: 'rgba(91,123,148,0.08)' }}>
                <div className="text-3xl md:text-4xl font-light" style={{ color: C.blue }}>{x.v}</div>
                <div className="text-xs tracking-wider" style={{ color: C.blueLight }}>{x.l}</div>
              </div>
            ))}
          </div>
          <a href="#s0" className="px-10 py-4 rounded-full text-white text-sm tracking-wider hover:scale-105 transition-transform" style={{ backgroundColor: C.blue, boxShadow: '0 4px 20px rgba(91,123,148,0.3)' }}>{t.nav[0]}</a>
          <p className="mt-10 text-xs tracking-wider animate-bounce" style={{ color: C.blueLight }}>↓ {t.hero.scroll}</p>
        </div>
      </section>

      <section className="py-4"><Img src="mjc_couple_portrait.jpg" alt="Engagement" className="w-full h-[500px] md:h-[700px]" position="center 60%" /></section>

      <section id="s1" className="py-20 px-6" style={{ backgroundColor: C.creamDark }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-2" style={{ color: C.blue, fontStyle: 'italic' }}>{t.story.title}</h2>
          <p className="text-center text-sm mb-4" style={{ color: C.blueLight }}>{t.story.subtitle}</p>
          <p className="text-center text-sm md:text-base mb-12 leading-relaxed max-w-2xl mx-auto" style={{ color: C.blueLight, fontStyle: 'italic' }}>{t.story.intro}</p>
          {t.story.items.map((s, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 mb-12 items-center`}>
              <Img src={s.img} alt={s.title} className="w-full md:w-1/2 h-48 md:h-64 rounded-xl" />
              <div className="w-full md:w-1/2 text-center md:text-left">
                <span className="text-xs tracking-wider" style={{ color: C.gold }}>{s.year}</span>
                <h3 className="text-2xl mb-2" style={{ color: C.blue, fontStyle: 'italic' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.blueLight }}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative h-64 md:h-80">
        <Img src="mjc_ring_bw.jpg" alt="Ring" className="w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(91,123,148,0.4)' }}>
          <p className="text-white text-2xl md:text-4xl flex items-center gap-2" style={{ fontStyle: 'italic' }}>Sí, quiero <Icons.Heart /></p>
        </div>
      </section>

      <section id="s2" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-2" style={{ color: C.blue, fontStyle: 'italic' }}>{t.itinerary.title}</h2>
          <p className="text-center text-sm mb-10" style={{ color: C.blueLight }}>{t.itinerary.subtitle}</p>
          {t.itinerary.events.map((e, i) => (
            <div key={i} className="mb-4 p-5 md:p-6 rounded-2xl hover:shadow-lg transition-all" style={{ backgroundColor: C.creamDark }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                <div>
                  <span className="text-xs tracking-wider" style={{ color: C.blueLight }}>{e.day} · {e.date}</span>
                  <h3 className="text-xl md:text-2xl" style={{ color: C.blue }}>{e.title}</h3>
                </div>
                <span className="text-2xl md:text-3xl font-light" style={{ color: C.blue }}>{e.time}</span>
              </div>
              <p className="text-sm mb-4" style={{ color: C.blueLight }}>{e.desc}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-1.5 rounded-full text-xs text-white" style={{ backgroundColor: C.blue }}>{e.dress}</span>
                <span className="px-4 py-1.5 rounded-full text-xs flex items-center gap-1" style={{ backgroundColor: 'rgba(91,123,148,0.1)', color: C.blueLight }}><Icons.Location /> {e.venue}</span>
                {e.tbd && <span className="px-4 py-1.5 rounded-full text-xs" style={{ backgroundColor: C.gold, color: '#5C4D3C' }}>{lang === 'es' ? 'Detalles pronto' : 'Details coming'}</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative h-48 md:h-72">
        <Img src="mjc_cordoba_flowers.jpg" alt="Córdoba" className="w-full h-full" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.5) 0%, transparent 50%)' }} />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <p className="text-2xl md:text-3xl" style={{ fontStyle: 'italic' }}>Córdoba, España</p>
          <p className="text-sm opacity-80">{lang === 'es' ? 'Donde comienza nuestra nueva aventura' : 'Where our new adventure begins'}</p>
        </div>
      </section>

      <section id="s3" className="py-20 px-6" style={{ backgroundColor: C.creamDark }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-2" style={{ color: C.blue, fontStyle: 'italic' }}>{t.hotels.title}</h2>
          <p className="text-center text-sm mb-2" style={{ color: C.blueLight }}>{t.hotels.subtitle}</p>
          <p className="text-center text-xs mb-4" style={{ color: C.blueLight }}>{t.hotels.intro}</p>
          <p className="text-center text-xs mb-10 px-4 py-2 rounded-full mx-auto" style={{ backgroundColor: C.gold, color: '#5C4D3C', display: 'table' }}>{t.hotels.bookBy}</p>
          {t.hotels.list.map((h, i) => (
            <div key={i} className={`mb-4 rounded-2xl overflow-hidden ${h.top ? 'ring-2' : ''}`} style={{ backgroundColor: C.cream, ringColor: C.gold }}>
              <Img src={h.img} alt={h.name} className="w-full h-40 md:h-48" position="center" />
              <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg" style={{ color: C.blue }}>{h.name}</h3>
                    {h.top && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: C.gold, color: '#5C4D3C' }}>{lang === 'es' ? 'Recomendado' : 'Recommended'}</span>}
                  </div>
                  <p className="text-xs mt-1" style={{ color: C.blueLight }}>{h.dist} · {h.price}</p>
                  <p className="text-xs mt-1" style={{ color: C.blue }}>{h.note}</p>
                </div>
                <a href={h.url} target="_blank" rel="noopener noreferrer" className="px-5 py-2 rounded-full text-sm hover:scale-105 transition-transform" style={{ backgroundColor: C.blue, color: 'white' }}>{lang === 'es' ? 'Reservar' : 'Book'}</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-2" style={{ color: C.blue, fontStyle: 'italic' }}>{t.dress.title}</h2>
          <p className="text-center text-sm mb-2" style={{ color: C.blueLight }}>{t.dress.subtitle}</p>
          <p className="text-center text-xs mb-10" style={{ color: C.blue }}>{t.dress.note}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {t.dress.codes.map((d, i) => (
              <div key={i} className="p-6 rounded-2xl text-center" style={{ backgroundColor: C.creamDark }}>
                <div className="flex justify-center" style={{ color: C.blue }}>{getDressIcon(d.icon)}</div>
                <h3 className="text-xl mt-3 mb-1" style={{ color: C.blue }}>{d.event}</h3>
                <p className="text-sm font-medium mb-2" style={{ color: C.blue }}>{d.code}</p>
                <p className="text-xs" style={{ color: C.blueLight }}>{d.desc}</p>
                {d.colors && <div className="flex flex-wrap justify-center gap-1 mt-3">{d.colors.map((c, j) => <span key={j} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(91,123,148,0.1)', color: C.blueLight }}>{c}</span>)}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 relative" style={{ backgroundColor: C.blue }}>
        <div className="absolute inset-0 opacity-20"><Img src="mjc_cordoba_mezquita.jpg" alt="Mezquita" className="w-full h-full" /></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-2 text-white" style={{ fontStyle: 'italic' }}>{t.travel.title}</h2>
          <p className="text-center text-sm mb-10 text-white/70">{t.travel.subtitle}</p>
          <div className="grid md:grid-cols-3 gap-4">
            {t.travel.sections.map((s, i) => (
              <div key={i} className="p-5 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                <div style={{ color: C.blue }}>{getTravelIcon(s.icon)}</div>
                <h3 className="text-lg mt-2 mb-2" style={{ color: C.blue }}>{s.title}</h3>
                <p className="text-xs mb-3" style={{ color: C.blueLight }}>{s.text}</p>
                <ul className="text-xs space-y-1" style={{ color: C.text }}>{s.tips.map((tip, j) => <li key={j}>• {tip}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="s4" className="py-20 px-6" style={{ backgroundColor: C.blue }}>
        <div className="max-w-xl mx-auto text-center">
          <div className="flex justify-center text-white mb-4"><Icons.Gift /></div>
          <h2 className="text-3xl md:text-4xl mt-4 mb-2 text-white" style={{ fontStyle: 'italic' }}>{t.gifts.title}</h2>
          <p className="text-white/70 text-sm mb-4" style={{ fontStyle: 'italic' }}>{t.gifts.subtitle}</p>
          <p className="text-white/80 text-sm mb-8">{t.gifts.msg}</p>
          <button onClick={() => setShowBank(!showBank)} className="px-8 py-3 rounded-full bg-white text-sm mb-4 hover:scale-105 transition-transform" style={{ color: C.blue }}>{t.gifts.cta}</button>
          {showBank && (
            <div className="mt-4 p-6 rounded-2xl bg-white/10 text-white text-left text-sm backdrop-blur-sm">
              <p className="font-medium mb-3 text-center">{t.gifts.bank.title}</p>
              <p><strong>IBAN:</strong> {t.gifts.bank.iban}</p>
              <p><strong>SWIFT:</strong> {t.gifts.bank.swift}</p>
              <p><strong>{lang === 'es' ? 'Titular' : 'Holder'}:</strong> {t.gifts.bank.holder}</p>
              <p className="text-xs mt-4 text-center opacity-70">{t.gifts.note}</p>
            </div>
          )}
        </div>
      </section>

      <section id="s0" className="py-20 px-6">
        <div className="max-w-md mx-auto">
          {rsvpDone ? (
            <div className="text-center py-10">
              <div className="flex justify-center" style={{ color: C.gold }}><Icons.Celebration /></div>
              <h2 className="text-3xl mt-4 mb-2" style={{ color: C.blue, fontStyle: 'italic' }}>{t.rsvp.thanks.title}</h2>
              <p className="text-sm mb-4" style={{ color: C.blueLight }}>{t.rsvp.thanks.subtitle}</p>
              <p className="text-sm mb-8" style={{ color: C.blueLight }}>{t.rsvp.thanks.msg}</p>
              <Img src="mjc_doodle_dancing.png" alt="Celebration" className="w-40 h-32 rounded-xl mx-auto opacity-60" />
            </div>
          ) : (
            <>
              <h2 className="text-3xl text-center mb-1" style={{ color: C.blue, fontStyle: 'italic' }}>{t.rsvp.title}</h2>
              <p className="text-center text-sm mb-2" style={{ color: C.blueLight }}>{t.rsvp.subtitle}</p>
              <p className="text-center text-xs mb-8 px-3 py-1.5 rounded-full mx-auto" style={{ backgroundColor: C.creamDark, color: C.blue, display: 'table' }}>{t.rsvp.deadline}</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: C.blue }}>{t.rsvp.fields.name}</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border bg-white text-sm focus:ring-2 focus:outline-none" style={{ borderColor: '#E8E4DF' }} />
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: C.blue }}>{t.rsvp.fields.email}</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border bg-white text-sm" style={{ borderColor: '#E8E4DF' }} />
                </div>
                <div>
                  <label className="block text-xs mb-2" style={{ color: C.blue }}>{t.rsvp.fields.attending}</label>
                  <div className="flex gap-4">
                    {[{ v: 'yes', l: t.rsvp.fields.yes }, { v: 'no', l: t.rsvp.fields.no }].map(x => (
                      <label key={x.v} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={form.attending === x.v} onChange={() => setForm({ ...form, attending: x.v })} className="w-4 h-4" style={{ accentColor: C.blue }} />
                        <span className="text-sm" style={{ color: form.attending === x.v ? C.blue : C.blueLight }}>{x.l}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {form.attending === 'yes' && (
                  <>
                    <div>
                      <label className="block text-xs mb-2" style={{ color: C.blue }}>{t.rsvp.fields.guests}</label>
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={() => setForm({ ...form, guests: Math.max(1, form.guests - 1) })} className="w-11 h-11 rounded-full border text-xl hover:bg-gray-50" style={{ borderColor: C.blue, color: C.blue }}>−</button>
                        <span className="text-2xl w-10 text-center" style={{ color: C.blue }}>{form.guests}</span>
                        <button type="button" onClick={() => setForm({ ...form, guests: form.guests + 1 })} className="w-11 h-11 rounded-full border text-xl hover:bg-gray-50" style={{ borderColor: C.blue, color: C.blue }}>+</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs mb-2" style={{ color: C.blue }}>{t.rsvp.fields.allergies}</label>
                      <div className="flex flex-wrap gap-2">
                        {t.rsvp.fields.allergyOpts.map(a => (
                          <button key={a} type="button" onClick={() => toggleAllergy(a)} className="px-4 py-2 rounded-full text-xs transition-all" style={{ border: '1px solid', borderColor: form.allergies.includes(a) ? C.blue : '#E8E4DF', backgroundColor: form.allergies.includes(a) ? C.blue : 'white', color: form.allergies.includes(a) ? 'white' : C.blueLight }}>{a}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs mb-1.5" style={{ color: C.blue }}>{t.rsvp.fields.other}</label>
                      <input type="text" value={form.other} onChange={e => setForm({ ...form, other: e.target.value })} className="w-full px-4 py-3 rounded-xl border bg-white text-sm" style={{ borderColor: '#E8E4DF' }} placeholder={lang === 'es' ? 'Ej: alergia al huevo...' : 'E.g., egg allergy...'} />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: C.blue }}>{t.rsvp.fields.msg}</label>
                  <textarea value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} className="w-full px-4 py-3 rounded-xl border bg-white text-sm resize-none" style={{ borderColor: '#E8E4DF' }} rows={3} />
                </div>
                <button onClick={submitRSVP} className="w-full py-4 rounded-full text-white flex items-center justify-center gap-2 text-sm tracking-wider hover:scale-[1.02] transition-transform" style={{ backgroundColor: C.blue, boxShadow: '0 4px 20px rgba(91,123,148,0.3)' }}><Icons.Send /> {t.rsvp.fields.submit}</button>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-20 px-6" style={{ backgroundColor: C.creamDark }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-10" style={{ color: C.blue, fontStyle: 'italic' }}>{t.faq.title}</h2>
          {t.faq.items.map((f, i) => (
            <div key={i} className="mb-3 rounded-2xl overflow-hidden" style={{ backgroundColor: C.cream }}>
              <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-gray-50">
                <span className="text-sm pr-4" style={{ color: C.blue }}>{f.q}</span>
                <span className="text-xl shrink-0" style={{ color: C.blueLight }}>{expandedFaq === i ? '−' : '+'}</span>
              </button>
              {expandedFaq === i && <div className="px-6 pb-5 text-sm" style={{ color: C.blueLight }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl mb-2" style={{ color: C.blue, fontStyle: 'italic' }}>{t.contact.title}</h2>
          <p className="text-sm mb-4" style={{ color: C.blueLight }}>{t.contact.subtitle}</p>
          <p className="text-sm mb-8" style={{ color: C.blueLight }}>{t.contact.msg}</p>
          <div className="space-y-6">
            <div className="p-4 rounded-2xl" style={{ backgroundColor: C.creamDark }}>
              <p className="text-lg mb-3" style={{ color: C.blue }}>{t.contact.marijo.name}</p>
              <p className="text-sm mb-3" style={{ color: C.blueLight }}>{t.contact.marijo.phone}</p>
              <div className="flex gap-3 justify-center">
                <a href={`https://wa.me/${t.contact.marijo.wa}`} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full flex items-center gap-2 text-sm hover:scale-105 transition-transform" style={{ backgroundColor: '#25D366', color: 'white' }}><Icons.Whatsapp /> WhatsApp</a>
                <a href={`sms:${t.contact.marijo.phone}`} className="px-5 py-2.5 rounded-full flex items-center gap-2 text-sm hover:scale-105 transition-transform" style={{ backgroundColor: '#007AFF', color: 'white' }}><Icons.Imessage /> iMessage</a>
              </div>
            </div>
            <div className="p-4 rounded-2xl" style={{ backgroundColor: C.creamDark }}>
              <p className="text-lg mb-3" style={{ color: C.blue }}>{t.contact.juanca.name}</p>
              <p className="text-sm mb-3" style={{ color: C.blueLight }}>{t.contact.juanca.phone}</p>
              <div className="flex gap-3 justify-center">
                <a href={`https://wa.me/${t.contact.juanca.wa}`} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full flex items-center gap-2 text-sm hover:scale-105 transition-transform" style={{ backgroundColor: '#25D366', color: 'white' }}><Icons.Whatsapp /> WhatsApp</a>
                <a href={`sms:${t.contact.juanca.phone}`} className="px-5 py-2.5 rounded-full flex items-center gap-2 text-sm hover:scale-105 transition-transform" style={{ backgroundColor: '#007AFF', color: 'white' }}><Icons.Imessage /> iMessage</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative py-16 text-center overflow-hidden" style={{ backgroundColor: C.blue }}>
        <div className="absolute inset-0 opacity-10"><Img src="mjc_couple_vineyard.jpg" alt="Footer" className="w-full h-full" /></div>
        <div className="relative z-10">
          <Img src="mjc_doodle_dancing.png" alt="Dancing" className="w-32 h-28 rounded-xl mx-auto mb-4 opacity-70" />
          <p className="text-white text-2xl mb-2" style={{ fontStyle: 'italic' }}>Marijo & Juanca</p>
          <p className="text-white/60 text-sm">{t.date.full} · {t.hero.location}</p>
          <p className="text-white/80 text-lg mt-4">{t.footer.hash}</p>
          <p className="text-white/40 text-xs mt-8 flex items-center justify-center gap-1">{t.footer.made} <Icons.Heart /></p>
        </div>
      </footer>
    </div>
  );
}