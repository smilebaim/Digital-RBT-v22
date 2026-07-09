import { NextResponse } from "next/server";
import { DUSUN, APBDES, BIDANG_APBDES, DESA_INFO } from "@/lib/dummy";

export async function GET() {
  // "penduduk" → dipakai tab Pembangunan sebagai data wilayah/anggaran
  const penduduk = DUSUN.map((dusun, i) => ({
    kode:    dusun.id,
    wilayah: dusun.nama,
    nama:    dusun.nama,
    level:   4, // level dusun
    jumlah:  [628, 340, 158, 117][i] ?? 100,
    lat:     dusun.lat,
    lng:     dusun.lng,
  }));

  // "penduduk_kk" → pagu per bidang APBDes
  const penduduk_kk = BIDANG_APBDES.map((bidang, i) => ({
    kode:    `BDG-${i + 1}`,
    wilayah: bidang.nama,
    nama:    bidang.nama,
    level:   1,
    jumlah:  bidang.pagu,
  }));

  // "penduduk_disabilitas" → rincian sumber dana
  const penduduk_disabilitas = [
    {
      kode:   "SDD",
      wilayah: "Dana Desa (DD)",
      DISABILITAS_FISIK_JML:          APBDES.dana_desa,
      DISABILITAS_NETRA_BUTA_JML:     0,
      DISABILITAS_RUNGU_WICARA_JML:   0,
      DISABILITAS_MENTAL_JIWA_JML:    0,
      DISABILITAS_FISIK_DAN_MENTAL_JML: 0,
      DISABILITAS_LAINNYA_JML:        0,
    },
    {
      kode:   "SADD",
      wilayah: "ADD",
      DISABILITAS_FISIK_JML:          APBDES.add,
      DISABILITAS_NETRA_BUTA_JML:     0,
      DISABILITAS_RUNGU_WICARA_JML:   0,
      DISABILITAS_MENTAL_JIWA_JML:    0,
      DISABILITAS_FISIK_DAN_MENTAL_JML: 0,
      DISABILITAS_LAINNYA_JML:        0,
    },
    {
      kode:   "SPAD",
      wilayah: "PAD",
      DISABILITAS_FISIK_JML:          APBDES.pad,
      DISABILITAS_NETRA_BUTA_JML:     0,
      DISABILITAS_RUNGU_WICARA_JML:   0,
      DISABILITAS_MENTAL_JIWA_JML:    0,
      DISABILITAS_FISIK_DAN_MENTAL_JML: 0,
      DISABILITAS_LAINNYA_JML:        0,
    },
  ];

  // "penduduk_umur" → realisasi per bidang
  const penduduk_umur = BIDANG_APBDES.map((bidang, i) => ({
    kode:          `BDG-${i + 1}`,
    wilayah:       bidang.nama,
    usia_0_4:      bidang.pagu,
    usia_5_9:      bidang.realisasi,
    usia_10_14:    Math.round((bidang.realisasi / bidang.pagu) * 100),
    usia_15_19:    bidang.pagu - bidang.realisasi,
    usia_20_24:    0,
    usia_above_25: 0,
  }));

  const summary = {
    total_penduduk:    APBDES.total,          // Total APBDes
    total_kk:          APBDES.dana_desa,       // Dana Desa
    total_disabilitas: APBDES.add,             // ADD
    total_pad:         APBDES.pad,
    tahun:             APBDES.tahun,
    desa:              DESA_INFO.nama,
    kecamatan:         DESA_INFO.kecamatan,
    kabupaten:         DESA_INFO.kabupaten,
  };

  return NextResponse.json({
    penduduk,
    penduduk_kk,
    penduduk_disabilitas,
    penduduk_umur,
    summary,
  });
}
