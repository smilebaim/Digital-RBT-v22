import { NextResponse } from "next/server";
import { DESA_INFO } from "@/lib/dummy";

// Puskesmas → Fasilitas Kesehatan & Layanan Publik Desa
export async function GET() {
  // Koordinat tetap (tidak acak) untuk fasilitas kesehatan Desa Remau Bako Tuo
  const FASILITAS = [
    { nama: "Polindes Remau Bako Tuo", tipe: "Polindes",       bed: 4,  dokter: 0, kondisi: "normal", lat: -1.21610, lng: 104.34980 },
    { nama: "Posyandu Dusun Bako Tuo", tipe: "Posyandu",       bed: 0,  dokter: 0, kondisi: "normal", lat: -1.22100, lng: 104.35470 },
    { nama: "Posyandu Dusun Remau",    tipe: "Posyandu",       bed: 0,  dokter: 0, kondisi: "normal", lat: -1.21480, lng: 104.34870 },
    { nama: "Puskesmas Maro Sebo Ulu", tipe: "Puskesmas Induk",bed: 20, dokter: 2, kondisi: "normal", lat: -1.21820, lng: 104.35200 },
  ];

  const data = FASILITAS.map((fas, i) => ({
    id:             `FAS-${i + 1}`,
    nama:           fas.nama,
    kabupaten_kota: DESA_INFO.kabupaten,
    kecamatan:      DESA_INFO.kecamatan,
    tipe:           fas.tipe,
    lat:            fas.lat,
    lng:            fas.lng,
    status:         "aktif",
    kapasitas_bed:  fas.bed,
    tenaga_dokter:  fas.dokter,
    kondisi:        fas.kondisi,
  }));

  return NextResponse.json({ data, total: data.length });
}
