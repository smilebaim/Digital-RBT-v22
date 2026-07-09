import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import BottomNav from "./BottomNav";

export const metadata: Metadata = {
  title: "Dashboard System Informasi",
  description: "Sistem Informasi",
  keywords: "Dashboard System Informasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Google Fonts - Inter */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* Leaflet CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />

        {/* Leaflet MarkerCluster CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"
        />

        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />

        {/* Spin animation for loading states */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </head>
      <body className="bg-white text-gray-800 font-sans" suppressHydrationWarning>
        {children}

        {/* Global Bottom Navigation — tampil di semua halaman */}
        <Suspense fallback={null}>
          <BottomNav />
        </Suspense>
      </body>
    </html>
  );
}

