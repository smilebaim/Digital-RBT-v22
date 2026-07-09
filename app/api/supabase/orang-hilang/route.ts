import { NextResponse } from "next/server";
import { DESA_INFO } from "@/lib/dummy";

// orang-hilang → Program Unggulan Desa (dipakai di slider "Program Unggulan" Tab Pembangunan)
export async function GET() {
  const PROGRAM_UNGGULAN = [
    {
      nama: "BUMDes Remau Maju",
      keterangan: "Pengembangan usaha simpan-pinjam dan kios desa untuk mendorong perekonomian warga",
      status: "berjalan",
      bidang: "Ekonomi",
      anggaran: 75_000_000,
      realisasi: 68_500_000,
    },
    {
      nama: "Posyandu Aktif 4 Dusun",
      keterangan: "Layanan kesehatan ibu dan balita setiap bulan di seluruh dusun",
      status: "berjalan",
      bidang: "Kesehatan",
      anggaran: 24_000_000,
      realisasi: 20_000_000,
    },
    {
      nama: "Pembangunan Jalan Rabat Beton",
      keterangan: "Pengerasan jalan dusun sepanjang 1.200 meter untuk akses warga",
      status: "selesai",
      bidang: "Infrastruktur",
      anggaran: 280_000_000,
      realisasi: 278_500_000,
    },
    {
      nama: "Digitalisasi Administrasi Desa",
      keterangan: "Penggunaan sistem informasi desa untuk pelayanan administrasi warga secara online",
      status: "berjalan",
      bidang: "Pemerintahan",
      anggaran: 35_000_000,
      realisasi: 22_000_000,
    },
    {
      nama: "Kelompok Tani Organik",
      keterangan: "Pembinaan pertanian organik untuk meningkatkan nilai jual hasil tani warga",
      status: "berjalan",
      bidang: "Pertanian",
      anggaran: 42_000_000,
      realisasi: 38_000_000,
    },
  ];

  const data = PROGRAM_UNGGULAN.map((prog, i) => ({
    id:                   `PRG-${i + 1}`,
    // Field lama (masih dipakai JS slider)
    missingPersonName:    prog.nama,
    missingPersonStatus:  prog.status === "selesai" ? "Found" : "Missing",
    missingPersonAge:     null,
    missingPersonGender:  null,
    missingPersonPhotosUrl: [],
    reporterPhone:        "-",
    district:             prog.bidang,
    regency:              DESA_INFO.kabupaten,
    // Field baru (lebih deskriptif)
    nama:                 prog.nama,
    keterangan:           prog.keterangan,
    status:               prog.status,
    bidang:               prog.bidang,
    anggaran:             prog.anggaran,
    realisasi:            prog.realisasi,
    kabupaten_kota:       DESA_INFO.kabupaten,
    kecamatan:            DESA_INFO.kecamatan,
    desa:                 DESA_INFO.nama,
  }));

  const summary = {
    total:     data.length,
    ongoing:   data.filter((d) => d.status === "berjalan").length,
    found:     data.filter((d) => d.status === "selesai").length,
    dicari:    data.filter((d) => d.status === "berjalan").length,
    ditemukan: data.filter((d) => d.status === "selesai").length,
  };

  return NextResponse.json({ data, summary, total: data.length });
}
