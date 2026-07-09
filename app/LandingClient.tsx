'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './landing.css';

const SLIDES = [
  {
    src: '/desa_slide_1.jpg',
    caption: 'Pemandangan Alam Desa',
    sub: 'Hamparan sawah dan sungai yang asri',
  },
  {
    src: '/desa_slide_2.jpg',
    caption: 'Kehidupan Masyarakat',
    sub: 'Kebersamaan warga Desa Remau Bako Tuo',
  },
  {
    src: '/desa_slide_3.jpg',
    caption: 'Panorama dari Udara',
    sub: 'Keindahan desa dari ketinggian',
  },
  {
    src: '/desa_slide_4.jpg',
    caption: 'Masjid Desa',
    sub: 'Pusat spiritual masyarakat desa',
  },
];

/* ── Menu items drawer ──
   Literasi  → tab Indeks      (?tab=indeks)
   Ekonomi   → tab Pembangunan (?tab=pembangunan)
   Layanan   → tab Profil      (?tab=profil)
   Login     → /dashboard
*/
const DRAWER_MENU = [
  {
    label: 'Literasi',
    sub: 'Data Indeks Desa Membangun',
    href: '/dashboard?tab=indeks',
    icon: '📚',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
  {
    label: 'Ekonomi',
    sub: 'Program Program & Anggaran Pembangunan Anggaran Desa',
    href: '/dashboard?tab=pembangunan',
    icon: '💰',
    color: '#0369a1',
    bg: '#f0f9ff',
    border: '#bae6fd',
  },
  {
    label: 'Layanan',
    sub: 'Profil & Layanan Desa',
    href: '/dashboard?tab=profil',
    icon: '🛎️',
    color: '#15803d',
    bg: '#f0fdf4',
    border: '#bbf7d0',
  },
];

export default function LandingClient() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const goToIndex = (i: number) => {
    if (i === current) return;
    setFade(false);
    setTimeout(() => { setCurrent(i); setFade(true); }, 350);
  };

  const goNext = () => {
    setFade(false);
    setTimeout(() => { setCurrent(prev => (prev + 1) % SLIDES.length); setFade(true); }, 350);
  };

  const goPrev = () => {
    setFade(false);
    setTimeout(() => { setCurrent(prev => (prev - 1 + SLIDES.length) % SLIDES.length); setFade(true); }, 350);
  };

  return (
    <div className="landing-root">

      {/* ══ HEADER ══ */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="land-header"
      >
        <div className="land-header-inner">

          {/* Logo + Nama Desa */}
          <a href="/" className="land-brand">
            <img
              src="https://desaremaubakotuo.netlify.app/lovable-uploads/logo-desa.png"
              alt="Logo Desa Remau Bako Tuo"
              className="land-brand-logo"
            />
            <div className="land-brand-text">
              <span className="land-brand-title">Desa Remau Bako Tuo</span>
              <span className="land-brand-sub">Kabupaten Tanjung Jabung Timur</span>
            </div>
          </a>

          {/* Hamburger — Buka menu drawer */}
          <button
            className="bg-white/10 hover:bg-white/25 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition text-white border-none cursor-pointer outline-none"
            onClick={() => setDrawerOpen(true)}
            aria-label="Buka menu navigasi"
            aria-expanded={drawerOpen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
              <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </button>
        </div>
      </motion.header>

      {/* ══ DRAWER OVERLAY ══ */}
      <div
        className={`land-drawer-overlay ${drawerOpen ? 'land-drawer-overlay-open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ══ DRAWER PANEL ══ */}
      <div
        className={`land-drawer ${drawerOpen ? 'land-drawer-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
      >
        {/* Drawer header */}
        <div className="land-drawer-header">
          <div className="land-drawer-header-brand">
            <img
              src="https://desaremaubakotuo.netlify.app/lovable-uploads/logo-desa.png"
              alt="Logo"
              className="land-drawer-header-logo"
            />
            <span>Menu</span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="land-drawer-close"
            aria-label="Tutup menu"
          >
            ✕
          </button>
        </div>

        {/* Drawer body */}
        <div className="land-drawer-body">
          <p className="land-drawer-section-label">Layanan Desa</p>

          {DRAWER_MENU.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="land-drawer-item"
              style={{
                '--item-color': item.color,
                '--item-bg': item.bg,
                '--item-border': item.border,
              } as React.CSSProperties}
              onClick={() => setDrawerOpen(false)}
            >
              <span className="land-drawer-item-icon-wrap" style={{ background: item.bg, border: `1px solid ${item.border}` }}>
                {item.icon}
              </span>
              <span className="land-drawer-item-text">
                <span className="land-drawer-item-label" style={{ color: item.color }}>{item.label}</span>
                <span className="land-drawer-item-sub">{item.sub}</span>
              </span>
              <svg className="land-drawer-item-arrow" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}

          <div className="land-drawer-divider" />

          {/* Login Admin */}
          <a
            href="/dashboard"
            className="land-drawer-login-btn"
            onClick={() => setDrawerOpen(false)}
          >
            <span>🔐</span>
            Login Admin Dashboard
          </a>
        </div>

        {/* Drawer footer */}
        <div className="land-drawer-footer">
          Desa Remau Bako Tuo &copy; {new Date().getFullYear()}
        </div>
      </div>

      {/* ══ FULLSCREEN SLIDESHOW ══ */}
      <div className="slideshow-container">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`slide-item ${i === current ? 'slide-active' : ''}`}
            style={{ backgroundImage: `url(${slide.src})` }}
          />
        ))}
        <div className="slide-overlay" />

        <motion.div
          initial={{ opacity: 0, y: 30, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="slide-caption slide-caption-visible"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="slide-caption-title"
          >
            SELAMAT DATANG DI LAMAN INFORMASI<br/>
            DESA REMAU BAKO TUO
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="slide-caption-sub"
          >
            Laman ini merupakan pengembangan Sistem Informasi Desa untuk menampilkan layanan publik dan meningkatkan peran masyarakat dalam mendukung program pembangunan desa yang lebih partisipatif dan berkelanjutan
          </motion.div>
        </motion.div>

        <motion.button 
          initial={{ opacity: 0, x: -20, y: "-50%" }}
          animate={{ opacity: 1, x: 0, y: "-50%" }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="slide-arrow slide-arrow-left" 
          onClick={goPrev} 
          aria-label="Sebelumnya"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
        <motion.button 
          initial={{ opacity: 0, x: 20, y: "-50%" }}
          animate={{ opacity: 1, x: 0, y: "-50%" }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="slide-arrow slide-arrow-right" 
          onClick={goNext} 
          aria-label="Berikutnya"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>


      </div>

      <motion.div 
        initial={{ opacity: 0, x: "-50%" }}
        animate={{ opacity: 1, x: "-50%" }}
        transition={{ duration: 1, delay: 2 }}
        className="map-watermark"
      >
        DESA REMAU BAKO TUO • JAMBI
      </motion.div>
    </div>
  );
}
