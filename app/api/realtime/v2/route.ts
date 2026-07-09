import { NextResponse } from "next/server";
import { DUSUN, DESA_INFO } from "@/lib/dummy";

// v2 → Fasyankes tambahan (Klinik, Apotek, Posyandu) di sekitar desa
// Koordinat tetap, tidak acak
export async function GET() {
  const FASYANKES = [
    { id: "FSY-1", nama: "Klinik Pratama Maro Sebo Ulu",    tipe: "Klinik",   lat: -1.21820, lng: 104.35200, dusun: 0 },
    { id: "FSY-2", nama: "Apotek Remau Farma",              tipe: "Apotek",   lat: -1.21650, lng: 104.35010, dusun: 0 },
    { id: "FSY-3", nama: "Posyandu Melati (Bako Tuo)",      tipe: "Posyandu", lat: -1.22050, lng: 104.35430, dusun: 1 },
    { id: "FSY-4", nama: "Polindes Sungai Duren",           tipe: "Polindes", lat: -1.21300, lng: 104.35820, dusun: 3 },
  ];

  const data = FASYANKES.map((f) => ({
    id:             f.id,
    nama:           f.nama,
    tipe:           f.tipe,
    kabupaten_kota: DESA_INFO.kabupaten,
    kecamatan:      DESA_INFO.kecamatan,
    desa:           DESA_INFO.nama,
    lat:            f.lat,
    lng:            f.lng,
    status:         "aktif",
    kondisi:        "normal",
  }));

  return NextResponse.json({ data, total: data.length });
}
