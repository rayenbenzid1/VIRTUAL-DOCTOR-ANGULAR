// src/app/healthPatient/components/health-insights/health-insights.component.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthInsights } from '../../models/analysis.models';

@Component({
  selector: 'app-health-insights',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="insights-section">
      <h2 class="section-title">
        <span class="section-icon">📋</span>
        Détails des Métriques
      </h2>

      <div class="insights-grid">
        <!-- Activity -->
        <div class="insight-card">
          <div class="card-header">
            <span class="card-icon" style="background: #10b98120; color: #10b981">🚶</span>
            <h3 class="card-title">Activité Physique</h3>
          </div>
          <div class="card-body">
            <div class="metric-row">
              <span class="metric-label">Pas</span>
              <span class="metric-value">{{ insights().activity_details.steps | number }}</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Distance</span>
              <span class="metric-value">{{ insights().activity_details.distance_km }} km</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Exercices</span>
              <span class="metric-value">{{ insights().activity_details.exercises_count }} session(s)</span>
            </div>
          </div>
        </div>

        <!-- Cardiovascular -->
        <div class="insight-card">
          <div class="card-header">
            <span class="card-icon" style="background: #ef444420; color: #ef4444">❤️</span>
            <h3 class="card-title">Santé Cardiovasculaire</h3>
          </div>
          <div class="card-body">
            <div class="metric-row">
              <span class="metric-label">FC Moyenne</span>
              <span class="metric-value">{{ insights().cardiovascular_details.avg_heart_rate }} bpm</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Variabilité FC</span>
              <span class="metric-value">{{ insights().cardiovascular_details.hr_variability }} bpm</span>
            </div>
          </div>
        </div>

        <!-- Sleep -->
        <div class="insight-card">
          <div class="card-header">
            <span class="card-icon" style="background: #3b82f620; color: #3b82f6">💤</span>
            <h3 class="card-title">Sommeil</h3>
          </div>
          <div class="card-body">
            <div class="metric-row">
              <span class="metric-label">Durée</span>
              <span class="metric-value">{{ insights().sleep_details.hours }}h</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Qualité</span>
              <span class="metric-value" 
                    [style.color]="getSleepQualityColor(insights().sleep_details.quality)">
                {{ insights().sleep_details.quality }}
              </span>
            </div>
          </div>
        </div>

        <!-- Stress -->
        <div class="insight-card">
          <div class="card-header">
            <span class="card-icon" style="background: #f59e0b20; color: #f59e0b">🧠</span>
            <h3 class="card-title">Niveau de Stress</h3>
          </div>
          <div class="card-body">
            <div class="metric-row">
              <span class="metric-label">Niveau</span>
              <span class="metric-value">{{ insights().stress_details.level }}</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Score</span>
              <span class="metric-value">{{ insights().stress_details.score }}/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .insights-section {
      background: white;
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 20px 0;
    }

    .section-icon {
      font-size: 24px;
    }

    .insights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }

    .insight-card {
      background: #f8fafc;
      border-radius: 16px;
      padding: 20px;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .insight-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      border-color: #8b5cf6;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .card-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .card-title {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
    }

    .card-body {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .metric-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: white;
      border-radius: 8px;
    }

    .metric-label {
      font-size: 13px;
      color: #64748b;
      font-weight: 600;
    }

    .metric-value {
      font-size: 14px;
      color: #1e293b;
      font-weight: 700;
    }

    @media (max-width: 640px) {
      .insights-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HealthInsightsComponent {
  insights = input.required<HealthInsights>();

  getSleepQualityColor(quality: string): string {
    return quality === 'Optimal' ? '#10b981' : '#f59e0b';
  }
}