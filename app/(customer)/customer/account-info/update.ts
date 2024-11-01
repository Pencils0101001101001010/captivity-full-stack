"use server";

import { NextRequest, NextResponse } from "next/server";
import { updateAccountInfo } from "./actions";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const result = await updateAccountInfo(formData);

  return NextResponse.json(result);
}
