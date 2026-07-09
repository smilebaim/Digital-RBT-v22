import { NextResponse } from "next/server";
import { KABUPATEN, rand } from "@/lib/dummy";
export async function GET() {
  const data = KABUPATEN.flatMap((kab)=>
    Array.from({length:rand(5,15)},(_,j)=>({
      id: `BL-${kab.id}-${j}`,
      desa: `Desa ${j+1} ${kab.nama}`,
      kecamatan: `Kec. ${j+1}`,
      kabupaten_kota: kab.nama,
      satuan: ["Karung Beras","Dus Mie","Dus Air Mineral","Paket Sembako"][j%4],
      jumlah: rand(10,200),
      status: ["kuning","biru","biru_keabuan","putih"][j%4],
      lat: kab.lat+(Math.random()-0.5)*0.3,
      lng: kab.lng+(Math.random()-0.5)*0.3,
      tanggal: `2026-04-${String(rand(20,30)).padStart(2,"0")}`,
    }))
  );
  const summary = {
    total: data.length,
    kuning: data.filter(d=>d.status==="kuning").length,
    biru: data.filter(d=>d.status==="biru").length,
    abu: data.filter(d=>d.status==="biru_keabuan").length,
    putih: data.filter(d=>d.status==="putih").length,
  };
  return NextResponse.json({ data, summary, total: data.length });
}
