import { NextResponse } from "next/server";

/** Dummy kotak dihapus — gunakan GeoJSON batas administratif (loadGeoJSON di dashboard). */
export async function GET() {
  return NextResponse.json({
    polygons: { type: "FeatureCollection", features: [] },
    total: 0,
  });
}
