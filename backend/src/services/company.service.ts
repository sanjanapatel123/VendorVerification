export type CompanyVerificationResult = {
  status: "VERIFIED" | "MISMATCH" | "UNABLE_TO_VERIFY";
  provider: string;
  searchedTerm: string;
  externalCompanyId: string | null;
  result: Record<string, unknown> | null;
  errorMessage: string | null;
};

export async function verifyCompany(
  companyName: string,
): Promise<CompanyVerificationResult> {
  const token = process.env.OPENCORPORATES_API_TOKEN;

  if (!token) {
    return {
      status: "UNABLE_TO_VERIFY",
      provider: "OPENCORPORATES",
      searchedTerm: companyName,
      externalCompanyId: null,
      result: null,
      errorMessage: "OpenCorporates API token is not configured",
    };
  }

  try {
    const url = new URL("https://api.opencorporates.com/v0.4/companies/search");

    url.searchParams.set("q", companyName);
    url.searchParams.set("api_token", token);

    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`OpenCorporates returned HTTP ${response.status}`);
    }

    const data = (await response.json()) as {
      results?: {
        companies?: Array<{
          company?: {
            name?: string;
            company_number?: string;
            jurisdiction_code?: string;
          };
        }>;
      };
    };

    const companies = data.results?.companies ?? [];
    const match = companies.find(
      (item) =>
        item.company?.name?.trim().toLowerCase() ===
        companyName.trim().toLowerCase(),
    )?.company;

    if (!match) {
      return {
        status: "UNABLE_TO_VERIFY",
        provider: "OPENCORPORATES",
        searchedTerm: companyName,
        externalCompanyId: null,
        result: { matchesFound: companies.length },
        errorMessage: "No exact company name match found",
      };
    }

    return {
      status: "VERIFIED",
      provider: "OPENCORPORATES",
      searchedTerm: companyName,
      externalCompanyId: match.company_number ?? null,
      result: match,
      errorMessage: null,
    };
  } catch (error) {
    return {
      status: "UNABLE_TO_VERIFY",
      provider: "OPENCORPORATES",
      searchedTerm: companyName,
      externalCompanyId: null,
      result: null,
      errorMessage:
        error instanceof Error ? error.message : "Verification failed",
    };
  }
}
