import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

type Notification = {
  id: string;
  title: string;
  body: string;
};

type Points = {
  pointsTotal: number;
  level: string;
  pointEvents: Array<{ id: string; points: number; reason: string }>;
};

export default function ProfileScreen() {
  const { user, accessToken, clear } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [points, setPoints] = useState<Points | null>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    void Promise.all([
      apiFetch<Points>("/user/points", { token: accessToken }),
      apiFetch<Notification[]>("/notifications", { token: accessToken }),
    ]).then(([pointData, notificationData]) => {
      setPoints(pointData);
      setNotifications(notificationData);
    });
  }, [accessToken]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8efe3" }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 20 }}>
          <Text style={{ fontSize: 28, fontWeight: "700", color: "#0f172a" }}>{user?.name || "Guest"}</Text>
          <Text style={{ marginTop: 8, color: "#475569" }}>{user?.email || "Sign in required"}</Text>
          <Text style={{ marginTop: 8, color: "#0f766e" }}>
            {points?.level || user?.level || "Beginner"} • {points?.pointsTotal ?? user?.pointsTotal ?? 0} pts
          </Text>
        </View>

        <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 20, gap: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: "700", color: "#0f172a" }}>Recent activity</Text>
          {points?.pointEvents.map((event) => (
            <View key={event.id} style={{ backgroundColor: "#f8fafc", borderRadius: 16, padding: 14 }}>
              <Text style={{ color: "#0f172a" }}>{event.reason}</Text>
              <Text style={{ color: "#0f766e", marginTop: 6 }}>+{event.points} points</Text>
            </View>
          ))}
        </View>

        <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 20, gap: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: "700", color: "#0f172a" }}>Notifications</Text>
          {notifications.map((notification) => (
            <View key={notification.id} style={{ backgroundColor: "#f8fafc", borderRadius: 16, padding: 14 }}>
              <Text style={{ fontWeight: "700", color: "#0f172a" }}>{notification.title}</Text>
              <Text style={{ marginTop: 6, color: "#475569" }}>{notification.body}</Text>
            </View>
          ))}
        </View>

        <Pressable onPress={() => void clear()} style={{ backgroundColor: "#0f172a", padding: 16, borderRadius: 16 }}>
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>Log out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

