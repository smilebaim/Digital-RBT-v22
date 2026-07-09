import { NextResponse } from "next/server";
import { DUSUN, DESA_INFO } from "@/lib/dummy";

// fasilitas-publik → Fasilitas Publik Desa Remau Bako Tuo
// Koordinat tetap, relevan dengan kondisi desa
export async function GET() {
  const FASILITAS_PUBLIK = [
    // Dusun 0 – Remau Induk
    { dusunIdx: 0, nama: "Kantor Desa Remau Bako Tuo", tipe: "Kantor Desa",    kondisi: "rusak_ringan" },
    { dusunIdx: 0, nama: "Balai Desa Remau Induk",      tipe: "Gedung Desa",   kondisi: "baik"         },
    { dusunIdx: 0, nama: "Masjid Nurul Huda",            tipe: "Mesjid",        kondisi: "baik"         },
    { dusunIdx: 0, nama: "SD Negeri 47 Batanghari",      tipe: "Gedung Sekolah",kondisi: "rusak_ringan" },
    // Dusun 1 – Bako Tuo
    { dusunIdx: 1, nama: "Masjid Al-Ikhlas Bako Tuo",   tipe: "Mesjid",        kondisi: "baik"         },
    { dusunIdx: 1, nama: "Jembatan Dusun Bako Tuo",      tipe: "Jembatan",      kondisi: "rusak_sedang" },
    // Dusun 2 – Sei Tembesi
    { dusunIdx: 2, nama: "Jembatan Sungai Tembesi",      tipe: "Jembatan",      kondisi: "rusak_berat"  },
    { dusunIdx: 2, nama: "Musala Sei Tembesi",            tipe: "Mesjid",        kondisi: "baik"         },
    // Dusun 3 – Sungai Duren
    { dusunIdx: 3, nama: "Jalan Desa Sungai Duren",      tipe: "Jalan",         kondisi: "rusak_sedang" },
    { dusunIdx: 3, nama: "PAUD Tunas Bangsa",             tipe: "Gedung Sekolah",kondisi: "baik"         },
  ];

  const KONDISI_NILAI: Record<string, number> = {
    rusak_berat:  450_000_000,
    rusak_sedang:  95_000_000,
    rusak_ringan:  18_000_000,
    baik:                   0,
  };

  const data = FASILITAS_PUBLIK.map((fas, i) => ({
    id:              `FP-${i + 1}`,
    name:            fas.nama,
    nama:            fas.nama,
    type:            fas.tipe,
    tipe:            fas.tipe,
    regency:         DESA_INFO.kabupaten,
    kabupaten:       DESA_INFO.kabupaten,
    kabupaten_kota:  DESA_INFO.kabupaten,
    district:        DESA_INFO.kecamatan,
    kecamatan:       DESA_INFO.kecamatan,
    desa:            DESA_INFO.nama,
    latitude:        DUSUN[fas.dusunIdx].lat,
    longitude:       DUSUN[fas.dusunIdx].lng,
    condition:       fas.kondisi,
    kondisi:         fas.kondisi,
    nilai_kerusakan: KONDISI_NILAI[fas.kondisi] ?? 0,
  }));

  return NextResponse.json({ data, total: data.length });
}
