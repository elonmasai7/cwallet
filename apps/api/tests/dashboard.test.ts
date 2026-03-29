import { getPublicFinanceSnapshot } from "../src/services/dashboardService";

describe("getPublicFinanceSnapshot", () => {
  it("returns a finance payload with sectors", () => {
    const payload = getPublicFinanceSnapshot();

    expect(payload.currency).toBe("KES");
    expect(payload.estimatedMonthlyTaxContribution).toBeGreaterThan(0);
    expect(payload.allocationBreakdown.length).toBeGreaterThan(0);
  });
});

