import { NextResponse } from "next/server";
import { resolveWilayahBreakdown } from "@/lib/wilayah-polygon";

type RouteContext = {
  params: Promise<{ kode: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { kode } = await context.params;
  const decoded = decodeURIComponent(kode);

  const result = resolveWilayahBreakdown(decoded);
  if (!result) {
    return NextResponse.json(
      { error: "Wilayah tidak ditemukan", kode: decoded },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}
