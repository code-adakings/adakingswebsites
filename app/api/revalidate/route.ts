import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook target (Studio → API → Webhooks): on publish, Sanity POSTs
 * the changed document here and we revalidate the matching ISR tag, so the
 * public site updates within seconds instead of waiting for the next
 * sanityFetch revalidate window.
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json({ message: "Missing document type" }, { status: 400 });
    }

    revalidateTag(body._type);

    return NextResponse.json({ revalidated: true, type: body._type, now: Date.now() });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
