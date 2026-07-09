import { NextResponse } from "next/server";
import { KABUPATEN, rand } from "@/lib/dummy";

export async function GET() {
  const affected = KABUPATEN.filter((_, i) => i < 12);
  const data = affected.flatMap(kab => {
    const count = rand(1, 4);
    return Array.from({ length: count }, (_, j) => ({
      id: `BNC-${kab.id}-${j + 1}`,
      kabupaten_kota: kab.nama,
      kabkota: kab.nama,
      kecamatan: `Kec. ${["Mutiara","Johan Pahlawan","Bebesen","Kuta Makmur","Peusangan"][j % 5]}`,
      desa: `Desa ${["Paya","Blang","Meureudu","Langkak","Pasie"][j % 5]} ${j + 1}`,
      jenis_bencana: "Banjir",
      status: ["critical","warning","normal"][j % 3],
      lat: kab.lat + (Math.random() - 0.5) * 0.3,
      lng: kab.lng + (Math.random() - 0.5) * 0.3,
      korban_meninggal: rand(0, 5),
      korban_luka: rand(0, 20),
      korban_hilang: rand(0, 3),
      pengungsi: rand(50, 800),
      rumah_rusak_berat: rand(0, 50),
      rumah_rusak_sedang: rand(0, 80),
      rumah_rusak_ringan: rand(0, 120),
      sawah_ha: parseFloat((Math.random() * 50).toFixed(1)),
      kebun_ha: parseFloat((Math.random() * 30).toFixed(1)),
      tambak_ha: parseFloat((Math.random() * 20).toFixed(1)),
      fasum_rusak: rand(0, 10),
      tanggal: "2026-04-28",
      updated_at: new Date().toISOString(),
    }));
  });
  const total_jiwa = data.reduce((a, b) => a + b.korban_meninggal + b.korban_luka + b.korban_hilang, 0);
  const total_pengungsi = data.reduce((a, b) => a + b.pengungsi, 0);
  const total_titik_pengungsian = data.length; // Assume each record is a point
  const total_rumah = data.reduce((a, b) => a + b.rumah_rusak_berat + b.rumah_rusak_sedang + b.rumah_rusak_ringan, 0);
  const total_sawah = data.reduce((a, b) => a + b.sawah_ha, 0);
  const total_fasum = data.reduce((a, b) => a + b.fasum_rusak, 0);
  const total_kebun = data.reduce((a, b) => a + b.kebun_ha, 0);
  const total_tambak = data.reduce((a, b) => a + b.tambak_ha, 0);

  return NextResponse.json({ 
    data, 
    total: data.length, 
    total_jiwa,
    total_pengungsi,
    total_titik_pengungsian,
    total_rumah,
    total_sawah,
    total_fasum,
    total_kebun,
    total_tambak,
    updated_at: new Date().toISOString() 
  });
}
