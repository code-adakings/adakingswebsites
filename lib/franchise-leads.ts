export interface FranchiseLead {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  businessExperience: string;
  investmentInterest: string;
  message: string;
  submittedAt: string;
}

/**
 * Persistence stub — swap for a Sanity mutation, CRM webhook, or
 * notification email once the franchise leads backend is connected.
 */
export async function saveFranchiseLead(lead: FranchiseLead): Promise<void> {
  console.log("[franchise-lead]", lead);
}
