// lib/dummy.ts - Data dummy untuk Desa Remau Bako Tuo, Kec. Maro Sebo Ulu, Kab. Batanghari, Jambi

// Dusun-dusun dalam Desa Remau Bako Tuo
export const DUSUN = [
  { id: "1501", nama: "Dusun Remau Induk",  lat: -1.215862, lng: 104.349622 },
  { id: "1502", nama: "Dusun Bako Tuo",     lat: -1.220862, lng: 104.354622 },
  { id: "1503", nama: "Dusun Sei Tembesi",  lat: -1.224862, lng: 104.347622 },
  { id: "1504", nama: "Dusun Sungai Duren", lat: -1.212862, lng: 104.358622 },
];

// Backward compat – semua route lama masih pakai KABUPATEN
export const KABUPATEN = DUSUN;

// ── Profil Desa ──────────────────────────────────────────────────────────────
export const DESA_INFO = {
  nama:           "Remau Bako Tuo",
  kecamatan:      "Maro Sebo Ulu",
  kabupaten:      "Batanghari",
  provinsi:       "Jambi",
  kode_desa:      "1504030010",
  tahun_berdiri:  1956,
  luas_wilayah_ha: 2450,
  lat:  -1.2182621315578288,
  lng:  104.35172172755148,
};

export const PENDUDUK_DESA = {
  total:         1243,
  laki_laki:      628,
  perempuan:      615,
  total_kk:       347,
  total_rt:        18,
  total_rw:         4,
  jumlah_dusun:     4,
};

// ── APBDes 2024 ───────────────────────────────────────────────────────────────
export const APBDES = {
  tahun:            2024,
  dana_desa:        912_500_000,
  add:              467_000_000,   // Alokasi Dana Desa
  pad:               52_750_000,   // Pendapatan Asli Desa
  bagi_hasil:        18_500_000,
  bantuan_keuangan: 150_000_000,
  total:          1_600_750_000,
};

export const BIDANG_APBDES = [
  { nama: "Penyelenggaraan Pemerintahan Desa", pagu: 380_000_000, realisasi: 365_400_000 },
  { nama: "Pembangunan Desa",                  pagu: 680_000_000, realisasi: 645_200_000 },
  { nama: "Pembinaan Kemasyarakatan",          pagu: 180_000_000, realisasi: 168_500_000 },
  { nama: "Pemberdayaan Masyarakat",           pagu: 280_000_000, realisasi: 260_750_000 },
  { nama: "Penanggulangan Bencana & Darurat",  pagu:  80_750_000, realisasi:  75_000_000 },
];

// ── IDM (Indeks Desa Membangun) ───────────────────────────────────────────────
export const IDM_DATA = {
  tahun:             2024,
  skor:              0.7264,
  status:            "Berkembang",
  dimensi_sosial:    0.7820,
  dimensi_ekonomi:   0.6543,
  dimensi_lingkungan: 0.7430,
  target_status:     "Maju",
  skor_minimal_maju: 0.8140,
};

export const IDM_HISTORI = [
  { tahun: 2020, skor: 0.6312, status: "Berkembang" },
  { tahun: 2021, skor: 0.6589, status: "Berkembang" },
  { tahun: 2022, skor: 0.6941, status: "Berkembang" },
  { tahun: 2023, skor: 0.7102, status: "Berkembang" },
  { tahun: 2024, skor: 0.7264, status: "Berkembang" },
];

export const IDM_INDIKATOR = {
  sosial: [
    { nama: "Akses Kesehatan",    skor: 0.80, status: "Baik" },
    { nama: "Akses Pendidikan",   skor: 0.78, status: "Baik" },
    { nama: "Modal Sosial",       skor: 0.77, status: "Baik" },
    { nama: "Permukiman",         skor: 0.76, status: "Baik" },
  ],
  ekonomi: [
    { nama: "Keragaman Produksi Masyarakat",  skor: 0.65, status: "Sedang" },
    { nama: "Akses Pusat Perdagangan",        skor: 0.62, status: "Sedang" },
    { nama: "Lembaga Ekonomi",                skor: 0.70, status: "Sedang" },
    { nama: "Akses Permodalan",               skor: 0.63, status: "Sedang" },
  ],
  lingkungan: [
    { nama: "Kualitas Lingkungan",     skor: 0.74, status: "Baik" },
    { nama: "Potensi Bencana",         skor: 0.75, status: "Baik" },
    { nama: "Tanggap Bencana",         skor: 0.74, status: "Baik" },
  ],
};

// ── Konteks umum ──────────────────────────────────────────────────────────────
export const SEKTOR = [
  "Pemerintahan", "Pembangunan", "Pembinaan", "Pemberdayaan",
  "Lingkungan", "Kesehatan", "Pendidikan", "Ekonomi",
];
export const STATUS_JARINGAN = ["critical", "warning", "normal"];
export const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
export const pick = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
