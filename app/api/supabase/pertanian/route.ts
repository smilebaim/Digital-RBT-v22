import { NextResponse } from "next/server";
import { DUSUN, BIDANG_APBDES, DESA_INFO } from "@/lib/dummy";

// Pertanian → Program Pembangunan per Dusun (dipakai tabel bawah tab Profil)
export async function GET() {
  const PROGRAM_PER_DUSUN = [
    { nama: "Jalan Rabat Beton Dusun Remau Induk",  jenis: "Infrastruktur",    vol: 450,  satuan: "m",  kerugian: 270_000_000, berat: 0, sedang: 0, ringan: 0 },
    { nama: "Drainase Dusun Remau Induk",            jenis: "Infrastruktur",    vol: 200,  satuan: "m",  kerugian: 85_000_000,  berat: 0, sedang: 1, ringan: 0 },
    { nama: "Posyandu Dusun Bako Tuo",               jenis: "Kesehatan",        vol: 1,    satuan: "Unit",kerugian: 150_000_000, berat: 0, sedang: 0, ringan: 0 },
    { nama: "Sumur Bor Dusun Bako Tuo",              jenis: "Air Bersih",       vol: 2,    satuan: "Unit",kerugian: 60_000_000,  berat: 0, sedang: 0, ringan: 1 },
    { nama: "Jembatan Kayu Sei Tembesi",             jenis: "Infrastruktur",    vol: 1,    satuan: "Unit",kerugian: 45_000_000,  berat: 1, sedang: 0, ringan: 0 },
    { nama: "Peningkatan Jalan Sei Tembesi",         jenis: "Infrastruktur",    vol: 320,  satuan: "m",  kerugian: 190_000_000, berat: 0, sedang: 0, ringan: 1 },
    { nama: "Lampu Jalan Sungai Duren",              jenis: "Penerangan",       vol: 12,   satuan: "Unit",kerugian: 24_000_000,  berat: 0, sedang: 0, ringan: 0 },
    { nama: "MCK Komunal Sungai Duren",              jenis: "Sanitasi",         vol: 1,    satuan: "Unit",kerugian: 80_000_000,  berat: 0, sedang: 1, ringan: 0 },
    { nama: "Gedung PAUD Tunas Bangsa",              jenis: "Pendidikan",       vol: 1,    satuan: "Unit",kerugian: 200_000_000, berat: 0, sedang: 0, ringan: 0 },
    { nama: "Embung Desa Remau Bako Tuo",            jenis: "Pertanian",        vol: 1,    satuan: "Unit",kerugian: 350_000_000, berat: 0, sedang: 0, ringan: 0 },
  ];

  const data = PROGRAM_PER_DUSUN.map((prog, i) => ({
    id:             `PRG-${i + 1}`,
    nama:           prog.nama,
    kabkota:        DESA_INFO.kabupaten,
    kecamatan:      DESA_INFO.kecamatan,
    desa:           DESA_INFO.nama,
    jenis:          prog.jenis,
    volume:         prog.vol,
    satuan:         prog.satuan,
    taksir_kerugian: prog.kerugian,
    kerusakan_berat:  prog.berat,
    kerusakan_sedang: prog.sedang,
    kerusakan_ringan: prog.ringan,
    lat:            DUSUN[i % DUSUN.length].lat,
    lng:            DUSUN[i % DUSUN.length].lng,
  }));

  const summary = {
    total:        data.length,
    total_volume: data.reduce((a, b) => a + b.volume, 0),
    total_anggaran: data.reduce((a, b) => a + b.taksir_kerugian, 0),
  };

  return NextResponse.json({ data, summary, total: data.length });
}
