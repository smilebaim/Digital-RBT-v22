import { NextResponse } from "next/server";
import { DUSUN, DESA_INFO, PENDUDUK_DESA } from "@/lib/dummy";

export async function GET() {
  // Data per dusun (menggantikan data per kejadian bencana)
  const pendudukPerDusun = [628, 340, 158, 117];
  const kkPerDusun       = [110,  94,  78,  65];
  const luasPerDusun     = [850, 620, 540, 440];

  const data = DUSUN.map((dusun, i) => {
    const penduduk = pendudukPerDusun[i] ?? 120;
    const kk       = kkPerDusun[i]       ?? 35;
    const luas     = luasPerDusun[i]     ?? 300;
    return {
      id: `DSN-${dusun.id}`,
      kabupaten_kota: DESA_INFO.kabupaten,
      kabkota:        DESA_INFO.kabupaten,
      kecamatan:      DESA_INFO.kecamatan,
      desa:           DESA_INFO.nama,
      nama_dusun:     dusun.nama,
      // Field lama dipertahankan agar JS tidak error
      jenis_bencana:  "Profil Desa",
      status:         ["normal","normal","warning","normal"][i] ?? "normal",
      lat:            dusun.lat,
      lng:            dusun.lng,
      // Profil
      jumlah_penduduk: penduduk,
      jumlah_kk:       kk,
      luas_ha:         luas,
      // Field bencana diisi 0 agar kalkulasi JS tidak crash
      korban_meninggal:    0,
      korban_luka:         0,
      korban_hilang:       0,
      pengungsi:           kk,        // dipakai JS → kita isi dengan jumlah KK dusun
      rumah_rusak_berat:   0,
      rumah_rusak_sedang:  0,
      rumah_rusak_ringan:  0,
      sawah_ha:            parseFloat(luas.toFixed(1)),
      kebun_ha:            0,
      tambak_ha:           0,
      fasum_rusak:         0,
      tanggal:             "2024-01-01",
      updated_at:          new Date().toISOString(),
    };
  });

  const enriched = data.map((d) => ({
    ...d,
    jiwa_terdampak: d.jumlah_penduduk,
    rumah: d.jumlah_kk,
  }));

  return NextResponse.json({
    data: enriched,
    total: enriched.length,
    updated_at: new Date().toISOString(),
    // KPI mapping untuk dashboard
    total_jiwa:              PENDUDUK_DESA.total,          // Jumlah Penduduk
    total_pengungsi:         PENDUDUK_DESA.total_kk,       // Jumlah KK
    total_titik_pengungsian: PENDUDUK_DESA.jumlah_dusun,   // Jumlah Dusun
    total_rumah:             PENDUDUK_DESA.total_rt + PENDUDUK_DESA.total_rw, // RT+RW
    total_sawah:             DESA_INFO.luas_wilayah_ha,     // Luas Wilayah (Ha)
    total_fasum:             DESA_INFO.tahun_berdiri,       // Tahun Berdiri (dipakai di stat-fasum)
    total_kebun:             PENDUDUK_DESA.laki_laki,
    total_tambak:            PENDUDUK_DESA.perempuan,
    // Untuk kpi-kabupaten (distinct kabupaten)
    kabupaten_terdampak: 1,
  });
}
