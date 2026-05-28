export type CourseId = "html" | "css" | "javascript" | "react" | "python" | "nodejs" | "uiux";

export interface Challenge {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  points: number;
  instructions: string;
  initialCode: string;
  solutionRegex?: string; // For testing
  tests?: { input?: string; expected: string; description: string }[];
  hint: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown or rich text
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  xpAward: number;
  challenges: Challenge[];
}

export interface Course {
  id: CourseId;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  accentColor: string; // Tailwind neon color (e.g., "emerald-400", "violet-400", "cyan-400")
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  totalLessons: number;
  lessons: Lesson[];
}

export interface UserProgress {
  xp: number;
  streak: number;
  completedChallenges: string[]; // Challenge IDs
  completedLessons: string[]; // Lesson IDs
  level: number;
  sparkCoins: number;
  claimedCertificates: CourseId[];
  unlockedStoryPoints: number;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
  badge: string;
  isCurrentUser?: boolean;
}

export interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  role: string;
  title: string;
  tag: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  likedByUser?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}
