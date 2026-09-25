import { NextResponse, type NextRequest } from "next/server";
import { sendEmailForCurrentStatus } from "@/lib/lending/emails";

/**
 * Called by the Studio lending actions right after a status change, to email
 * the lender for their new stage. Deliberately needs no auth: it can only
 * ever send the one email the application's current status already calls
 * for, and only once, so the worst a caller can do is send it early by a
 * few seconds.
 */
export async function POST(req: NextRequest) {
  const { id } = (await req.json().catch(() => ({}))) as { id?: unknown };
  if (typeof id !== "string" || !id.startsWith("lending.")) {
    return NextResponse.json({ message: "Invalid application id" }, { status: 400 });
  }

  try {
    return NextResponse.json(await sendEmailForCurrentStatus(id));
  } catch (error) {
    console.error("[lending] notify failed:", error);
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
