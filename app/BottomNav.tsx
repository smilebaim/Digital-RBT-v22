'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const TABS = [
  {
    id: 'profil',
    internalId: 'dampak',
    label: 'Profil',
    icon: '🛎️',
    color: '#15803d',
    bg: '#f0fdf4',
    border: '#bbf7d0',
  },
  {
    id: 'peta',
    internalId: 'peta-operasi',
    label: 'Peta',
    icon: '📍',
    color: '#2563eb',
    bg: '#dbeafe',
    border: '#93c5fd',
  },
  {
    id: 'pembangunan',
    internalId: 'pengungsi',
    label: 'Program',
    icon: '💰',
    color: '#0369a1',
    bg: '#f0f9ff',
    border: '#bae6fd',
  },
  {
    id: 'danadesa',
    internalId: 'pengungsi',
    label: 'Dana Desa',
    icon: '💵',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
  },
  {
    id: 'indeks',
    internalId: 'bantuan',
    label: 'Indeks',
    icon: '📚',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
];

const DRAWER_MENU = [
  {
    label: 'Kelembagaan',
    sub: 'Lembaga Kemasyarakatan & Adat',
    href: '/dashboard?tab=kelembagaan',
    icon: '🏛️',
    color: '#ea580c',
    bg: '#fff7ed',
    border: '#fed7aa',
  },
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
    label: 'Layanan',
    sub: 'Profil & Layanan Desa',
    href: '/dashboard?tab=profil',
    icon: '🛎️',
    color: '#15803d',
    bg: '#f0fdf4',
    border: '#bbf7d0',
  },
  {
    label: 'Ekonomi',
    sub: 'Program & Anggaran Desa',
    href: '/dashboard?tab=pembangunan',
    icon: '💰',
    color: '#0369a1',
    bg: '#f0f9ff',
    border: '#bae6fd',
  },
  {
    label: 'Dana Desa',
    sub: 'Realisasi & Laporan Dana Desa',
    href: '/dashboard?tab=danadesa',
    icon: '💵',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
  },
];

export default function BottomNav() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentTab  = searchParams?.get('tab') ?? '';
  const isDashboard = pathname === '/dashboard';

  /* Tutup drawer dengan Escape */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  /* Expose fungsi global agar header dashboard bisa memicu drawer ini */
  useEffect(() => {
    (window as any).__openGlobalDrawer = () => setDrawerOpen(true);
    return () => { delete (window as any).__openGlobalDrawer; };
  }, []);

  const handleClick = (tabId: string) => {
    if (isDashboard) {
      const switchTab = (window as any).switchTab;
      if (typeof switchTab === 'function') {
        const tabDef = TABS.find(t => t.id === tabId);
        if (tabDef) switchTab(tabDef.internalId);
      }
      router.push(`/dashboard?tab=${tabId}`, { scroll: false });
    } else {
      window.location.href = `/dashboard?tab=${tabId}`;
    }
  };

  return (
    <>
      {/* ══ BOTTOM NAV ══ */}
      <motion.nav 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-[99999] pointer-events-none w-[90%] sm:w-auto max-w-[400px] sm:max-w-[680px]"
      >
        <div
          className="bg-gradient-to-r from-primary-900/85 via-primary-800/80 to-primary-900/85 border border-white/30 rounded-full p-1.5 flex items-center justify-between shadow-2xl pointer-events-auto sm:gap-1"
          style={{ backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)' }}
        >
          {TABS.map((tab) => {
            const isActive = isDashboard && currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleClick(tab.id)}
                title={tab.label}
                style={isActive ? { background: '#ffffff', color: tab.color, borderColor: tab.border } : {}}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2.5 py-1 sm:px-5 sm:py-2.5 rounded-full transition-all duration-200 outline-none flex-1 sm:flex-none border ${
                  isActive 
                    ? 'shadow-md' 
                    : 'bg-transparent text-white hover:bg-white/10 border-transparent'
                }`}
              >
                <span 
                  className="text-[18px] sm:text-[20px] leading-none flex items-center justify-center" 
                  style={{ 
                    opacity: 1,
                    filter: isActive ? 'none' : 'drop-shadow(0 1px 2px rgba(5, 46, 22, 0.8))',
                    transition: 'transform 0.15s, opacity 0.15s' 
                  }}
                >
                  {tab.icon}
                </span>
                <span 
                  className="text-[12px] sm:text-[14px] font-extrabold whitespace-nowrap" 
                  style={{ 
                    color: isActive ? tab.color : '#ffffff',
                    textShadow: isActive ? 'none' : '0 2px 3.5px rgba(5, 46, 22, 0.95)'
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.nav>

      {/* ══ DRAWER OVERLAY ══ */}
      <div
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: drawerOpen ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0)',
          backdropFilter: drawerOpen ? 'blur(2px)' : 'none',
          zIndex: 199999,
          pointerEvents: drawerOpen ? 'auto' : 'none',
          transition: 'background 0.3s',
        }}
      />

      {/* ══ DRAWER PANEL ══ */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: 64,
          left: 0,
          height: 'calc(100% - 150px)',
          width: 300,
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '6px 0 32px rgba(0,0,0,0.15)',
          zIndex: 200000,
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
          overflow: 'hidden',
        }}
      >
        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px',
          background: 'linear-gradient(135deg, rgba(21, 128, 61, 0.6), rgba(22, 163, 74, 0.6))',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#fff', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 15 }}>
            <img
              src="https://desaremaubakotuo.netlify.app/lovable-uploads/logo-desa.png"
              alt="Logo"
              style={{ height: 30, filter: 'brightness(10)' }}
            />
            <span>Menu</span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Tutup menu"
            style={{
              background: 'rgba(255,255,255,0.18)', border: 'none', color: '#fff',
              fontSize: 14, width: 30, height: 30, borderRadius: 6, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        {/* Drawer body */}
        <div style={{ padding: '16px 14px', overflowY: 'auto', flex: 1 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#4b5563', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, paddingLeft: 4 }}>
            Layanan Desa
          </p>

          {DRAWER_MENU.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setDrawerOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 12, textDecoration: 'none',
                background: '#fff', border: '1px solid #e5e7eb',
                marginBottom: 8, transition: 'box-shadow 0.18s, transform 0.15s',
                cursor: 'pointer',
              }}
            >
              <span style={{
                width: 42, height: 42, borderRadius: 10, background: item.bg,
                border: `1px solid ${item.border}`, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
              }}>{item.icon}</span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: item.color, lineHeight: 1.2 }}>{item.label}</span>
                <span style={{ fontSize: 11, color: '#374151', marginTop: 2 }}>{item.sub}</span>
              </span>
              <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}

          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '12px 0' }} />

          <a
            href="/dashboard"
            onClick={() => setDrawerOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, width: '100%', padding: '12px 16px', borderRadius: 12,
              background: 'linear-gradient(135deg, #15803d, #16a34a)', color: '#fff',
              fontSize: 14, fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(21,128,61,0.35)',
            }}
          >
            <span>🔐</span> Login Admin Dashboard
          </a>
        </div>

        {/* Drawer footer */}
        <div style={{
          padding: '12px 18px', fontSize: 10, color: '#6b7280',
          textAlign: 'center', borderTop: '1px solid #e5e7eb',
          background: '#fff', flexShrink: 0,
        }}>
          Desa Remau Bako Tuo © {new Date().getFullYear()}
        </div>
      </div>
    </>
  );
}
