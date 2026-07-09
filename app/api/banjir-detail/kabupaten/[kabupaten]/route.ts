import { NextRequest, NextResponse } from "next/server";
import { rand } from "@/lib/dummy";

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

const DESA_NAMES = ["Gampong Baru", "Gampong Lama", "Cot Seunong", "Alue Papeun", "Blang Dalam", "Paya Besar"];

function generateKabupatenData(kabupaten: string) {
  const kecamatanList = KECAMATAN_NAMES[kabupaten] ?? ["Kecamatan 1", "Kecamatan 2", "Kecamatan 3"];
  const result: object[] = [];

  kecamatanList.forEach((kec) => {
    const numDesa = rand(2, 6);
    const desaItems = Array.from({ length: numDesa }, (_, di) => ({
      level: "desa",
      kabupaten,
      kecamatan: kec,
      desa: `${DESA_NAMES[di % DESA_NAMES.length]} ${di + 1}`,
      terdampak_kk: rand(5, 200),
      terdampak_jiwa: rand(20, 800),
      pengungsi_kk: rand(0, 80),
      pengungsi_jiwa: rand(0, 300),
      korban_hilang: rand(0, 3),
      korban_meninggal: rand(0, 2),
      rumah_rusak_berat: rand(0, 50),
      rumah_rusak_sedang: rand(0, 100),
      rumah_rusak_ringan: rand(0, 150),
    }));

    // Kecamatan summary = sum of desa
    const kecSummary = desaItems.reduce(
      (acc, d) => ({
        ...acc,
        terdampak_kk: acc.terdampak_kk + d.terdampak_kk,
        terdampak_jiwa: acc.terdampak_jiwa + d.terdampak_jiwa,
        pengungsi_kk: acc.pengungsi_kk + d.pengungsi_kk,
        pengungsi_jiwa: acc.pengungsi_jiwa + d.pengungsi_jiwa,
        korban_hilang: acc.korban_hilang + d.korban_hilang,
        korban_meninggal: acc.korban_meninggal + d.korban_meninggal,
        rumah_rusak_berat: acc.rumah_rusak_berat + d.rumah_rusak_berat,
        rumah_rusak_sedang: acc.rumah_rusak_sedang + d.rumah_rusak_sedang,
        rumah_rusak_ringan: acc.rumah_rusak_ringan + d.rumah_rusak_ringan,
        jumlah_desa: desaItems.length,
      }),
      {
        level: "kecamatan",
        kabupaten,
        kecamatan: kec,
        desa: null,
        terdampak_kk: 0,
        terdampak_jiwa: 0,
        pengungsi_kk: 0,
        pengungsi_jiwa: 0,
        korban_hilang: 0,
        korban_meninggal: 0,
        rumah_rusak_berat: 0,
        rumah_rusak_sedang: 0,
        rumah_rusak_ringan: 0,
        jumlah_desa: 0,
      }
    );

    result.push(kecSummary);
    result.push(...desaItems);
  });

  return result;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ kabupaten: string }> }
) {
  const { kabupaten: rawKabupaten } = await params;
  const kabupaten = decodeURIComponent(rawKabupaten);

  // source param accepted for future real-data integration
  // const source = request.nextUrl.searchParams.get("source") ?? "sheet";

  const data = generateKabupatenData(kabupaten);

  const totals = (data as any[])
    .filter((d) => d.level === "kecamatan")
    .reduce(
      (acc: any, d: any) => {
        return {
          terdampak_kk: acc.terdampak_kk + (d.terdampak_kk || 0),
          terdampak_jiwa: acc.terdampak_jiwa + (d.terdampak_jiwa || 0),
          pengungsi_kk: acc.pengungsi_kk + (d.pengungsi_kk || 0),
          pengungsi_jiwa: acc.pengungsi_jiwa + (d.pengungsi_jiwa || 0),
          korban_hilang: acc.korban_hilang + (d.korban_hilang || 0),
          korban_meninggal: acc.korban_meninggal + (d.korban_meninggal || 0),
        };
      },
      { terdampak_kk: 0, terdampak_jiwa: 0, pengungsi_kk: 0, pengungsi_jiwa: 0, korban_hilang: 0, korban_meninggal: 0 }
    );

  return NextResponse.json({
    success: true,
    source: "dummy",
    kabupaten,
    total: data.length,
    summary: totals,
    data,
  });
}
