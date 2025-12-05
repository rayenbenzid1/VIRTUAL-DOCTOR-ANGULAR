// src/app/healthPatient/models/alerts.models.ts

/**
 * Modèles de données pour les alertes médicales
 */

export interface AveragesComputed {
  steps: number;
  sleep_hours: number;
  heart_rate: number;
  stress_score: number;
  hydration_liters: number;
}

export interface RiskFactor {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  probability: number;
  actions: string[];
}

export interface ActionPriority {
  action: string;
  category: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  impact: string;
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

export interface PeriodOption {
  label: string;
  value: number;
  icon: string;
}