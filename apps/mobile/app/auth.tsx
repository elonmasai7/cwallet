import { useState } from "react";
import { router } from "expo-router";
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function AuthScreen() {
  const setSession = useAuthStore((state) => state.setSession);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");

  async function submit() {
    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password, phone: form.phone };

      const response = await apiFetch<{
        user: { id: string; name: string; email: string; role: "USER" | "ADMIN"; pointsTotal: number; level: string };
        accessToken: string;
        refreshToken: string;
      }>(path, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      await setSession(response);
      router.replace("/dashboard");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Authentication failed");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8efe3", padding: 20 }}>
      <View style={{ backgroundColor: "#fff", borderRadius: 28, padding: 24, gap: 14 }}>
        <Text style={{ fontSize: 28, fontWeight: "700", color: "#0f172a" }}>
          {mode === "login" ? "Welcome back" : "Join CivicWallet"}
        </Text>
        {mode === "register" ? (
          <TextInput
            placeholder="Full name"
            value={form.name}
            onChangeText={(value) => setForm((current) => ({ ...current, name: value }))}
            style={{ borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 16, padding: 14 }}
          />
        ) : null}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(value) => setForm((current) => ({ ...current, email: value }))}
          style={{ borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 16, padding: 14 }}
        />
        {mode === "register" ? (
          <TextInput
            placeholder="+254700000000"
            value={form.phone}
            onChangeText={(value) => setForm((current) => ({ ...current, phone: value }))}
            style={{ borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 16, padding: 14 }}
          />
        ) : null}
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onChangeText={(value) => setForm((current) => ({ ...current, password: value }))}
          style={{ borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 16, padding: 14 }}
        />
        {error ? <Text style={{ color: "#dc2626" }}>{error}</Text> : null}
        <Pressable onPress={() => void submit()} style={{ backgroundColor: "#0f172a", padding: 16, borderRadius: 16 }}>
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
            {mode === "login" ? "Sign in" : "Create account"}
          </Text>
        </Pressable>
        <Pressable onPress={() => setMode(mode === "login" ? "register" : "login")}>
          <Text style={{ textAlign: "center", color: "#0f766e" }}>
            {mode === "login" ? "Need an account? Register" : "Have an account? Login"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

