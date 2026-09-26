/** Borrower details used until Lending Settings is filled in. */
export const DEFAULT_BORROWER = {
  borrowerCompany: "Adakings Foods & Beverages Company (Adakings Franchise Corporation LTD)",
  borrowerSignatory: "Kingsley K. Adase",
  borrowerSignatoryTitle: "Founder & Chief Visionary",
};

/**
 * The Operation New Frontiers Private Lending Agreement, as issued by the
 * Borrower (September 2026). Published to Studio (Operation New Frontiers →
 * Lending Settings → Agreement clauses), which is the live source; this copy
 * is the Studio initial value and the site's fallback while that is empty.
 * Every approved application freezes its own copy of the wording at approval.
 */
export const DEFAULT_AGREEMENT_CLAUSES: { heading: string; body: string }[] = [
  {
    heading: "Parties",
    body: "This Private Lending Agreement (“Agreement”) is entered into between Adakings Foods & Beverages Company (Adakings Franchise Corporation LTD), represented by Kingsley K. Adase, Founder & Chief Visionary (the “Borrower”), and the individual whose details appear in the completed application and acceptance records on the Operation New Frontiers platform (the “Lender”). Together, the Borrower and the Lender are referred to as the “Parties”.",
  },
  {
    heading: "The Loan",
    body: "The Lender agrees to lend to the Borrower the principal amount approved by the Borrower through the Operation New Frontiers platform. The approved principal, funding date, maturity date, agreement number, and repayment amount form part of this Agreement and are incorporated by reference once the application is approved.",
  },
  {
    heading: "Interest and Repayment",
    body: "The loan carries a fixed negotiated interest rate, agreed between the Parties and recorded in the approved application. The Borrower shall repay the entire principal together with the agreed interest as a single lump-sum payment on the maturity date. Interest is fixed, non-compounding, and calculated only on the original principal amount.",
  },
  {
    heading: "Nature of the Facility",
    body: "Operation New Frontiers is a private fixed-term debt facility established to strengthen the working capital and cash flow of Adakings Foods & Beverages Company during one academic semester. This facility does not constitute an equity investment, partnership, or profit-sharing arrangement. The Lender receives only the contractual right to repayment of principal and the agreed fixed return.",
  },
  {
    heading: "Early Repayment",
    body: "The Borrower may repay the loan before the maturity date at its discretion. Unless otherwise agreed in writing, early repayment shall include the full principal and the full negotiated interest, and such repayment shall fully discharge the Borrower’s obligations under this Agreement.",
  },
  {
    heading: "Default",
    body: "A default occurs if the Borrower fails to repay the agreed amount within fourteen (14) calendar days after the maturity date. In the event of default, the Parties agree to first pursue good-faith discussions and mediation before commencing any legal proceedings. Nothing in this clause limits either Party’s legal rights under the laws of the Republic of Ghana.",
  },
  {
    heading: "Governing Law",
    body: "This Agreement shall be governed by and interpreted in accordance with the laws of the Republic of Ghana. Any dispute arising from this Agreement shall be resolved through legal mediation or arbitration.",
  },
  {
    heading: "Electronic Execution and Records",
    body: [
      "8.1 Electronic form. The Parties agree that this Agreement is concluded and executed electronically through the Operation New Frontiers platform, and that it shall not be denied legal effect, validity, or enforceability solely because it is in electronic form, in accordance with the Electronic Transactions Act, 2008 (Act 772) of the Republic of Ghana.",
      "8.2 Lender’s signature. The Lender executes this Agreement by typing their full name and selecting “I Agree” beneath the consent statement displayed on the Lender’s private agreement page, which is accessible only through the unique link issued to the email address given in the Lender’s application. That act constitutes the Lender’s legally binding electronic signature.",
      "8.3 Borrower’s execution. The Borrower executes this Agreement by approving its terms through the Operation New Frontiers administrative platform. This Agreement becomes available for the Lender’s signature only after the Borrower has confirmed receipt of the principal by checking it against the Borrower’s own bank or Mobile Money statement. A receipt, screenshot, or other evidence of payment supplied by the Lender does not by itself constitute confirmation of receipt.",
      "8.4 Execution record. When the Lender signs, the platform permanently records: the Lender’s full name as typed; the date and time of signature in Coordinated Universal Time (UTC); the Lender’s IP address; the Lender’s device and browser; the exact consent statement accepted and its version number; and a SHA-256 cryptographic fingerprint of the terms and wording of this Agreement. This record forms part of this Agreement, and the Parties accept it as evidence of execution.",
      "8.5 Fixed terms. The terms and wording of this Agreement are fixed when the Borrower approves the application, and they cannot be altered after the Lender has signed. Any variation after signature must be agreed in writing by both Parties.",
      "8.6 Official copy and verification. The digitally generated PDF bearing agreement number {{agreementNumber}} is the official executed copy of this Agreement. Its authenticity may be verified at any time by scanning its QR code, or by entering its agreement number and verification code on the Borrower’s verification page. A copy whose details do not match the Borrower’s verified record shall not be relied upon.",
      "8.7 Notices. The Lender agrees to receive notices and documents relating to this Agreement electronically at the email address given in the Lender’s application.",
    ].join("\n\n"),
  },
];
