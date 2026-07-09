import { KABUPATEN, rand } from "@/lib/dummy";

const KECAMATAN_NAMES = [
  "Mutiara",
  "Johan Pahlawan",
  "Bebesen",
  "Kuta Makmur",
  "Peusangan",
  "Indra Jaya",
  "Darul Imarah",
  "Lembah Seulawah",
  "Sukakarya",
  "Baiturrahman",
  "Lueng Bata",
  "Meuraxa",
];

const DESA_PREFIX = ["Paya", "Blang", "Meureudu", "Langkak", "Pasie", "Lampoh", "Deah"];

export function findKabupatenByKode(kode: string) {
  return KABUPATEN.find((k) => k.id === kode) ?? null;
}

export function buildPolygonDetail(kode: string) {
  const kab = findKabupatenByKode(kode);
  if (!kab) return null;

  const pengungsi = rand(100, 5000);
  const terdampak = rand(500, 12000);

  return {
    data: {
      center: { lat: kab.lat, lng: kab.lng },
      properties: {
        kode: kab.id,
        nama: kab.nama,
        level: 2,
        penduduk_total: rand(50000, 400000),
        penduduk_laki: rand(20000, 200000),
        penduduk_perempuan: rand(20000, 200000),
        jumlah_posko: rand(1, 8),
        jumlah_pengungsi: pengungsi,
        affected_population: terdampak,
        displaced_population: pengungsi,
        condition_summary: {
          "Terdampak Berat": rand(0, 3),
          "Terdampak Sedang": rand(2, 8),
          "Tidak Terdampak": rand(5, 15),
        },
      },
    },
  };
}

export function buildWilayahBreakdown(kode: string) {
  const kab = findKabupatenByKode(kode);
  if (!kab) return null;

  const childCount = rand(6, 12);
  const children = Array.from({ length: childCount }, (_, i) => {
    const affected = rand(0, 5000);
    const posko = rand(0, 5);
    return {
      kode: `${kab.id}.${String(i + 1).padStart(2, "0")}`,
      nama: `Kec. ${KECAMATAN_NAMES[i % KECAMATAN_NAMES.length]}`,
      affected_population: affected,
      posko_count: posko,
      total_desa: rand(5, 20),
    };
  });

  return {
    wilayah: {
      kode: kab.id,
      nama: kab.nama,
      level: 2,
    },
    children,
    summary: {
      total_terdampak: children.reduce(
        (sum, c) => sum + (c.affected_population || 0),
        0
      ),
      total_posko: children.reduce((sum, c) => sum + (c.posko_count || 0), 0),
    },
  };
}

/** Breakdown for kecamatan level (desa children) when kode is e.g. 1108.01 */
export function buildKecamatanBreakdown(kode: string) {
  const parentId = kode.split(".")[0];
  const kab = findKabupatenByKode(parentId);
  if (!kab) return null;

  const kecIndex = parseInt(kode.split(".")[1] || "1", 10);
  const kecName = `Kec. ${KECAMATAN_NAMES[(kecIndex - 1) % KECAMATAN_NAMES.length]}`;
  const childCount = rand(4, 10);

  const children = Array.from({ length: childCount }, (_, i) => ({
    kode: `${kode}.${String(i + 1).padStart(3, "0")}`,
    nama: `Desa ${DESA_PREFIX[i % DESA_PREFIX.length]} ${i + 1}`,
    affected_population: rand(0, 800),
    posko_count: rand(0, 2),
  }));

  return {
    wilayah: {
      kode,
      nama: kecName,
      level: 3,
      parent: kab.nama,
    },
    children,
    summary: {
      total_terdampak: children.reduce(
        (sum, c) => sum + (c.affected_population || 0),
        0
      ),
      total_posko: children.reduce((sum, c) => sum + (c.posko_count || 0), 0),
    },
  };
}

export function resolveWilayahBreakdown(kode: string) {
  if (findKabupatenByKode(kode)) {
    return buildWilayahBreakdown(kode);
  }
  if (/^\d{4}\.\d{2}$/.test(kode)) {
    return buildKecamatanBreakdown(kode);
  }
  return null;
}
