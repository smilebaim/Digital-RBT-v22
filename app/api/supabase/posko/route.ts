import { NextResponse } from "next/server";
import { DUSUN, DESA_INFO, IDM_HISTORI, IDM_DATA } from "@/lib/dummy";

// Posko → Titik Penting Desa (kantor desa, balai, polindes, masjid, dll.)
export async function GET() {
  const TITIK_PENTING = [
    { nama: "Kantor Desa Remau Bako Tuo", type: "Kantor Desa", dusun: DUSUN[0], capacity: 100 },
    { nama: "Balai Desa",                  type: "Balai Desa",  dusun: DUSUN[0], capacity: 200 },
    { nama: "Polindes Remau Induk",         type: "Polindes",   dusun: DUSUN[0], capacity: 30  },
    { nama: "Masjid Al-Ikhlas",             type: "Masjid",     dusun: DUSUN[1], capacity: 300 },
    { nama: "SD Negeri 47 Batanghari",      type: "Sekolah",    dusun: DUSUN[1], capacity: 250 },
    { nama: "Posyandu Bako Tuo",            type: "Posyandu",   dusun: DUSUN[1], capacity: 50  },
    { nama: "Musala Sei Tembesi",           type: "Musala",     dusun: DUSUN[2], capacity: 100 },
    { nama: "PAUD Tunas Bangsa",            type: "PAUD",       dusun: DUSUN[2], capacity: 60  },
    { nama: "BUMDes Maju Bersama",          type: "BUMDes",     dusun: DUSUN[3], capacity: 50  },
    { nama: "Poskamling Sungai Duren",      type: "Poskamling", dusun: DUSUN[3], capacity: 20  },
  ];

  const data = TITIK_PENTING.map((titik, i) => ({
    id:               `TTP-${i + 1}`,
    name:             titik.nama,
    nama:             titik.nama,
    type:             titik.type,
    organizationName: "Pemerintah Desa",
    regency:          DESA_INFO.kabupaten,
    kabupaten_kota:   DESA_INFO.kabupaten,
    district:         DESA_INFO.kecamatan,
    kecamatan:        DESA_INFO.kecamatan,
    address:          `${titik.dusun.nama}, Desa Remau Bako Tuo`,
    alamat:           `${titik.dusun.nama}, Desa Remau Bako Tuo`,
    latitude:         titik.dusun.lat,
    longitude:        titik.dusun.lng,
    maleRefugee:      0,
    femaleRefugee:    0,
    childRefugee:     0,
    total_pengungsi:  0,
    jumlah_pengungsi: 0,
    jumlah_kk:        0,
    capacity:         titik.capacity,
    kapasitas:        titik.capacity,
    status:           "aktif",
    titik_pengungsian: 1,
    accessWater:       true,
    accessSanitation:  true,
    accessElectricity: true,
  }));

  const summary = {
    total:            data.length,
    total_posko:      data.length,
    total_pengungsi:  0,
    titik_pengungsian: data.length,
  };

  return NextResponse.json({ data, summary, total: data.length });
}
