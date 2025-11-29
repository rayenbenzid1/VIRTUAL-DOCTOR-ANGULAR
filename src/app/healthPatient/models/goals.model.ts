export interface Milestone {
  day: number;
  target: number;
  description: string;
}

export interface Goal {
  category: string;
  title: string;
  current: number;
  target: number;
  timeframe: string;
  priority: 'high' | 'medium' | 'low';
  tips: string[];
  milestones: Milestone[];
  expected_improvement: string;
}

export interface GoalPreferences {
  preferred_goals: string[];
  timeframe_days: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
}

export interface PersonalizedGoalsResponse {
  email: string;
  total_goals: number;
  high_priority_count: number;
  timeframe_days: number;
  difficulty: string;
  estimated_improvement: number;
  average_current_health_score: string;
  projected_health_score: string;
  goals: Goal[];
}