import { NextResponse } from "next/server";
import { DUSUN, DESA_INFO } from "@/lib/dummy";

// lokasi-tenda → Pos Layanan & Fasilitas Sementara Desa (bukan tenda pengungsian)
// Digunakan untuk menampilkan titik layanan publik sementara di peta
export async function GET() {
  const POS_LAYANAN = [
    {
      id: "TND-1",
      name:          "Pos Pelayanan Terpadu RT 01",
      nama:          "Pos Pelayanan Terpadu RT 01",
      type:          "Pos Layanan",
      tipe:          "Pos Layanan",
      dusunIdx:      0,
      jumlah_tenda:  1,
      kapasitas:     50,
      organisasi:    "Pemerintah Desa",
      keterangan:    "Pos layanan administrasi dan pengaduan warga",
      kondisi:       "baik",
    },
    {
      id: "TND-2",
      name:          "Pos Kesehatan Dusun Bako Tuo",
      nama:          "Pos Kesehatan Dusun Bako Tuo",
      type:          "Pos Kesehatan",
      tipe:          "Pos Kesehatan",
      dusunIdx:      1,
      jumlah_tenda:  1,
      kapasitas:     30,
      organisasi:    "Puskesmas",
      keterangan:    "Pelayanan kesehatan dasar untuk warga Dusun Bako Tuo",
      kondisi:       "baik",
    },
    {
      id: "TND-3",
      name:          "Pos Posyandu Sei Tembesi",
      nama:          "Pos Posyandu Sei Tembesi",
      type:          "Posyandu",
      tipe:          "Posyandu",
      dusunIdx:      2,
      jumlah_tenda:  1,
      kapasitas:     40,
      organisasi:    "Kader Posyandu",
      keterangan:    "Pelayanan ibu dan balita di Dusun Sei Tembesi",
      kondisi:       "baik",
    },
  ];

  const data = POS_LAYANAN.map((pos) => ({
    ...pos,
    regency:        DESA_INFO.kabupaten,
    kabupaten:      DESA_INFO.kabupaten,
    kabupaten_kota: DESA_INFO.kabupaten,
    district:       DESA_INFO.kecamatan,
    kecamatan:      DESA_INFO.kecamatan,
    address:        `${DUSUN[pos.dusunIdx].nama}, Desa ${DESA_INFO.nama}`,
    alamat:         `${DUSUN[pos.dusunIdx].nama}, Desa ${DESA_INFO.nama}`,
    latitude:       DUSUN[pos.dusunIdx].lat,
    longitude:      DUSUN[pos.dusunIdx].lng,
    tentCount:      pos.jumlah_tenda,
    capacity:       pos.kapasitas,
    sumber:         pos.organisasi,
    terisi:         0,
  }));

  return NextResponse.json({ data, total: data.length });
}
