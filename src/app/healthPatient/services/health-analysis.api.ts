// src/app/healthPatient/services/health-analysis.api.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASE_URL = `${environment.BASE_URL}`;

export interface BiometricData {
  totalSteps: number;
  avgHeartRate: number;
  minHeartRate: number;
  maxHeartRate: number;
  totalDistanceKm: number;
  totalSleepHours: number;
  totalHydrationLiters: number;
  stressLevel: string;
  stressScore: number;
  dailyTotalCalories?: number;
  oxygenSaturation?: Array<{ percentage: number; timestamp: string }>;
  bodyTemperature?: Array<{ temperature: number; timestamp: string }>;
  bloodPressure?: Array<{ systolic: number; diastolic: number; timestamp: string }>;
  weight?: Array<{ weight: number; timestamp: string }>;
  height?: Array<{ height: number; timestamp: string }>;
  exercise?: Array<{ type: string; durationMinutes: number; timestamp: string }>;
}

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

export interface TodayDataResponse {
  email: string;
  date: string;
  totalSteps: number;
  avgHeartRate: number;
  minHeartRate: number;
  maxHeartRate: number;
  totalDistanceKm: string;
  totalSleepHours: string;
  totalHydrationLiters: string;
  stressLevel: string;
  stressScore: number;
  dailyTotalCalories: number;
  oxygenSaturation: any[];
  bodyTemperature: any[];
  bloodPressure: any[];
  weight: any[];
  height: any[];
  exercise: any[];
}

@Injectable({
  providedIn: 'root'
})
export class HealthAnalysisApiService {
  private http = inject(HttpClient);

  getTodayData(email: string): Observable<TodayDataResponse> {
    return this.http.get<TodayDataResponse>(
      `${BASE_URL}/health-server/fetch/user/${email}/today`
    );
  }

  analyzeHealth(data: BiometricData): Observable<HealthAnalysisResult> {
    return this.http.post<HealthAnalysisResult>(
      `${BASE_URL}/model-ai-service/analyze-health`,
      data
    );
  }
}