import { NextResponse } from "next/server";
import { DESA_INFO } from "@/lib/dummy";

// rsud → Fasilitas Layanan Kesehatan Tingkat Kecamatan/Kabupaten yang melayani desa
export async function GET() {
  // Fasilitas kesehatan rujukan terdekat dari Desa Remau Bako Tuo
  // dengan koordinat tetap (tidak acak)
  const FASKES_RUJUKAN = [
    {
      id: "RSUD-1",
      nama: "RSUD H. Hanafie Muara Bungo",
      tipe: "Tipe B",
      lat: -1.4767,
      lng: 102.1213,
      kapasitas_bed: 186,
      bed_terpakai: 120,
      tenaga_dokter: 28,
    },
    {
      id: "RSUD-2",
      nama: "Puskesmas Maro Sebo Ulu",
      tipe: "Puskesmas Rawat Inap",
      lat: -1.2185,
      lng: 104.3517,
      kapasitas_bed: 20,
      bed_terpakai: 8,
      tenaga_dokter: 2,
    },
    {
      id: "RSUD-3",
      nama: "Rumah Sakit Pratama Muara Tembesi",
      tipe: "Tipe D",
      lat: -1.5678,
      lng: 103.0823,
      kapasitas_bed: 50,
      bed_terpakai: 22,
      tenaga_dokter: 6,
    },
  ];

  const data = FASKES_RUJUKAN.map((f) => ({
    ...f,
    kabupaten_kota: DESA_INFO.kabupaten,
    kecamatan: DESA_INFO.kecamatan,
    status: "aktif",
    kondisi: "normal",
  }));

  return NextResponse.json({ data, total: data.length });
}
