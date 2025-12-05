// src/app/healthPatient/models/analysis.models.ts

export interface ScoreBreakdown {
  activity: number;
  cardiovascular: number;
  sleep: number;
  hydration: number;
  stress: number;
  vitals: number;
}

export interface ActivityDetails {
  steps: number;
  distance_km: number;
  exercises_count: number;
}

export interface CardiovascularDetails {
  avg_heart_rate: number;
  hr_variability: number;
}

export interface SleepDetails {
  hours: number;
  quality: string;
}

export interface StressDetails {
  level: string;
  score: number;
}

export interface HealthInsights {
  score_breakdown: ScoreBreakdown;
  activity_details: ActivityDetails;
  cardiovascular_details: CardiovascularDetails;
  sleep_details: SleepDetails;
  stress_details: StressDetails;
}

export interface HealthAnalysisResult {
  healthScore: number;
  riskLevel: string;
  anomalies: string[];
  recommendations: string[];
  insights: HealthInsights;
  aiExplanation: string;
}