'use client';

import dynamic from 'next/dynamic';

const LandingClient = dynamic(() => import('./LandingClient'), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      flexDirection: 'column',
      gap: 16,
    }}>
      <div style={{
        width: 48,
        height: 48,
        border: '3px solid #1a5c2e',
        borderTopColor: '#22c55e',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#555', fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
        Memuat Portal Desa...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
});

export default function LandingWrapper() {
  return <LandingClient />;
}
