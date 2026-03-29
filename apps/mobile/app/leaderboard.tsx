import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { apiFetch } from "@/lib/api";

type Entry = {
  id: string;
  name: string;
  pointsTotal: number;
  level: string;
};

export default function LeaderboardScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    void apiFetch<Entry[]>("/leaderboard").then(setEntries);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8efe3" }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
        {entries.map((entry, index) => (
          <View key={entry.id} style={{ backgroundColor: "#fff", borderRadius: 22, padding: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={{ color: "#64748b" }}>#{index + 1}</Text>
              <Text style={{ color: "#0f172a", fontSize: 20, fontWeight: "700", marginTop: 4 }}>{entry.name}</Text>
              <Text style={{ color: "#475569", marginTop: 4 }}>{entry.level}</Text>
            </View>
            <View style={{ backgroundColor: "#0f172a", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 }}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>{entry.pointsTotal} pts</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
