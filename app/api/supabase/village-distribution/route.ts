import { NextResponse } from "next/server";
import { DUSUN, IDM_DATA, DESA_INFO } from "@/lib/dummy";

// village-distribution → Distribusi IDM per dimensi (dipakai kpi-desa, kpi-kuning, dst di tab Indeks)
export async function GET() {
  // Satu "desa" = Desa Remau Bako Tuo dengan skor IDM per dimensi
  const data = [
    {
      kabupaten_kota: DESA_INFO.kabupaten,
      total_desa:     1,
      desa_kuning:    0,          // Maju
      desa_biru:      1,          // Berkembang ← status sekarang
      desa_abu:       0,          // Tertinggal
      desa_putih:     0,          // Sangat Tertinggal
      lat:            DESA_INFO.lat,
      lng:            DESA_INFO.lng,
      skor_idm:       IDM_DATA.skor,
      status_idm:     IDM_DATA.status,
      nama_desa:      DESA_INFO.nama,
    },
  ];

  return NextResponse.json({ data, total: data.length });
}
