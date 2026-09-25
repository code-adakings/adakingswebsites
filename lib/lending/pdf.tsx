/* eslint-disable jsx-a11y/alt-text -- react-pdf <Image> is not an HTML img and has no alt prop */
import "server-only";
import { Document, Image, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import {
  formatCedis,
  formatDate,
  formatDateTime,
  formatPercent,
} from "@/lib/lending/shared";
import {
  lendingUrl,
  renderClauses,
  type LendingApplication,
  type LendingSettings,
} from "@/lib/lending/server";

const GOLD = "#d4a017";
const INK = "#111111";
const MUTED = "#666666";
const RULE = "#e5e5e5";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: INK, paddingBottom: 56 },
  header: {
    backgroundColor: INK,
    paddingVertical: 18,
    paddingHorizontal: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  icon: { width: 26 },
  wordmark: { width: 120, height: 15 },
  headerRight: { alignItems: "flex-end" },
  headerEyebrow: { color: GOLD, fontSize: 8, letterSpacing: 1.5, fontFamily: "Helvetica-Bold" },
  headerNumber: { color: "#ffffff", fontSize: 11, fontFamily: "Helvetica-Bold", marginTop: 3 },
  body: { paddingHorizontal: 40, paddingTop: 24 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#ecfdf5",
    color: "#047857",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    letterSpacing: 1,
  },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold", marginTop: 10 },
  subtitle: { fontSize: 11, color: MUTED, marginTop: 2 },
  terms: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 18,
    borderWidth: 1,
    borderColor: RULE,
    borderRadius: 6,
  },
  term: { width: "33.33%", padding: 10, borderColor: RULE },
  termLabel: { fontSize: 7.5, color: MUTED, letterSpacing: 0.8 },
  termValue: { fontSize: 12, fontFamily: "Helvetica-Bold", marginTop: 3 },
  clause: { marginTop: 14 },
  clauseHeading: { fontSize: 10.5, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  paragraph: { fontSize: 10, lineHeight: 1.35, marginBottom: 5, color: "#262626" },
  execution: { marginTop: 22, borderTopWidth: 1, borderColor: RULE, paddingTop: 14 },
  sectionTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 8 },
  consent: { fontSize: 9, color: MUTED, lineHeight: 1.5, marginBottom: 12 },
  parties: { flexDirection: "row", gap: 16 },
  party: { flex: 1, borderWidth: 1, borderColor: RULE, borderRadius: 6, padding: 10 },
  partyRole: { fontSize: 7.5, color: MUTED, letterSpacing: 0.8 },
  signature: { fontSize: 15, fontFamily: "Times-Italic", marginTop: 6, color: INK },
  partyName: { fontFamily: "Helvetica-Bold", marginTop: 6 },
  partyMeta: { fontSize: 8.5, color: MUTED, marginTop: 2 },
  verify: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 18 },
  qr: { width: 72, height: 72 },
  verifyText: { flex: 1, fontSize: 8.5, color: MUTED, lineHeight: 1.5 },
  footer: {
    position: "absolute",
    bottom: 22,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: MUTED,
    borderTopWidth: 1,
    borderColor: RULE,
    paddingTop: 6,
  },
});

type Logos = { icon?: Buffer; wordmark?: Buffer };

function AgreementPdf({
  app,
  settings,
  qr,
  logos,
}: {
  app: LendingApplication;
  settings: LendingSettings;
  qr: string;
  logos: Logos;
}) {
  const terms: [string, string][] = [
    ["PRINCIPAL", formatCedis(app.negotiatedAmount)],
    ["INTEREST", formatPercent(app.interestRate)],
    ["REPAYMENT", formatCedis(app.repaymentAmount)],
    ["TERM", `${app.termMonths} Months`],
    ["FUNDED", formatDate(app.fundedAt)],
    ["MATURITY", formatDate(app.maturityDate)],
  ];

  return (
    <Document
      title={`Lending Agreement ${app.agreementNumber}`}
      author={settings.borrowerCompany}
      subject="Operation New Frontiers — Private Lending Agreement"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <View style={styles.brand}>
            {logos.icon ? <Image src={logos.icon} style={styles.icon} /> : null}
            {logos.wordmark ? (
              <Image src={logos.wordmark} style={styles.wordmark} />
            ) : (
              <Text style={{ color: "#fff", fontFamily: "Helvetica-Bold", fontSize: 14 }}>ADAKINGS</Text>
            )}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerEyebrow}>PRIVATE LENDING AGREEMENT</Text>
            <Text style={styles.headerNumber}>{app.agreementNumber}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.badge}>VERIFIED & EXECUTED</Text>
          <Text style={styles.title}>Operation New Frontiers</Text>
          <Text style={styles.subtitle}>
            Between {app.fullName} (Lender) and {settings.borrowerCompany} (Borrower)
          </Text>

          <View style={styles.terms}>
            {terms.map(([label, value], index) => (
              <View
                key={label}
                style={[
                  styles.term,
                  { borderRightWidth: index % 3 === 2 ? 0 : 1, borderBottomWidth: index < 3 ? 1 : 0 },
                ]}
              >
                <Text style={styles.termLabel}>{label}</Text>
                <Text style={styles.termValue}>{value}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.partyMeta, { marginTop: 8 }]}>
            Payment reference: {app.agreementNumber} · Received via{" "}
            {app.paymentMethod === "momo" ? "Mobile Money" : "bank transfer"}
          </Text>

          {renderClauses(app, settings).map((clause, index) => (
            <View key={index} style={styles.clause} wrap={false}>
              <Text style={styles.clauseHeading}>
                {index + 1}. {clause.heading}
              </Text>
              {clause.paragraphs.map((paragraph, p) => (
                <Text key={p} style={styles.paragraph}>
                  {paragraph}
                </Text>
              ))}
            </View>
          ))}

          <View style={styles.execution} wrap={false}>
            <Text style={styles.sectionTitle}>Digital Execution</Text>
            <Text style={styles.consent}>
              The Lender confirmed: &quot;I have read and agree to the terms of this Lending Agreement. I
              understand this constitutes my electronic signature.&quot;
            </Text>
            <View style={styles.parties}>
              <View style={styles.party}>
                <Text style={styles.partyRole}>LENDER</Text>
                <Text style={styles.signature}>{app.consentName}</Text>
                <Text style={styles.partyName}>{app.fullName}</Text>
                <Text style={styles.partyMeta}>Signed electronically {formatDateTime(app.consentAt)}</Text>
              </View>
              <View style={styles.party}>
                <Text style={styles.partyRole}>BORROWER</Text>
                <Text style={styles.signature}>{settings.borrowerSignatory}</Text>
                <Text style={styles.partyName}>{settings.borrowerSignatory}</Text>
                <Text style={styles.partyMeta}>
                  {[settings.borrowerSignatoryTitle, settings.borrowerCompany].filter(Boolean).join(", ")}
                </Text>
                <Text style={styles.partyMeta}>Approved {formatDate(app.approvedAt)}</Text>
              </View>
            </View>

            <View style={styles.verify}>
              <Image src={qr} style={styles.qr} />
              <Text style={styles.verifyText}>
                Scan to verify this agreement against the live record held by {settings.borrowerCompany}.
                Agreement {app.agreementNumber}. This document was generated electronically and is valid
                without a handwritten signature.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>
            {app.agreementNumber} · {app.fullName}
          </Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

async function fetchLogo(origin: string, path: string): Promise<Buffer | undefined> {
  try {
    const response = await fetch(`${origin}${path}`);
    return response.ok ? Buffer.from(await response.arrayBuffer()) : undefined;
  } catch {
    return undefined;
  }
}

/** `origin` is the request's own origin, used to load the logos from /public. */
export async function renderAgreementPdf(
  app: LendingApplication,
  settings: LendingSettings,
  origin: string,
): Promise<Buffer> {
  const [qr, icon, wordmark] = await Promise.all([
    QRCode.toDataURL(lendingUrl(app.publicToken), { margin: 0, width: 240, color: { dark: INK } }),
    fetchLogo(origin, "/brand/adakings-logo-icon.png"),
    fetchLogo(origin, "/brand/adakings-logo-wordmark.png"),
  ]);
  return renderToBuffer(<AgreementPdf app={app} settings={settings} qr={qr} logos={{ icon, wordmark }} />);
}
