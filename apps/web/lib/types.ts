export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "USER" | "ADMIN";
  pointsTotal: number;
  level: string;
};

export type Lesson = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  order: number;
  pointsAward: number;
  completed?: boolean;
  quizzes: Array<{
    id: string;
    question: string;
    options: string[];
    answerIndex: number;
    explanation?: string;
  }>;
};

export type Report = {
  id: string;
  title: string;
  description: string;
  location?: string | null;
  imageUrl?: string | null;
  status: string;
  source: string;
  createdAt: string;
};

