import { NextResponse } from "next/server";
import { DUSUN, DESA_INFO, pick, STATUS_JARINGAN } from "@/lib/dummy";

// Jaringan → Infrastruktur Desa (jalan, listrik, air, telekomunikasi)
export async function GET() {
  const INFRASTRUKTUR = [
    { nama: "Jaringan Listrik PLN",          tipe: "Listrik",       operator: "PLN",        status: "normal"   },
    { nama: "PDAM Cabang Maro Sebo Ulu",     tipe: "Air Bersih",    operator: "PDAM",       status: "warning"  },
    { nama: "BTS Telkomsel Remau Bako Tuo",  tipe: "Telekomunikasi",operator: "Telkomsel",  status: "normal"   },
    { nama: "Jalan Provinsi Akses Desa",     tipe: "Jalan",         operator: "Dinas PU",   status: "normal"   },
    { nama: "Jembatan Sungai Tembesi",       tipe: "Jembatan",      operator: "Dinas PU",   status: "critical" },
    { nama: "Drainase Dusun Remau Induk",    tipe: "Sanitasi",      operator: "Desa",       status: "warning"  },
    { nama: "Jaringan Internet Fiber",       tipe: "Telekomunikasi",operator: "Telkom",     status: "normal"   },
    { nama: "Irigasi Sawah Desa",            tipe: "Pertanian",     operator: "Dinas Pert.",status: "normal"   },
  ];

  const data = INFRASTRUKTUR.map((infra, i) => ({
    id:             `INF-${i + 1}`,
    nama:           infra.nama,
    kabupaten_kota: DESA_INFO.kabupaten,
    status:         infra.status,
    lat:            DUSUN[i % DUSUN.length].lat,
    lng:            DUSUN[i % DUSUN.length].lng,
    operator:       infra.operator,
    tipe:           infra.tipe,
    signal_strength: infra.status === "normal" ? 90 : infra.status === "warning" ? 65 : 30,
    uptime_pct:     infra.status === "normal" ? 98 : infra.status === "warning" ? 75 : 40,
    updated_at:     new Date().toISOString(),
  }));

  const critical = data.filter(d => d.status === "critical").length;
  const warning  = data.filter(d => d.status === "warning").length;
  const normal   = data.filter(d => d.status === "normal").length;

  return NextResponse.json({
    data,
    summary: { critical, warning, normal, total: data.length },
    updated_at: new Date().toISOString(),
  });
}
