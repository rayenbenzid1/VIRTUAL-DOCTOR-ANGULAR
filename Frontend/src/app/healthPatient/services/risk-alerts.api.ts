import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASE_URL = `${environment.BASE_URL}/model-ai-service`;

export interface RiskFactor {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  probability: number;
  actions: string[];
}

export interface ActionPriority {
  action: string;
  category: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  impact: string;
}

export interface AveragesComputed {
  steps: number;
  sleep_hours: number;
  heart_rate: number;
  stress_score: number;
  hydration_liters: number;
}

export interface RiskAlertsResponse {
  email: string;
  alert_level: string;
  analysis_period: string;
  analysis_type: string;
  data_points_analyzed: number;
  averages_computed: AveragesComputed;
  alerts: string[];
  risk_factors: RiskFactor[];
  action_priorities: ActionPriority[];
  next_checkup_recommended: string;
}

@Injectable({
  providedIn: 'root'
})
export class RiskAlertsApiService {
  private http = inject(HttpClient);

  getRiskAlerts(
    email: string,
    periodDays: number = 7,
    specificDate?: string
  ): Observable<RiskAlertsResponse> {
    let url = `${BASE_URL}/risk-alerts/${email}?period_days=${periodDays}`;
    
    if (specificDate) {
      url += `&specific_date=${specificDate}`;
    }
    
    return this.http.get<RiskAlertsResponse>(url);
  }
}