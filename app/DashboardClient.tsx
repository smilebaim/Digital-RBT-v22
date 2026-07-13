'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import './dashboard.css';

const scriptLoadCache = new Map<string, Promise<void>>();
let dashboardScriptsPromise: Promise<void> | null = null;

const DASHBOARD_MAIN_SRC = '/js/dashboard-main.js';

const HTML_CONTENT = `
  <!-- Toast Container -->
  <div id="toastContainer"></div>

  <!-- Mobile Menu Overlay (legacy, hidden) -->
  <div id="mobileMenuOverlay" class="mobile-menu-overlay" onclick="toggleMobileMenu()" style="display: none !important;"></div>

  <!-- Mobile Menu Drawer (legacy, hidden) -->
  <div id="mobileMenuDrawer" class="mobile-menu-drawer" style="display: none !important;">
    <div class="mobile-menu-drawer-header">
      <span class="font-semibold">Menu</span>
      <button onclick="toggleMobileMenu()" class="p-1 hover:bg-white/20 rounded">
        <i class="fas fa-times text-lg"></i>
      </button>
    </div>
    <div class="mobile-menu-drawer-body">
      <div class="mb-4">
        <p class="text-xs text-gray-500 mb-2 px-1">Navigasi</p>
        <div class="mobile-menu-item active" onclick="switchTabMobile('dampak')">
          <i class="fas fa-id-card"></i>
          <span>Profil</span>
        </div>
        <div class="mobile-menu-item" onclick="switchTabMobile('peta-operasi')">
          <i class="fas fa-map-marked-alt"></i>
          <span>Peta</span>
        </div>
        <div class="mobile-menu-item" onclick="switchTabMobile('pengungsi')">
          <i class="fas fa-hammer"></i>
          <span>Program</span>
        </div>
        <div class="mobile-menu-item" onclick="switchTabMobile('bantuan')">
          <i class="fas fa-chart-line"></i>
          <span>Indeks</span>
        </div>
      </div>
      <div class="border-t pt-4">
        <p class="text-xs text-gray-500 mb-2 px-1">Update Terakhir</p>
        <div class="px-1 text-sm font-medium text-gray-700" id="lastUpdateMobile">-</div>
      </div>
    </div>
  </div>

  <!-- Header -->
  <header
    class="bg-gradient-to-r from-primary-900/40 via-primary-800/30 to-primary-900/40 text-white shadow-lg sticky top-0 z-50 backdrop-blur-xl border-b border-white/20">
    <div class="container-fluid px-2 md:px-4">
      <div class="flex items-center justify-between h-14 md:h-16">
        <!-- Logo & Title -->
        <a href="/" class="flex items-center gap-2 md:gap-3 min-w-0 flex-1 hover:opacity-90 transition-opacity">
          <img src="https://desaremaubakotuo.netlify.app/lovable-uploads/logo-desa.png" alt="Logo Desa Remau Bako Tuo" class="h-10 md:h-12 w-auto flex-shrink-0">
          <div class="min-w-0" style="text-shadow: 0 2px 3.5px rgba(5, 46, 22, 0.95);">
            <h1 class="text-[15px] md:text-xl font-extrabold truncate text-white">Desa Remau Bako Tuo</h1>
            <p class="text-[11.5px] md:text-sm font-semibold text-white block">Kabupaten Tanjung Jabung Timur</p>
          </div>
        </a>

        <!-- Menu Navigation (Desktop) -->
        <nav class="hidden lg:flex items-center gap-2">
          <!-- Menu items jika ada -->
        </nav>

        <!-- Right Actions -->
        <div class="flex items-center gap-2 md:gap-4 flex-shrink-0">
          <div class="text-right hidden sm:block" style="text-shadow: 0 2px 3.5px rgba(5, 46, 22, 0.95);">
            <p class="text-[11px] md:text-xs font-semibold text-white/95">Update Terakhir</p>
            <p id="lastUpdate" class="text-xs md:text-sm font-extrabold text-white">-</p>
          </div>
          <button onclick="refreshData()" class="bg-white/10 hover:bg-white/25 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition"
            title="Refresh Data">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-4.5 h-4.5">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
          <!-- Hamburger button — opens global React drawer -->
          <button
            onclick="if(window.__openGlobalDrawer) window.__openGlobalDrawer();"
            class="bg-white/10 hover:bg-white/25 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition"
            title="Menu"
            aria-label="Buka menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="w-4.5 h-4.5">
              <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </button>
          <!-- Mobile Menu Button (legacy, hidden) -->
          <button id="mobileMenuBtn" onclick="toggleMobileMenu()"
            class="md:hidden bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition" style="display: none !important;">
            <i class="fas fa-bars text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Tab Bar (hidden — replaced by global BottomNav) -->
  <div class="bg-white shadow-sm border-b sticky top-14 md:top-16 z-40" style="display: none !important;">
    <div class="container-fluid px-2 md:px-4">
      <div
        class="flex items-center justify-between md:justify-start gap-0 md:gap-1 overflow-x-auto py-1 scrollbar-hide">
        <button onclick="switchTab('dampak')" id="tab-dampak"
          class="tab-btn active flex-1 md:flex-none px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium text-gray-600 hover:text-primary-600 whitespace-nowrap">
          <i class="fas fa-id-card mr-1 md:mr-2"></i><span class="hidden xs:inline">Profil</span><span
            class="xs:hidden">Profil</span>
        </button>
        <button onclick="switchTab('peta-operasi')" id="tab-peta-operasi"
          class="tab-btn flex-1 md:flex-none px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium text-gray-600 hover:text-primary-600 whitespace-nowrap">
          <i class="fas fa-map-marked-alt mr-1 md:mr-2"></i><span class="hidden sm:inline">Peta</span><span
            class="sm:hidden">Peta</span>
        </button>
        <button onclick="switchTab('pengungsi')" id="tab-pengungsi"
          class="tab-btn flex-1 md:flex-none px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium text-gray-600 hover:text-primary-600 whitespace-nowrap">
          <i class="fas fa-hammer mr-1 md:mr-2"></i><span class="hidden xs:inline">Program</span><span
            class="xs:hidden">Program</span>
        </button>
        <button onclick="switchTab('bantuan')" id="tab-bantuan"
          class="tab-btn flex-1 md:flex-none px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium text-gray-600 hover:text-primary-600 whitespace-nowrap">
          <i class="fas fa-chart-line mr-1 md:mr-2"></i><span class="hidden xs:inline">Indeks</span><span
            class="xs:hidden">IDM</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <main class="container-fluid px-2 md:px-4 py-4">
    <!-- Loading Overlay -->
    <div id="loadingOverlay" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden">
      <div class="bg-white rounded-xl p-8 flex flex-col items-center gap-4 min-w-[280px]">
        <div class="spinner"></div>
        <p class="text-gray-700 font-medium">Memuat Data</p>
        <ul id="loadingList" class="w-full space-y-2 text-sm">
          <!-- Loading items will be populated by JavaScript -->
        </ul>
      </div>
    </div>

    <!-- TAB: Profil Desa -->
    <div id="content-dampak" class="tab-content active">
      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
        <div class="kpi-card card-hover cursor-pointer" onclick="focusMapOnCategory('korban', this)"
          title="Klik untuk melihat di peta">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 mb-1">Jumlah Penduduk</p>
              <p id="kpi-korban" class="text-2xl font-bold text-gray-800">-</p>
            </div>
            <div class="bg-primary-100 p-3 rounded-full">
              <i class="fas fa-users text-primary-600"></i>
            </div>
          </div>
        </div>
        <div class="kpi-card card-hover cursor-pointer" onclick="focusMapOnCategory('pengungsi', this)"
          title="Klik untuk melihat di peta">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 mb-1">Jumlah KK</p>
              <p id="kpi-pengungsi" class="text-2xl font-bold text-gray-800">-</p>
            </div>
            <div class="bg-orange-100 p-3 rounded-full">
              <i class="fas fa-home text-orange-600"></i>
            </div>
          </div>
        </div>
        <div class="kpi-card card-hover cursor-pointer" onclick="focusMapOnCategory('titik', this)"
          title="Klik untuk melihat di peta">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 mb-1">Jumlah Dusun</p>
              <p id="kpi-titik" class="text-2xl font-bold text-gray-800">-</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-full">
              <i class="fas fa-map-pin text-blue-600"></i>
            </div>
          </div>
        </div>
        <div class="kpi-card card-hover cursor-pointer" onclick="focusMapOnCategory('rumah', this)"
          title="Klik untuk melihat di peta">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 mb-1">Jumlah RT/RW</p>
              <p id="kpi-rumah" class="text-2xl font-bold text-gray-800">-</p>
            </div>
            <div class="bg-red-100 p-3 rounded-full">
              <i class="fas fa-sitemap text-red-600"></i>
            </div>
          </div>
        </div>
        <div class="kpi-card card-hover cursor-pointer" onclick="focusMapOnCategory('sawah', this)"
          title="Klik untuk melihat di peta">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 mb-1">Luas Wilayah (Ha)</p>
              <p id="kpi-sawah" class="text-2xl font-bold text-gray-800">-</p>
            </div>
            <div class="bg-green-100 p-3 rounded-full">
              <i class="fas fa-map text-green-600"></i>
            </div>
          </div>
        </div>
        <div class="kpi-card card-hover cursor-pointer" onclick="focusMapOnCategory('kabupaten', this)"
          title="Klik untuk melihat di peta">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 mb-1">Tahun Berdiri</p>
              <p id="kpi-kabupaten" class="text-2xl font-bold text-gray-800">-</p>
            </div>
            <div class="bg-purple-100 p-3 rounded-full">
              <i class="fas fa-landmark text-purple-600"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Grid: Charts + Map + Info -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 main-grid">
        <!-- Left Panel: Charts -->
        <div class="lg:col-span-1 space-y-4">
          <!-- Status Pie Chart -->
          <div class="panel p-4">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">
              <i class="fas fa-chart-pie text-primary-500 mr-2"></i>Komposisi Penduduk
            </h3>
            <div class="chart-container">
              <canvas id="chartStatusDampak"></canvas>
            </div>
          </div>

          <!-- Top Dusun Bar -->
          <div class="panel p-4">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">
              <i class="fas fa-chart-bar text-primary-500 mr-2"></i>Penduduk per Dusun
            </h3>
            <div class="chart-container" style="height: 200px;">
              <canvas id="chartTopWilayah"></canvas>
            </div>
          </div>
        </div>

        <!-- Center Map -->
        <div class="lg:col-span-2 panel p-0 overflow-hidden map-container-responsive" style="height: 520px;">
          <div id="map" class="h-full w-full"></div>
        </div>

        <!-- Right Panel: Stats & Legend -->
        <div class="lg:col-span-1 space-y-4">
          <!-- Info Dasar Desa -->
          <div class="panel p-4">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">
              <i class="fas fa-info-circle text-primary-500 mr-2"></i>Info Dasar Desa
            </h3>
            <div class="space-y-2" id="quickStats">
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-xs text-gray-500">Tahun Berdiri</span>
                <span id="stat-fasum" class="font-semibold text-gray-800">-</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-xs text-gray-500">Laki-laki</span>
                <span id="stat-kebun" class="font-semibold text-gray-800">-</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-xs text-gray-500">Perempuan</span>
                <span id="stat-tambak" class="font-semibold text-gray-800">-</span>
              </div>
            </div>
          </div>

          <!-- Realisasi Program / Rekap APBDes -->
          <div class="panel p-4">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">
              <i class="fas fa-layer-group text-primary-500 mr-2"></i>Rekap APBDes
            </h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-xs text-gray-500">Dana Desa</span>
                <span id="cluster-total-kerusakan" class="font-semibold text-green-600">-</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-100">
                <span class="text-xs text-gray-500">ADD</span>
                <span id="cluster-total-kerugian" class="font-semibold text-blue-600">-</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-xs text-gray-500">Total APBDes</span>
                <span id="cluster-total-kerusakan-kerugian" class="font-semibold text-gray-800">-</span>
              </div>
            </div>
            <!-- Per Bidang with Pagination -->
            <div class="mt-3 pt-3 border-t border-gray-100">
              <div class="flex justify-between items-center mb-2">
                <p class="text-xs font-medium text-gray-600">Per Bidang:</p>
                <div class="flex items-center gap-1">
                  <button id="sektor-prev" onclick="changeSektorPage(-1)"
                    class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30" disabled>
                    <i class="fas fa-chevron-left text-xs"></i>
                  </button>
                  <span id="sektor-page-info" class="text-xs text-gray-500">1/1</span>
                  <button id="sektor-next" onclick="changeSektorPage(1)"
                    class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30" disabled>
                    <i class="fas fa-chevron-right text-xs"></i>
                  </button>
                </div>
              </div>
              <div id="cluster-sektor-breakdown" class="space-y-1">
                <div class="text-gray-400 text-center py-1 text-xs">Memuat...</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Program Pembangunan Section -->
      <div class="panel p-4 mt-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-700">
            <i class="fas fa-hard-hat text-green-500 mr-2"></i>Program Pembangunan Desa
            <span id="pertanian-total"
              class="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">0</span>
          </h3>
          <div class="flex gap-2 text-xs">
            <div class="px-2 py-1 bg-red-50 rounded">
              <span class="text-red-600">Prioritas:</span>
              <span id="pertanian-berat" class="font-bold text-red-700">0</span>
            </div>
            <div class="px-2 py-1 bg-yellow-50 rounded">
              <span class="text-yellow-600">Sedang:</span>
              <span id="pertanian-sedang" class="font-bold text-yellow-700">0</span>
            </div>
            <div class="px-2 py-1 bg-green-50 rounded">
              <span class="text-green-600">Selesai:</span>
              <span id="pertanian-ringan" class="font-bold text-green-700">0</span>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto max-h-64">
          <table class="data-table text-xs w-full">
            <thead>
              <tr class="bg-gray-50">
                <th class="text-left p-2">Nama Program</th>
                <th class="text-left p-2">Kabupaten</th>
                <th class="text-left p-2">Kecamatan</th>
                <th class="text-right p-2">Volume</th>
                <th class="text-right p-2">Anggaran</th>
                <th class="text-center p-2">Status</th>
              </tr>
            </thead>
            <tbody id="tablePertanian">
              <tr>
                <td colspan="6" class="text-center p-4 text-gray-400">Memuat data...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB: Peta Desa -->
    <div id="content-peta-operasi" class="tab-content">
      <!-- Fullscreen Map Container -->
      <div class="map-fullscreen-container panel">
        <!-- Map -->
        <div id="mapOperasi"></div>

        <!-- Right Overlay Cards -->
        <div class="map-overlay-right">
          <!-- Fasilitas Desa -->
          <div class="map-overlay-card">
            <h3><i class="fas fa-hospital text-green-500 mr-1"></i>Fasilitas Kesehatan</h3>
            <div class="grid grid-cols-3 gap-1 text-xs">
              <div class="text-center p-1 bg-green-50 rounded">
                <div class="text-gray-500">Polindes</div>
                <div id="stat-puskesmas" class="font-bold text-green-600">-</div>
              </div>
              <div class="text-center p-1 bg-blue-50 rounded">
                <div class="text-gray-500">Posyandu</div>
                <div id="stat-rsud" class="font-bold text-blue-600">-</div>
              </div>
              <div class="text-center p-1 bg-purple-50 rounded">
                <div class="text-gray-500">Puskesmas</div>
                <div id="stat-fasyankes" class="font-bold text-purple-600">-</div>
              </div>
            </div>
          </div>

          <!-- Infrastruktur Status -->
          <div class="map-overlay-card">
            <h3><i class="fas fa-tools text-red-500 mr-1"></i>Status Infrastruktur</h3>
            <div class="flex gap-1 text-xs">
              <div class="flex-1 text-center p-1 bg-red-50 rounded">
                <div class="text-red-600 text-[10px]">Kritis</div>
                <div id="jaringan-critical" class="font-bold text-red-700">-</div>
              </div>
              <div class="flex-1 text-center p-1 bg-yellow-50 rounded">
                <div class="text-yellow-600 text-[10px]">Perhatian</div>
                <div id="jaringan-warning" class="font-bold text-yellow-700">-</div>
              </div>
              <div class="flex-1 text-center p-1 bg-green-50 rounded">
                <div class="text-green-600 text-[10px]">Baik</div>
                <div id="jaringan-normal" class="font-bold text-green-700">-</div>
              </div>
            </div>
          </div>

          <!-- Titik Penting -->
          <div class="map-overlay-card">
            <h3><i class="fas fa-map-marker-alt text-indigo-500 mr-1"></i>Titik Penting Desa</h3>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Total Titik</span>
                <span id="posko-total" class="font-bold text-indigo-600">-</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Fasilitas Publik</span>
                <span id="posko-pengungsi-total" class="font-bold text-indigo-600">-</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-500">Pos Layanan</span>
                <span id="posko-titik-pengungsian" class="font-bold text-indigo-600">-</span>
              </div>
            </div>
          </div>

          <!-- Legend Compact -->
          <div class="map-overlay-card">
            <h3><i class="fas fa-info-circle text-primary-500 mr-1"></i>Legenda</h3>
            <div class="grid grid-cols-2 gap-1 text-xs">
              <div class="flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Kritis</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-yellow-500"></span>
                <span>Perhatian</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-orange-500"></span>
                <span>Sedang</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-green-500"></span>
                <span>Baik</span>
              </div>
            </div>
            <div class="mt-1 pt-1 border-t text-[10px] text-gray-500">
              <div>Status kondisi infrastruktur desa</div>
            </div>
          </div>
        </div>

        <!-- Bottom Right: Layer Controls -->
        <div class="map-overlay-bottom-right">
          <div class="layer-control-toggle" onclick="toggleLayerControl()">
            <span><i class="fas fa-layer-group mr-1"></i>Layer & Filter</span>
            <i id="layer-control-icon" class="fas fa-chevron-up"></i>
          </div>
          <div id="layer-control-content" class="layer-control-content expanded">
            <div class="layer-control-panel">
              <!-- Layer Toggles -->
              <div class="layer-title">LAYER:</div>
              <div class="layer-items mb-2">
                <label
                  class="inline-flex items-center gap-1 px-1.5 py-1 bg-green-50 border border-green-200 rounded cursor-pointer hover:bg-green-100">
                  <input type="checkbox" id="layer-faskes" checked onchange="toggleFaskesLayer()"
                    class="w-3 h-3 accent-green-600">
                  <i class="fas fa-hospital text-green-600 text-xs"></i>
                  <span id="stat-faskes-total" class="text-xs font-bold text-green-700">-</span>
                </label>
                <label
                  class="inline-flex items-center gap-1 px-1.5 py-1 bg-yellow-50 border border-yellow-200 rounded cursor-pointer hover:bg-yellow-100">
                  <input type="checkbox" id="layer-banlog" onchange="toggleLayer('banlog')"
                    class="w-3 h-3 accent-yellow-600">
                  <i class="fas fa-star text-yellow-600 text-xs"></i>
                  <span id="stat-banlog" class="text-xs font-bold text-yellow-700">-</span>
                </label>
                <label
                  class="inline-flex items-center gap-1 px-1.5 py-1 bg-red-50 border border-red-200 rounded cursor-pointer hover:bg-red-100">
                  <input type="checkbox" id="layer-jaringan" onchange="toggleLayer('jaringan')"
                    class="w-3 h-3 accent-red-600">
                  <i class="fas fa-tools text-red-600 text-xs"></i>
                  <span id="stat-jaringan" class="text-xs font-bold text-red-700">-</span>
                </label>
                <label
                  class="inline-flex items-center gap-1 px-1.5 py-1 bg-pink-50 border border-pink-200 rounded cursor-pointer hover:bg-pink-100">
                  <input type="checkbox" id="layer-cluster6" onchange="toggleLayer('cluster6')"
                    class="w-3 h-3 accent-pink-600">
                  <i class="fas fa-chart-line text-pink-600 text-xs"></i>
                  <span id="stat-cluster6" class="text-xs font-bold text-pink-700">-</span>
                </label>
                <label
                  class="inline-flex items-center gap-1 px-1.5 py-1 bg-indigo-50 border border-indigo-200 rounded cursor-pointer hover:bg-indigo-100">
                  <input type="checkbox" id="layer-posko" onchange="toggleLayer('posko')"
                    class="w-3 h-3 accent-indigo-600">
                  <i class="fas fa-map-marker-alt text-indigo-600 text-xs"></i>
                  <span id="stat-posko" class="text-xs font-bold text-indigo-700">-</span>
                </label>
                <label
                  class="inline-flex items-center gap-1 px-1.5 py-1 bg-amber-50 border border-amber-200 rounded cursor-pointer hover:bg-amber-100">
                  <input type="checkbox" id="layer-tenda" onchange="toggleLayer('tenda')"
                    class="w-3 h-3 accent-amber-600">
                  <i class="fas fa-tents text-amber-600 text-xs"></i>
                  <span id="stat-tenda" class="text-xs font-bold text-amber-700">-</span>
                </label>
                <label
                  class="inline-flex items-center gap-1 px-1.5 py-1 bg-cyan-50 border border-cyan-200 rounded cursor-pointer hover:bg-cyan-100">
                  <input type="checkbox" id="layer-faspublik" onchange="toggleLayer('faspublik')"
                    class="w-3 h-3 accent-cyan-600">
                  <i class="fas fa-building-flag text-cyan-600 text-xs"></i>
                  <span id="stat-faspublik" class="text-xs font-bold text-cyan-700">-</span>
                </label>
                <label
                  class="inline-flex items-center gap-1 px-1.5 py-1 bg-violet-50 border border-violet-200 rounded cursor-pointer hover:bg-violet-100">
                  <input type="checkbox" id="layer-polygon" onchange="togglePolygonLayer()"
                    class="w-3 h-3 accent-violet-600" checked>
                  <i class="fas fa-draw-polygon text-violet-600 text-xs"></i>
                  <span id="stat-polygon" class="text-xs font-bold text-violet-700">-</span>
                </label>
              </div>

              <!-- Filters -->
              <div class="layer-title">FILTER:</div>
              <div class="flex flex-wrap gap-1 mb-2">
                <select id="filterKabupaten" onchange="applyFilter()" class="text-xs border rounded px-1.5 py-1 flex-1">
                  <option value="">Semua Dusun</option>
                </select>
                <select id="filterStatus" onchange="applyFilter()" class="text-xs border rounded px-1.5 py-1">
                  <option value="">Semua Status</option>
                  <option value="critical">Kritis</option>
                  <option value="warning">Perlu Perhatian</option>
                  <option value="normal">Baik</option>
                </select>
                <button onclick="resetFilters()" class="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded">
                  <i class="fas fa-redo text-gray-500"></i>
                </button>
              </div>

              <!-- IDM Filters -->
              <div id="cluster6-filters" class="mb-2" style="display: none;">
                <div class="layer-title text-pink-600">IDM FILTER:</div>
                <div class="flex flex-wrap gap-1">
                  <select id="filterSektor" onchange="applyCluster6Filter()"
                    class="text-xs border border-pink-200 rounded px-1.5 py-1 flex-1">
                    <option value="">Semua Dimensi</option>
                  </select>
                  <select id="filterSubSektor" onchange="applyCluster6Filter()"
                    class="text-xs border border-pink-200 rounded px-1.5 py-1 flex-1">
                    <option value="">Semua Indikator</option>
                  </select>
                </div>
              </div>

              <!-- Polygon Controls -->
              <div id="polygon-controls" style="display: flex; flex-wrap: wrap;">
                <div class="layer-title text-violet-600">WILAYAH:</div>
                <div class="flex flex-wrap gap-1">
                  <select id="polygon-level" onchange="changePolygonLevel(this.value)"
                    class="text-xs border border-violet-200 rounded px-1.5 py-1">
                    <option value="2" selected>Kabupaten/Kota</option>
                    <option value="3">Kecamatan</option>
                    <option value="4">Desa/Kelurahan</option>
                  </select>
                  <div class="relative flex-1">
                    <input type="text" id="polygon-search-input" placeholder="Cari wilayah..."
                      class="text-xs border border-violet-200 rounded px-2 py-1 w-full" onkeyup="searchPolygon()"
                      autocomplete="off">
                    <div id="polygon-search-results"
                      class="absolute top-full left-0 w-full bg-white border border-violet-200 rounded-b shadow-lg z-50 max-h-48 overflow-y-auto"
                      style="display: none;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB: Pembangunan (Dana Desa) -->
    <div id="content-pengungsi" class="tab-content">
      <!-- KPI Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div class="kpi-card card-hover">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 mb-1">Total APBDes</p>
              <p id="kpi-penduduk" class="text-2xl font-bold text-gray-800">-</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-full">
              <i class="fas fa-piggy-bank text-blue-600"></i>
            </div>
          </div>
        </div>
        <div class="kpi-card card-hover">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 mb-1">Dana Desa (DD)</p>
              <p id="kpi-kk" class="text-2xl font-bold text-gray-800">-</p>
            </div>
            <div class="bg-green-100 p-3 rounded-full">
              <i class="fas fa-money-bill-wave text-green-600"></i>
            </div>
          </div>
        </div>
        <div class="kpi-card card-hover">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 mb-1">Alokasi Dana Desa</p>
              <p id="kpi-disabilitas" class="text-2xl font-bold text-gray-800">-</p>
            </div>
            <div class="bg-purple-100 p-3 rounded-full">
              <i class="fas fa-donate text-purple-600"></i>
            </div>
          </div>
        </div>
        <div class="kpi-card card-hover">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-500 mb-1">PAD Desa</p>
              <p id="kpi-pengungsi-tab" class="text-2xl font-bold text-gray-800">-</p>
            </div>
            <div class="bg-orange-100 p-3 rounded-full">
              <i class="fas fa-hand-holding-usd text-orange-600"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div class="panel p-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">
            <i class="fas fa-star text-yellow-500 mr-2"></i>Program Unggulan
            <span id="orangHilang-total"
              class="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">0</span>
          </h3>
          <!-- Summary Stats -->
          <div class="flex gap-2 mb-3">
            <div class="flex-1 text-center p-2 bg-yellow-50 rounded">
              <div class="text-xs text-yellow-600">Berjalan</div>
              <div id="orangHilang-ongoing" class="font-bold text-yellow-700">0</div>
            </div>
            <div class="flex-1 text-center p-2 bg-green-50 rounded">
              <div class="text-xs text-green-600">Selesai</div>
              <div id="orangHilang-found" class="font-bold text-green-700">0</div>
            </div>
          </div>
          <!-- Slider Container -->
          <div class="relative" style="height: 180px;">
            <div id="orangHilang-slider" class="overflow-hidden h-full">
              <div id="orangHilang-cards" class="flex transition-transform duration-300 h-full">
                <div class="flex-shrink-0 w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  <i class="fas fa-spinner fa-spin mr-2"></i>Memuat data...
                </div>
              </div>
            </div>
            <button id="orangHilang-prev" onclick="slideOrangHilang(-1)"
              class="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 z-10 disabled:opacity-30"
              disabled>
              <i class="fas fa-chevron-left text-gray-600"></i>
            </button>
            <button id="orangHilang-next" onclick="slideOrangHilang(1)"
              class="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 z-10 disabled:opacity-30"
              disabled>
              <i class="fas fa-chevron-right text-gray-600"></i>
            </button>
            <div id="orangHilang-dots" class="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1"></div>
          </div>
        </div>
        <div class="panel p-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">
            <i class="fas fa-chart-pie text-primary-500 mr-2"></i>Anggaran per Bidang
          </h3>
          <div class="chart-container" style="height: 250px;">
            <canvas id="chartDisabilitas"></canvas>
          </div>
        </div>
        <div class="panel p-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">
            <i class="fas fa-chart-bar text-primary-500 mr-2"></i>Realisasi Anggaran
          </h3>
          <div class="chart-container" style="height: 250px;">
            <canvas id="chartKK"></canvas>
          </div>
        </div>
      </div>

      <!-- Map + Table -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="panel map-container-responsive" style="height: 400px;">
          <div id="mapPengungsi" class="h-full"></div>
        </div>
        <div class="panel p-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">
            <i class="fas fa-table text-primary-500 mr-2"></i>Rincian APBDes
          </h3>
          <div class="overflow-x-auto max-h-80">
            <table class="data-table text-sm">
              <thead>
                <tr class="bg-gray-50">
                  <th class="text-left p-3">Bidang Program</th>
                  <th class="text-right p-3">Pagu</th>
                  <th class="text-right p-3">Realisasi</th>
                  <th class="text-right p-3">Sisa</th>
                </tr>
              </thead>
              <tbody id="tablePengungsi">
                <!-- Data rows -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB: Indeks (IDM) -->
    <div id="content-bantuan" class="tab-content">
      <!-- KPI Cards -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <div class="kpi-card card-hover">
          <div class="flex items-center gap-3">
            <div class="bg-primary-100 p-3 rounded-full">
              <i class="fas fa-chart-line text-primary-600"></i>
            </div>
            <div>
              <p class="text-xs text-gray-500">Skor IDM 2024</p>
              <p id="kpi-desa" class="text-xl font-bold">-</p>
            </div>
          </div>
        </div>
        <div class="kpi-card card-hover">
          <div class="flex items-center gap-3">
            <div class="bg-yellow-100 p-3 rounded-full">
              <i class="fas fa-star text-yellow-600"></i>
            </div>
            <div>
              <p class="text-xs text-gray-500">Status Maju</p>
              <p id="kpi-kuning" class="text-xl font-bold text-yellow-600">-</p>
            </div>
          </div>
        </div>
        <div class="kpi-card card-hover">
          <div class="flex items-center gap-3">
            <div class="bg-blue-100 p-3 rounded-full">
              <i class="fas fa-seedling text-blue-600"></i>
            </div>
            <div>
              <p class="text-xs text-gray-500">Berkembang</p>
              <p id="kpi-biru" class="text-xl font-bold text-blue-600">-</p>
            </div>
          </div>
        </div>
        <div class="kpi-card card-hover">
          <div class="flex items-center gap-3">
            <div class="bg-gray-200 p-3 rounded-full">
              <i class="fas fa-pause-circle text-gray-600"></i>
            </div>
            <div>
              <p class="text-xs text-gray-500">Tertinggal</p>
              <p id="kpi-abu" class="text-xl font-bold text-gray-600">-</p>
            </div>
          </div>
        </div>
        <div class="kpi-card card-hover">
          <div class="flex items-center gap-3">
            <div class="bg-white border-2 p-3 rounded-full">
              <i class="fas fa-hourglass-start text-gray-400"></i>
            </div>
            <div>
              <p class="text-xs text-gray-500">Sangat Tertinggal</p>
              <p id="kpi-putih" class="text-xl font-bold">-</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div class="panel p-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">
            <i class="fas fa-chart-pie text-primary-500 mr-2"></i>Status Indikator IDM
          </h3>
          <div class="chart-container" style="height: 250px;">
            <canvas id="chartBantuanStatus"></canvas>
          </div>
        </div>
        <div class="panel p-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">
            <i class="fas fa-chart-bar text-primary-500 mr-2"></i>Skor IKS, IKE, IKL
          </h3>
          <div class="chart-container" style="height: 250px;">
            <canvas id="chartBantuanKab"></canvas>
          </div>
        </div>
      </div>

      <!-- Map + Table -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="panel map-container-responsive" style="height: 400px;">
          <div id="mapBantuan" class="h-full"></div>
        </div>
        <div class="panel p-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">
            <i class="fas fa-table text-primary-500 mr-2"></i>Rincian Indikator
          </h3>
          <div class="overflow-x-auto max-h-80">
            <table class="data-table text-sm w-full">
              <thead>
                <tr class="bg-gray-50">
                  <th class="text-left p-3">Indikator</th>
                  <th class="text-center p-3">Kode</th>
                  <th class="text-right p-3">Skor</th>
                  <th class="text-center p-3">Status</th>
                </tr>
              </thead>
              <tbody id="tableBantuan">
                <!-- Data rows -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB: Kelembagaan -->
    <div id="content-kelembagaan" class="tab-content">
      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div class="kpi-card card-hover">
          <div class="flex items-center gap-3">
            <div class="bg-primary-100 p-3 rounded-xl border border-primary-200">
              <i class="fas fa-sitemap text-primary-600 text-lg"></i>
            </div>
            <div>
              <p class="text-[11px] text-gray-500 font-semibold mb-0.5">Jumlah Lembaga</p>
              <p class="text-xl font-black text-gray-800">6 Lembaga</p>
            </div>
          </div>
        </div>
        <div class="kpi-card card-hover">
          <div class="flex items-center gap-3">
            <div class="bg-purple-100 p-3 rounded-xl border border-purple-200">
              <i class="fas fa-users text-purple-600 text-lg"></i>
            </div>
            <div>
              <p class="text-[11px] text-gray-500 font-semibold mb-0.5">Total Pengurus / Anggota</p>
              <p class="text-xl font-black text-gray-800">85 Jiwa</p>
            </div>
          </div>
        </div>
        <div class="kpi-card card-hover">
          <div class="flex items-center gap-3">
            <div class="bg-blue-100 p-3 rounded-xl border border-blue-200">
              <i class="fas fa-clipboard-check text-blue-600 text-lg"></i>
            </div>
            <div>
              <p class="text-[11px] text-gray-500 font-semibold mb-0.5">Kegiatan Terlaksana</p>
              <p class="text-xl font-black text-gray-800">38 Kegiatan</p>
            </div>
          </div>
        </div>
        <div class="kpi-card card-hover">
          <div class="flex items-center gap-3">
            <div class="bg-emerald-100 p-3 rounded-xl border border-emerald-200">
              <i class="fas fa-check-circle text-emerald-600 text-lg"></i>
            </div>
            <div>
              <p class="text-[11px] text-gray-500 font-semibold mb-0.5">Rata-rata Keaktifan</p>
              <p class="text-xl font-black text-gray-800">100% Aktif</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Layout: Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 main-grid">
        <!-- Left Column: Lembaga List (2/5 span) -->
        <div class="lg:col-span-2 space-y-3 max-h-[600px] overflow-y-auto pr-1">
          <div class="p-1">
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
              Daftar Lembaga Kemasyarakatan
            </h3>
            
            <!-- Lembaga Cards -->
            <div class="space-y-3.5">
              <!-- Pemerintah Desa -->
              <div onclick="selectKelembagaan('pemerintah', this)" 
                class="lembaga-card border border-primary-500 ring-2 ring-primary-100 bg-primary-50/20 p-4 rounded-xl cursor-pointer hover:shadow-md transition duration-200">
                <div class="flex items-center justify-between gap-3 mb-2">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-lg shadow-sm border border-white">
                      <i class="fas fa-landmark text-primary-600"></i>
                    </div>
                    <div class="min-w-0">
                      <h4 class="text-sm font-bold text-gray-800 truncate">Pemerintah Desa</h4>
                      <p class="text-[11px] text-gray-500">Lembaga Eksekutif Desa</p>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-extrabold uppercase tracking-wider">Aktif</span>
                </div>
                <div class="flex items-center justify-between border-t border-gray-100/80 pt-2 text-xs text-gray-500 font-medium">
                  <span>Anggota: <strong class="text-gray-700">12 Jiwa</strong></span>
                  <span>Kegiatan: <strong class="text-gray-700">8 Terlaksana</strong></span>
                </div>
              </div>

              <!-- BPD -->
              <div onclick="selectKelembagaan('bpd', this)" 
                class="lembaga-card border border-gray-200 bg-white p-4 rounded-xl cursor-pointer hover:shadow-md transition duration-200">
                <div class="flex items-center justify-between gap-3 mb-2">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-lg shadow-sm border border-white">
                      <i class="fas fa-balance-scale text-purple-600"></i>
                    </div>
                    <div class="min-w-0">
                      <h4 class="text-sm font-bold text-gray-800 truncate">BPD</h4>
                      <p class="text-[11px] text-gray-500">Badan Permusyawaratan Desa</p>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-extrabold uppercase tracking-wider">Aktif</span>
                </div>
                <div class="flex items-center justify-between border-t border-gray-100/80 pt-2 text-xs text-gray-500 font-medium">
                  <span>Anggota: <strong class="text-gray-700">7 Jiwa</strong></span>
                  <span>Kegiatan: <strong class="text-gray-700">4 Terlaksana</strong></span>
                </div>
              </div>

              <!-- LPM -->
              <div onclick="selectKelembagaan('lpm', this)" 
                class="lembaga-card border border-gray-200 bg-white p-4 rounded-xl cursor-pointer hover:shadow-md transition duration-200">
                <div class="flex items-center justify-between gap-3 mb-2">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-lg shadow-sm border border-white">
                      <i class="fas fa-hands-helping text-blue-600"></i>
                    </div>
                    <div class="min-w-0">
                      <h4 class="text-sm font-bold text-gray-800 truncate">LPM</h4>
                      <p class="text-[11px] text-gray-500">Lembaga Pemberdayaan Masyarakat</p>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-extrabold uppercase tracking-wider">Aktif</span>
                </div>
                <div class="flex items-center justify-between border-t border-gray-100/80 pt-2 text-xs text-gray-500 font-medium">
                  <span>Anggota: <strong class="text-gray-700">15 Jiwa</strong></span>
                  <span>Kegiatan: <strong class="text-gray-700">6 Terlaksana</strong></span>
                </div>
              </div>

              <!-- PKK -->
              <div onclick="selectKelembagaan('pkk', this)" 
                class="lembaga-card border border-gray-200 bg-white p-4 rounded-xl cursor-pointer hover:shadow-md transition duration-200">
                <div class="flex items-center justify-between gap-3 mb-2">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-lg shadow-sm border border-white">
                      <i class="fas fa-female text-pink-600"></i>
                    </div>
                    <div class="min-w-0">
                      <h4 class="text-sm font-bold text-gray-800 truncate">PKK Desa</h4>
                      <p class="text-[11px] text-gray-500">Pemberdayaan Kesejahteraan Keluarga</p>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-extrabold uppercase tracking-wider">Aktif</span>
                </div>
                <div class="flex items-center justify-between border-t border-gray-100/80 pt-2 text-xs text-gray-500 font-medium">
                  <span>Anggota: <strong class="text-gray-700">25 Jiwa</strong></span>
                  <span>Kegiatan: <strong class="text-gray-700">12 Terlaksana</strong></span>
                </div>
              </div>

              <!-- Karang Taruna -->
              <div onclick="selectKelembagaan('karang_taruna', this)" 
                class="lembaga-card border border-gray-200 bg-white p-4 rounded-xl cursor-pointer hover:shadow-md transition duration-200">
                <div class="flex items-center justify-between gap-3 mb-2">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-lg shadow-sm border border-white">
                      <i class="fas fa-fire text-red-600"></i>
                    </div>
                    <div class="min-w-0">
                      <h4 class="text-sm font-bold text-gray-800 truncate">Karang Taruna</h4>
                      <p class="text-[11px] text-gray-500">Wadah Kepemudaan Desa</p>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-extrabold uppercase tracking-wider">Aktif</span>
                </div>
                <div class="flex items-center justify-between border-t border-gray-100/80 pt-2 text-xs text-gray-500 font-medium">
                  <span>Anggota: <strong class="text-gray-700">18 Jiwa</strong></span>
                  <span>Kegiatan: <strong class="text-gray-700">5 Terlaksana</strong></span>
                </div>
              </div>

              <!-- BUMDes -->
              <div onclick="selectKelembagaan('bumdes', this)" 
                class="lembaga-card border border-gray-200 bg-white p-4 rounded-xl cursor-pointer hover:shadow-md transition duration-200">
                <div class="flex items-center justify-between gap-3 mb-2">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-lg shadow-sm border border-white">
                      <i class="fas fa-store text-emerald-600"></i>
                    </div>
                    <div class="min-w-0">
                      <h4 class="text-sm font-bold text-gray-800 truncate">BUMDes</h4>
                      <p class="text-[11px] text-gray-500">Badan Usaha Milik Desa</p>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-extrabold uppercase tracking-wider">Aktif</span>
                </div>
                <div class="flex items-center justify-between border-t border-gray-100/80 pt-2 text-xs text-gray-500 font-medium">
                  <span>Anggota: <strong class="text-gray-700">8 Jiwa</strong></span>
                  <span>Kegiatan: <strong class="text-gray-700">3 Terlaksana</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Detail Panel (3/5 span) -->
        <div class="lg:col-span-3">
          <div class="panel p-5 h-full min-h-[420px]" id="kelembagaan-detail">
            <!-- Loading or Default Detail Content will be updated dynamically -->
            <div class="flex flex-col items-center justify-center h-full text-center py-10">
              <div class="spinner mb-4"></div>
              <p class="text-sm font-medium text-gray-500">Memuat rincian lembaga...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

function isDashboardMainReady(src: string) {
  return (
    src === DASHBOARD_MAIN_SRC &&
    typeof (window as unknown as { __dashboardMainReady?: boolean }).__dashboardMainReady ===
      'boolean' &&
    (window as unknown as { __dashboardMainReady?: boolean }).__dashboardMainReady === true
  );
}

function loadScript(src: string): Promise<void> {
  const cached = scriptLoadCache.get(src);
  if (cached) return cached;

  const promise = new Promise<void>((resolve, reject) => {
    let existing = document.querySelector(
      `script[src="${src}"]`
    ) as HTMLScriptElement | null;

    if (existing?.dataset.loaded === 'true' && isDashboardMainReady(src)) {
      resolve();
      return;
    }

    if (existing?.dataset.loaded === 'true' && !isDashboardMainReady(src)) {
      existing.remove();
      scriptLoadCache.delete(src);
      existing = null;
    }

    if (existing?.isConnected) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error(`Failed to load script: ${src}`)),
        { once: true }
      );
      return;
    }

    const s = document.createElement('script');
    s.src = src;
    s.async = false;
    s.onload = () => {
      s.dataset.loaded = 'true';
      resolve();
    };
    s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(s);
  });

  scriptLoadCache.set(src, promise);
  return promise;
}

async function loadDashboardScripts() {
  await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
  await loadScript('https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js');
  await loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js');
  await loadScript(
    'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0/dist/chartjs-plugin-datalabels.min.js'
  );
  await loadScript('/js/dashboard-data.js');
  await loadScript(DASHBOARD_MAIN_SRC);

  if (!isDashboardMainReady(DASHBOARD_MAIN_SRC)) {
    throw new Error('dashboard-main.js did not initialize');
  }
}

export default function DashboardClient() {
  const searchParams = useSearchParams();

  // ── Sembunyikan nav bawaan dashboard (diganti oleh global BottomNav) ──
  useEffect(() => {
    // Hide mobile overlay & drawer
    const mobileOverlay = document.getElementById('mobileMenuOverlay');
    const mobileDrawer  = document.getElementById('mobileMenuDrawer');
    const mobileBtn     = document.getElementById('mobileMenuBtn');
    if (mobileOverlay) mobileOverlay.style.display = 'none';
    if (mobileDrawer)  mobileDrawer.style.display  = 'none';
    if (mobileBtn)     mobileBtn.style.display      = 'none';

    // Hide tab bar (3 levels up dari #tab-dampak: button → flex-div → container → sticky-wrapper)
    const tabDampak = document.getElementById('tab-dampak');
    if (tabDampak) {
      const tabBar = tabDampak.parentElement?.parentElement?.parentElement as HTMLElement | null;
      if (tabBar) tabBar.style.display = 'none';
    }

    // Tambah padding bawah pada main agar tidak tertutup global nav
    const mainEl = document.querySelector('main') as HTMLElement | null;
    if (mainEl) mainEl.style.paddingBottom = '84px';
  }, []); // run once on mount

  // ── Load scripts & auto-switch tab dari URL param ──
  useEffect(() => {
    // Expose stubs to prevent ReferenceError before scripts load
    const stubs = [
      'refreshData', 'switchTab', 'focusMapOnCategory', 'changeSektorPage',
      'applyFilter', 'resetFilters', 'toggleLayer', 'toggleFaskesLayer',
      'togglePolygonLayer', 'applyCluster6Filter', 'changePolygonLevel',
      'searchPolygon', 'onBantuanFilterChange', 'renderBantuanTable',
      'slideOrangHilang', 'toggleMobileMenu', 'switchTabMobile', 'toggleLayerControl',
      'selectKelembagaan', 'renderKelembagaanTab',
    ];
    stubs.forEach(fn => {
      if (typeof (window as any)[fn] !== 'function') {
        (window as any)[fn] = () => console.log('Dashboard is loading, please wait...');
      }
    });

    if (!dashboardScriptsPromise) {
      dashboardScriptsPromise = loadDashboardScripts().catch((e) => {
        dashboardScriptsPromise = null;
        console.error('Script load error:', e);
        throw e;
      });
    }

    // Auto-switch tab berdasarkan ?tab= dari URL
    const requestedTab = searchParams?.get('tab');
    const validTabsMap: Record<string, string> = {
      'profil': 'dampak',
      'peta': 'peta-operasi',
      'pembangunan': 'pengungsi',
      'danadesa': 'pengungsi',
      'indeks': 'bantuan',
      'kelembagaan': 'kelembagaan'
    };
    if (requestedTab && validTabsMap[requestedTab]) {
      const internalTabId = validTabsMap[requestedTab];
      dashboardScriptsPromise?.then(() => {
        setTimeout(() => {
          const switchTab = (window as any).switchTab;
          if (typeof switchTab === 'function') {
            switchTab(internalTabId);
          }
        }, 300);
      });
    }

    void dashboardScriptsPromise;
  }, [searchParams]);

  return <div dangerouslySetInnerHTML={{ __html: HTML_CONTENT }} />;
}

