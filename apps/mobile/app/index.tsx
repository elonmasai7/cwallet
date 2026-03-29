import { Link } from "expo-router";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8efe3" }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={{ backgroundColor: "#0f172a", borderRadius: 28, padding: 24 }}>
          <Text style={{ color: "#fff", fontSize: 14, marginBottom: 12 }}>
            Civic fintech for accountability
          </Text>
          <Text style={{ color: "#fff", fontSize: 34, fontWeight: "700", lineHeight: 42 }}>
            CivicWallet helps citizens learn, report, and participate.
          </Text>
          <Text style={{ color: "#cbd5e1", fontSize: 16, marginTop: 16, lineHeight: 24 }}>
            Access lessons, public finance insights, and issue reporting from one mobile experience.
          </Text>
        </View>

        <Link href="/auth" style={{ backgroundColor: "#f97316", color: "#fff", padding: 16, borderRadius: 18 }}>
          Sign in or register
        </Link>
        <Link href="/dashboard" style={{ backgroundColor: "#fff", padding: 16, borderRadius: 18 }}>
          Open dashboard
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

