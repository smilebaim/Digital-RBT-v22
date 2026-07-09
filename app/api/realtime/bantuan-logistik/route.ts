import { NextResponse } from "next/server";
import { DUSUN, IDM_DATA, IDM_INDIKATOR, DESA_INFO } from "@/lib/dummy";

// bantuan-logistik → Indikator IDM + summary untuk KPI tab Indeks
export async function GET() {
  const indikatorList = [
    { nama: "Indikator Sosial – Kesehatan",    kode: "S1", skor: 0.80, status: "kuning"      },
    { nama: "Indikator Sosial – Pendidikan",   kode: "S2", skor: 0.78, status: "kuning"      },
    { nama: "Indikator Sosial – Modal Sosial", kode: "S3", skor: 0.77, status: "kuning"      },
    { nama: "Indikator Sosial – Permukiman",   kode: "S4", skor: 0.76, status: "kuning"      },
    { nama: "Indikator Ekonomi – Produksi",    kode: "E1", skor: 0.65, status: "biru"        },
    { nama: "Indikator Ekonomi – Perdagangan", kode: "E2", skor: 0.62, status: "biru"        },
    { nama: "Indikator Ekonomi – Lembaga",     kode: "E3", skor: 0.70, status: "biru"        },
    { nama: "Indikator Ekonomi – Permodalan",  kode: "E4", skor: 0.63, status: "biru"        },
    { nama: "Indikator Lingkungan – Ekologi",  kode: "L1", skor: 0.74, status: "kuning"      },
    { nama: "Indikator Lingkungan – Bencana",  kode: "L2", skor: 0.75, status: "kuning"      },
    { nama: "Indikator Lingkungan – Tanggap",  kode: "L3", skor: 0.74, status: "kuning"      },
  ];

  const data = indikatorList.map((ind, i) => ({
    id:             `BAN-${i + 1}`,
    desa:           DESA_INFO.nama,
    kecamatan:      DESA_INFO.kecamatan,
    kabupaten_kota: DESA_INFO.kabupaten,
    satuan:         "Skor",
    volume:         Math.round(ind.skor * 100),
    status:         ind.status,
    nama_indikator: ind.nama,
    kode:           ind.kode,
    skor:           ind.skor,
    lat:            DUSUN[i % DUSUN.length].lat,
    lng:            DUSUN[i % DUSUN.length].lng,
  }));

  // Hitung summary per status — dipakai oleh updateBantuanKPIs() di JS
  const total_kuning       = data.filter(d => d.status === "kuning").length;
  const total_biru         = data.filter(d => d.status === "biru").length;
  const total_biru_keabuan = data.filter(d => d.status === "biru_keabuan").length;
  const total_putih        = data.filter(d => d.status === "putih").length;

  return NextResponse.json({
    data,
    total: data.length,
    // Field yang dipakai JS langsung (via state.data.banlog.xxx)
    total_desa:          1,                     // 1 desa = Remau Bako Tuo
    total_kuning,                               // Indikator "Maju" (skor ≥ 0.80)
    total_biru,                                 // Indikator "Berkembang"
    total_biru_keabuan,                         // Indikator "Tertinggal"
    total_putih,                                // Indikator "Sangat Tertinggal"
    skor_idm:            IDM_DATA.skor,
    status_idm:          IDM_DATA.status,
    updated_at:          new Date().toISOString(),
  });
}
