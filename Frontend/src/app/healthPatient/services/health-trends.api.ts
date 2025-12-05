import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASE_URL = `${environment.BASE_URL}/model-ai-service`;

export interface TrendData {
  dates: string[];
  steps: number[];
  heart_rate: number[];
  sleep_hours: number[];
  stress_score: number[];
  hydration: number[];
  health_scores: number[];
  weight: number[];
}

export interface MovingAverages {
  [key: string]: number[];
}

export interface MetricStatistics {
  min: number;
  max: number;
  mean: number;
  std: number;
  trend: 'increasing' | 'decreasing' | 'stable' | 'insufficient_data';
}

export interface Statistics {
  steps: MetricStatistics;
  heart_rate: MetricStatistics;
  sleep_hours: MetricStatistics;
  stress_score: MetricStatistics;
  hydration: MetricStatistics;
  weight: MetricStatistics;
  health_scores: MetricStatistics;
}

export interface HealthTrendsResponse {
  email: string;
  period_days: number;
  data_points: number;
  trends: TrendData;
  moving_averages: MovingAverages;
  statistics: Statistics;
}

@Injectable({
  providedIn: 'root'
})
export class HealthTrendsApiService {
  private http = inject(HttpClient);

  getHealthTrends(email: string, days: number = 30): Observable<HealthTrendsResponse> {
    return this.http.get<HealthTrendsResponse>(`${BASE_URL}/health-trends/${email}?days=${days}`);
  }
}