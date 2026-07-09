import { NextResponse } from "next/server";
import { KABUPATEN, rand } from "@/lib/dummy";

const KECAMATAN_NAMES: Record<string, string[]> = {
  "Aceh Barat": ["Johan Pahlawan", "Samatiga", "Bubon", "Arongan Lambalek", "Woyla", "Woyla Barat", "Woyla Timur", "Kaway XVI", "Meureubo", "Pante Ceureumen"],
  "Aceh Besar": ["Lhoknga", "Leupung", "Indrapuri", "Kuta Malaka", "Simpang Tiga", "Darul Imarah", "Ingin Jaya", "Krueng Barona Jaya", "Sukamakmur"],
  "Aceh Selatan": ["Tapaktuan", "Samadua", "Sawang", "Labuhanhaji", "Meukek", "Kluet Utara", "Kluet Selatan", "Pasie Raja"],
  "Aceh Timur": ["Idi Rayeuk", "Darul Aman", "Peureulak", "Rantau Peureulak", "Nurussalam", "Birem Bayeun", "Serbajadi", "Peunaron"],
  "Aceh Utara": ["Lhoksukon", "Muara Batu", "Dewantara", "Sawang", "Nisam", "Banda Baro", "Kuta Makmur", "Simpang Kramat"],
  "Pidie": ["Sigli", "Kota Sigli", "Indra Makmu", "Muara Tiga", "Mila", "Padang Tiji", "Kembang Tanjong", "Delima"],
  "Bireuen": ["Kota Juang", "Peudada", "Jeunieb", "Kuala", "Gandapura", "Simpang Mamplam", "Juli", "Peusangan"],
  "Aceh Tengah": ["Bebesen", "Ketol", "Silih Nara", "Bintang", "Lut Tawar", "Kebayakan", "Pegasing", "Bies"],
  "Aceh Tenggara": ["Kutacane", "Lawe Alas", "Lawe Sigala-gala", "Bambel", "Badar", "Babussalam", "Darul Hasanah", "Semadam"],
  "Aceh Singkil": ["Singkil", "Simpang Kanan", "Gunung Meriah", "Danau Paris", "Suro", "Pulau Banyak"],
  "Simeulue": ["Simeulue Timur", "Simeulue Tengah", "Simeulue Barat", "Alafan", "Teupah Barat", "Teluk Dalam"],
  "Nagan Raya": ["Seunagan", "Seunagan Timur", "Beutong", "Beutong Ateuh", "Darul Makmur", "Kuala"],
  "Aceh Jaya": ["Calang", "Krueng Sabee", "Setia Bakti", "Sampoiniet", "Jaya", "Indra Jaya", "Teunom"],
  "Aceh Barat Daya": ["Blangpidie", "Susoh", "Manggeng", "Tangan-Tangan", "Setia", "Kuala Batee", "Jeumpa"],
  "Gayo Lues": ["Blangkejeren", "Rikit Gaib", "Pining", "Blang Pegayon", "Pantan Cuaca", "Kutapanjang"],
  "Aceh Tamiang": ["Kota Kuala Simpang", "Seruway", "Bendahara", "Banda Mulia", "Sekerak", "Karang Baru", "Tamiang Hulu"],
  "Bener Meriah": ["Bukit", "Bebesen", "Permata", "Bandar", "Syiah Utama", "Pintu Rime Gayo", "Mesidah"],
  "Pidie Jaya": ["Meureudu", "Bandar Baru", "Ulim", "Jangka Buya", "Trienggadeng", "Pante Raja"],
  "Kota Banda Aceh": ["Meuraxa", "Jaya Baru", "Banda Raya", "Baiturrahman", "Lueng Bata", "Kuta Alam", "Kuta Raja", "Syiah Kuala", "Ulee Kareng"],
  "Kota Sabang": ["Sukajaya", "Sukakarya"],
  "Kota Langsa": ["Langsa Kota", "Langsa Lama", "Langsa Baro", "Langsa Timur", "Langsa Barat"],
  "Kota Lhokseumawe": ["Banda Sakti", "Blang Mangat", "Muara Dua", "Muara Satu"],
  "Kota Subulussalam": ["Simpang Kiri", "Penanggalan", "Rundeng", "Sultan Daulat", "Longkib"],
};

export async function GET() {
  const summaryByKabupaten = KABUPATEN.map((kab) => {
    const kecamatanList = KECAMATAN_NAMES[kab.nama] || ["Kecamatan 1", "Kecamatan 2"];
    const numKec = kecamatanList.length;
    const terdampak_jiwa = rand(500, 15000);
    const pengungsi_jiwa = Math.floor(terdampak_jiwa * (rand(10, 40) / 100));

    return {
      kabupaten: kab.nama,
      jumlah_kecamatan: numKec,
      jumlah_desa: numKec * rand(3, 6),
      terdampak_kk: Math.floor(terdampak_jiwa / rand(3, 5)),
      terdampak_jiwa,
      pengungsi_kk: Math.floor(pengungsi_jiwa / rand(3, 5)),
      pengungsi_jiwa,
      korban_hilang: rand(0, 5),
      korban_meninggal: rand(0, 4),
      rumah_rusak_total: rand(50, 500),
    };
  });

  const totals = summaryByKabupaten.reduce(
    (acc, kab) => ({
      kabupaten_terdampak: acc.kabupaten_terdampak + 1,
      terdampak_kk: acc.terdampak_kk + kab.terdampak_kk,
      terdampak_jiwa: acc.terdampak_jiwa + kab.terdampak_jiwa,
      pengungsi_kk: acc.pengungsi_kk + kab.pengungsi_kk,
      pengungsi_jiwa: acc.pengungsi_jiwa + kab.pengungsi_jiwa,
      korban_hilang: acc.korban_hilang + kab.korban_hilang,
      korban_meninggal: acc.korban_meninggal + kab.korban_meninggal,
    }),
    { kabupaten_terdampak: 0, terdampak_kk: 0, terdampak_jiwa: 0, pengungsi_kk: 0, pengungsi_jiwa: 0, korban_hilang: 0, korban_meninggal: 0 }
  );

  return NextResponse.json({
    success: true,
    source: "dummy",
    totals,
    data: summaryByKabupaten,
  });
}
