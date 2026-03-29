const allocationBreakdown = [
  { sector: "Health", percentage: 21, amount: 3150 },
  { sector: "Education", percentage: 18, amount: 2700 },
  { sector: "Infrastructure", percentage: 16, amount: 2400 },
  { sector: "Agriculture", percentage: 9, amount: 1350 },
  { sector: "Water", percentage: 8, amount: 1200 },
  { sector: "Social Protection", percentage: 8, amount: 1200 },
  { sector: "Youth Programs", percentage: 7, amount: 1050 },
  { sector: "Oversight", percentage: 5, amount: 750 },
  { sector: "Other", percentage: 8, amount: 1200 },
];

export function getPublicFinanceSnapshot() {
  const estimatedMonthlyTaxContribution = 12450;

  return {
    estimatedMonthlyTaxContribution,
    yearlyProjection: estimatedMonthlyTaxContribution * 12,
    currency: "USD",
    allocationBreakdown,
    headlineStats: [
      { label: "Active citizens", value: "13", change: "+4 this week" },
      { label: "Reports filed", value: "28", change: "+9 this month" },
      { label: "Lessons completed", value: "96", change: "+18 this week" },
      { label: "Budget items tracked", value: "41", change: "8 flagged for review" },
    ],
    countySnapshot: {
      countyName: "Nairobi Demo County",
      approvedBudget: 15000000,
      absorptionRate: 68,
      pendingProjects: 11,
      flaggedProjects: 4,
    },
    recentActivity: [
      "Mukuru drainage repair marked as delayed after two citizen reports.",
      "Three new learners completed the Budgeting at Home topic this morning.",
      "Water kiosk maintenance budget line was flagged for low absorption.",
      "Youth enterprise ward meeting summary was uploaded to the dashboard feed.",
    ],
    insights: [
      "Health, education, and infrastructure dominate this dummy county budget snapshot.",
      "Absorption is strongest in health programs and weakest in oversight-linked project delivery.",
      "Citizen reports are clustering around drainage, roads, and stalled ward-level maintenance work.",
      "This is still demo data, but the dashboard shape is ready for live API-backed metrics later.",
    ],
  };
}
