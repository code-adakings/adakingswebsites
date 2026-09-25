/**
 * PLACEHOLDER agreement wording — drafted for structure only and NOT reviewed
 * by a lawyer. Replace in Studio (Operation New Frontiers → Lending Settings →
 * Agreement clauses) before sending real agreements. Used as the Studio
 * initial value and as the site's fallback while that document is empty.
 */
export const DEFAULT_AGREEMENT_CLAUSES: { heading: string; body: string }[] = [
  {
    heading: "Parties",
    body: "This Private Lending Agreement (Agreement No. {{agreementNumber}}) is made between {{lenderName}} of {{lenderAddress}} (the \"Lender\") and {{borrowerCompany}} (the \"Borrower\"), represented by {{borrowerSignatory}}, {{borrowerSignatoryTitle}}.",
  },
  {
    heading: "The Loan",
    body: "The Lender agrees to lend the Borrower the principal sum of {{principal}} (the \"Principal\") as part of the Operation New Frontiers private lending facility.\n\nThe Principal shall be transferred to the Borrower's designated account using the payment reference {{paymentReference}}. This Agreement takes effect on the date the Borrower confirms receipt of the Principal ({{fundedDate}}).",
  },
  {
    heading: "Interest and Repayment",
    body: "The Principal attracts a fixed return of {{interestRate}} for the full term, amounting to {{interestAmount}}.\n\nThe Borrower shall repay a total of {{repayment}} to the Lender in a single lump sum on or before {{maturityDate}}, being {{termMonths}} months from the date the Principal was received.",
  },
  {
    heading: "Nature of the Facility",
    body: "This is a fixed-term private debt facility. It does not confer any equity, ownership, voting rights, or share of profits in the Borrower, and it is not an offer of securities to the public.",
  },
  {
    heading: "Early Repayment",
    body: "The Borrower may repay the full amount of {{repayment}} before the maturity date without penalty. The fixed return is not reduced by early repayment.",
  },
  {
    heading: "Default",
    body: "If the Borrower fails to repay on the maturity date, the parties shall in good faith agree a revised repayment schedule within fourteen (14) days. [Lawyer to specify default interest and remedies.]",
  },
  {
    heading: "Governing Law",
    body: "This Agreement is governed by the laws of the Republic of Ghana.",
  },
  {
    heading: "Electronic Execution",
    body: "The parties agree that this Agreement may be executed electronically. The Lender's digital consent, recorded with a timestamp on the Borrower's secure platform, constitutes the Lender's signature and has the same effect as a handwritten signature.",
  },
];
