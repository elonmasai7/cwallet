import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

type Lesson = {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  quizzes: Array<{ id: string; question: string; options: string[] }>;
};

export default function LessonsScreen() {
  const token = useAuthStore((state) => state.accessToken);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void apiFetch<Lesson[]>("/lessons", { token }).then((response) => {
      setLessons(response);
      setSelected(response[0] || null);
    });
  }, [token]);

  async function completeLesson() {
    if (!token || !selected) {
      setMessage("Sign in to track progress.");
      return;
    }

    const answers = selected.quizzes.map(() => 0);
    const response = await apiFetch<{ score: number; totalQuestions: number }>(
      "/progress/complete",
      {
        method: "POST",
        token,
        body: JSON.stringify({ lessonId: selected.id, answers }),
      },
    );

    setMessage(`Lesson completed. Score ${response.score}/${response.totalQuestions}.`);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8efe3" }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        {lessons.map((lesson) => (
          <Pressable
            key={lesson.id}
            onPress={() => setSelected(lesson)}
            style={{ backgroundColor: selected?.id === lesson.id ? "#0f172a" : "#fff", borderRadius: 24, padding: 18 }}
          >
            <Text style={{ color: selected?.id === lesson.id ? "#cbd5e1" : "#64748b" }}>{lesson.category}</Text>
            <Text style={{ color: selected?.id === lesson.id ? "#fff" : "#0f172a", fontWeight: "700", fontSize: 20, marginTop: 6 }}>
              {lesson.title}
            </Text>
            <Text style={{ color: selected?.id === lesson.id ? "#cbd5e1" : "#475569", marginTop: 10, lineHeight: 22 }}>
              {lesson.summary}
            </Text>
          </Pressable>
        ))}

        {selected ? (
          <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#0f172a" }}>{selected.title}</Text>
            <Text style={{ marginTop: 12, color: "#334155", lineHeight: 24 }}>{selected.content}</Text>
            {message ? <Text style={{ marginTop: 12, color: "#0f766e" }}>{message}</Text> : null}
            <Pressable onPress={() => void completeLesson()} style={{ backgroundColor: "#f97316", padding: 16, borderRadius: 16, marginTop: 16 }}>
              <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>Mark complete</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

