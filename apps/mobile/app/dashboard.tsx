import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

type DashboardPayload = {
  estimatedMonthlyTaxContribution: number;
  yearlyProjection: number;
  currency: string;
  allocationBreakdown: Array<{ sector: string; percentage: number }>;
};

export default function DashboardScreen() {
  const user = useAuthStore((state) => state.user);
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);

  useEffect(() => {
    void apiFetch<DashboardPayload>("/dashboard/public-finance").then(setDashboard);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8efe3" }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 28, padding: 24 }}>
          <Text style={{ color: "#64748b", fontSize: 14 }}>Logged in as</Text>
          <Text style={{ color: "#0f172a", fontSize: 28, fontWeight: "700", marginTop: 8 }}>
            {user?.name || "Citizen"}
          </Text>
          <Text style={{ marginTop: 8, color: "#334155" }}>
            {user?.level || "Beginner"} • {user?.pointsTotal ?? 0} points
          </Text>
        </View>

        <View style={{ backgroundColor: "#0f172a", borderRadius: 28, padding: 24 }}>
          <Text style={{ color: "#cbd5e1", fontSize: 14 }}>Estimated monthly tax contribution</Text>
          <Text style={{ color: "#fff", fontSize: 32, fontWeight: "700", marginTop: 10 }}>
            {dashboard?.currency || "KES"} {dashboard?.estimatedMonthlyTaxContribution.toLocaleString() || "0"}
          </Text>
          <Text style={{ color: "#cbd5e1", marginTop: 10 }}>
            Annual projection: {dashboard?.currency || "KES"} {dashboard?.yearlyProjection.toLocaleString() || "0"}
          </Text>
        </View>

        <View style={{ backgroundColor: "#fff", borderRadius: 28, padding: 24, gap: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: "700", color: "#0f172a" }}>Where the money goes</Text>
          {dashboard?.allocationBreakdown.map((entry) => (
            <View key={entry.sector} style={{ gap: 6 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text>{entry.sector}</Text>
                <Text>{entry.percentage}%</Text>
              </View>
              <View style={{ height: 12, backgroundColor: "#e2e8f0", borderRadius: 999 }}>
                <View
                  style={{
                    width: `${entry.percentage}%`,
                    height: 12,
                    backgroundColor: "#0f766e",
                    borderRadius: 999,
                  }}
                />
              </View>
            </View>
          ))}
        </View>

        <Link href="/lessons" style={{ backgroundColor: "#fff", padding: 16, borderRadius: 18 }}>
          Open lessons
        </Link>
        <Link href="/reports" style={{ backgroundColor: "#fff", padding: 16, borderRadius: 18 }}>
          Report an issue
        </Link>
        <Link href="/leaderboard" style={{ backgroundColor: "#fff", padding: 16, borderRadius: 18 }}>
          View leaderboard
        </Link>
        <Link href="/profile" style={{ backgroundColor: "#fff", padding: 16, borderRadius: 18 }}>
          Open profile
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}
