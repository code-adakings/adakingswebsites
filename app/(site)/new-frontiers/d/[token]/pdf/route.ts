import { NextResponse, type NextRequest } from "next/server";
import { getApplicationByToken, getLendingSettings } from "@/lib/lending/server";
import { renderAgreementPdf } from "@/lib/lending/pdf";
import { isAtLeast } from "@/lib/lending/shared";

export const dynamic = "force-dynamic";

/** The executed agreement PDF — only exists once the lender has signed. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const app = await getApplicationByToken(token);
  if (!app) return new NextResponse("Not found", { status: 404 });

  if (!isAtLeast(app.status, "CONSENT_SIGNED")) {
    return NextResponse.redirect(new URL(`/new-frontiers/d/${token}`, req.url));
  }

  const pdf = await renderAgreementPdf(app, await getLendingSettings(), req.nextUrl.origin);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Adakings-Lending-Agreement-${app.agreementNumber}.pdf"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
