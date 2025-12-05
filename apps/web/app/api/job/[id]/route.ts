import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const r = await axios.get(`http://localhost:5001/jobs/${id}`);
  return NextResponse.json(r.data);
}
