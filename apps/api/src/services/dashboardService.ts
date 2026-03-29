const allocationBreakdown = [
  { sector: "Health", percentage: 24, amount: 2400 },
  { sector: "Education", percentage: 22, amount: 2200 },
  { sector: "Infrastructure", percentage: 20, amount: 2000 },
  { sector: "Agriculture", percentage: 12, amount: 1200 },
  { sector: "Social Protection", percentage: 10, amount: 1000 },
  { sector: "Other", percentage: 12, amount: 1200 },
];

export function getPublicFinanceSnapshot() {
  const estimatedMonthlyTaxContribution = 8700;

  return {
    estimatedMonthlyTaxContribution,
    yearlyProjection: estimatedMonthlyTaxContribution * 12,
    currency: "KES",
    allocationBreakdown,
    insights: [
      "Health and education receive the largest share in this MVP dataset.",
      "Replace this static dataset with live budget APIs through the dashboard service layer later.",
    ],
  };
}

