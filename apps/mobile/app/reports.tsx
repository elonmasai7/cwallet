import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { API_URL } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

export default function ReportsScreen() {
  const token = useAuthStore((state) => state.accessToken);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [coords, setCoords] = useState<{ latitude?: number; longitude?: number }>({});
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function getLocation() {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      setMessage("Location permission denied.");
      return;
    }

    const result = await Location.getCurrentPositionAsync({});
    setCoords({
      latitude: result.coords.latitude,
      longitude: result.coords.longitude,
    });
  }

  async function submit() {
    if (!token) {
      setMessage("Please sign in first.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", locationLabel);
    if (coords.latitude !== undefined) {
      formData.append("latitude", String(coords.latitude));
    }
    if (coords.longitude !== undefined) {
      formData.append("longitude", String(coords.longitude));
    }
    if (imageUri) {
      formData.append("image", {
        uri: imageUri,
        name: "report.jpg",
        type: "image/jpeg",
      } as never);
    }

    const response = await fetch(`${API_URL}/reports`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    setMessage(response.ok ? "Report submitted successfully." : data.message || "Submission failed");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8efe3" }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 20, gap: 12 }}>
          <Text style={{ fontSize: 26, fontWeight: "700", color: "#0f172a" }}>Report an issue</Text>
          <TextInput value={title} onChangeText={setTitle} placeholder="Issue title" style={{ borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 16, padding: 14 }} />
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="What happened?"
            style={{ borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 16, padding: 14, minHeight: 120, textAlignVertical: "top" }}
          />
          <TextInput value={locationLabel} onChangeText={setLocationLabel} placeholder="Location" style={{ borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 16, padding: 14 }} />
          <Pressable onPress={() => void getLocation()} style={{ backgroundColor: "#e2e8f0", padding: 14, borderRadius: 16 }}>
            <Text>Use current GPS location</Text>
          </Pressable>
          <Pressable onPress={() => void pickImage()} style={{ backgroundColor: "#e2e8f0", padding: 14, borderRadius: 16 }}>
            <Text>{imageUri ? "Change photo" : "Upload photo"}</Text>
          </Pressable>
          {message ? <Text style={{ color: "#0f766e" }}>{message}</Text> : null}
          <Pressable onPress={() => void submit()} style={{ backgroundColor: "#0f172a", padding: 16, borderRadius: 16 }}>
            <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>Submit report</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
