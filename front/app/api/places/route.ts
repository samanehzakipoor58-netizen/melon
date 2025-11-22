import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const url =
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=36.5633,53.0601&radius=3000&keyword=میوه&key=" +
    apiKey;

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data);
}
