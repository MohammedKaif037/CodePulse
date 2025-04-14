import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

// Types for our database tables
export type User = {
  id: string
  name: string
  email: string
  experience_level: string
  technologies: string[]
  goal: string
  learning_style: string
  time_commitment: string
  tracking_metrics: string[]
  motivation: string
  preferences: string[]
  created_at: string
  updated_at: string
}

export type Task = {
  id: string
  user_id: string
  title: string
  completed: boolean
  priority: "high" | "medium" | "low"
  due_date: string
  category: "learning" | "project" | "practice"
  created_at: string
  updated_at: string
}

export type Project = {
  id: string
  user_id: string
  name: string
  description: string
  progress: number
  status: "planned" | "in-progress" | "completed"
  due_date: string
  created_at: string
  updated_at: string
}

export type ProjectTask = {
  id: string
  project_id: string
  name: string
  completed: boolean
  created_at: string
  updated_at: string
}

export type CodingActivity = {
  id: string
  user_id: string
  date: string
  minutes: number
  language: string
  topic: string
  created_at: string
}

export type Challenge = {
  id: string
  user_id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  type: string
  link: string
  completed: boolean
  created_at: string
}

export type LearningResource = {
  id: string
  title: string
  description: string
  type: "article" | "video" | "tutorial" | "course"
  source: string
  url: string
  tags: string[]
  created_at: string
}

export type SavedResource = {
  id: string
  user_id: string
  resource_id: string
  created_at: string
}
