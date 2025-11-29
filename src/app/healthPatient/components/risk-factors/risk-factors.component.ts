import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiskFactor } from '../../services/risk-alerts.api';

@Component({
  selector: 'app-risk-factors',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="risk-factors-section">
      <h2 class="section-title">
        <span class="section-icon">⚠️</span>
        Facteurs de Risque
      </h2>

      <div class="risk-factors-list">
        @for (factor of riskFactors(); track $index) {
        <div class="risk-factor-card" [class]="'severity-' + factor.severity">
          <div class="factor-header">
            <div class="factor-badge" [class]="'badge-' + factor.severity">
              {{ getSeverityLabel(factor.severity) }}
            </div>
            <div class="factor-probability">{{ factor.probability }}%</div>
          </div>

          <h3 class="factor-title">{{ getFactorIcon(factor.type) }} {{ getFactorTitle(factor.type) }}</h3>
          <p class="factor-description">{{ factor.description }}</p>

          <div class="factor-actions">
            <div class="actions-header">
              <span class="actions-icon">💡</span>
              <span class="actions-title">Actions recommandées</span>
            </div>
            <ul class="actions-list">
              @for (action of factor.actions; track $index) {
              <li>{{ action }}</li>
              }
            </ul>
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .risk-factors-section {
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

    .risk-factors-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .risk-factor-card {
      background: #f8fafc;
      border-radius: 16px;
      padding: 20px;
      border-left: 4px solid;
      transition: all 0.3s ease;
    }

    .risk-factor-card:hover {
      transform: translateX(4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    }

    .risk-factor-card.severity-critical {
      border-color: #ef4444;
      background: #fef2f2;
    }

    .risk-factor-card.severity-high {
      border-color: #f59e0b;
      background: #fffbeb;
    }

    .risk-factor-card.severity-medium {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .risk-factor-card.severity-low {
      border-color: #10b981;
      background: #ecfdf5;
    }

    .factor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .factor-badge {
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-critical {
      background: #ef4444;
      color: white;
    }

    .badge-high {
      background: #f59e0b;
      color: white;
    }

    .badge-medium {
      background: #3b82f6;
      color: white;
    }

    .badge-low {
      background: #10b981;
      color: white;
    }

    .factor-probability {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
    }

    .factor-title {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .factor-description {
      color: #475569;
      font-size: 14px;
      margin: 0 0 16px 0;
      line-height: 1.5;
    }

    .factor-actions {
      background: white;
      border-radius: 12px;
      padding: 16px;
    }

    .actions-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .actions-icon {
      font-size: 18px;
    }

    .actions-title {
      font-size: 13px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .actions-list {
      margin: 0;
      padding-left: 20px;
      list-style: none;
    }

    .actions-list li {
      position: relative;
      padding-left: 8px;
      margin-bottom: 8px;
      color: #334155;
      font-size: 14px;
      line-height: 1.5;
    }

    .actions-list li::before {
      content: '•';
      position: absolute;
      left: -12px;
      color: #4f46e5;
      font-weight: 700;
    }

    .actions-list li:last-child {
      margin-bottom: 0;
    }
  `]
})
export class RiskFactorsComponent {
  riskFactors = input.required<RiskFactor[]>();

  getSeverityLabel(severity: string): string {
    const labels: Record<string, string> = {
      'critical': 'CRITIQUE',
      'high': 'HAUTE',
      'medium': 'MOYENNE',
      'low': 'FAIBLE'
    };
    return labels[severity] || severity.toUpperCase();
  }

  getFactorIcon(type: string): string {
    const icons: Record<string, string> = {
      'sleep_deprivation': '💤',
      'sleep_insufficient': '😴',
      'severe_inactivity': '🛋️',
      'low_activity': '🚶',
      'high_stress': '😰',
      'moderate_stress': '😐',
      'dehydration': '💧',
      'critical_oxygen': '🫁',
      'high_fever': '🌡️'
    };
    return icons[type] || '⚠️';
  }

  getFactorTitle(type: string): string {
    const titles: Record<string, string> = {
      'sleep_deprivation': 'Sleep Deprivation',
      'sleep_insufficient': 'Sommeil insuffisant',
      'severe_inactivity': 'Sédentarité extrême',
      'low_activity': 'Activité insuffisante',
      'high_stress': 'Stress très élevé',
      'moderate_stress': 'Stress modéré',
      'dehydration': 'Déshydratation',
      'critical_oxygen': 'Oxygénation critique',
      'high_fever': 'Fièvre élevée'
    };
    return titles[type] || type.replace(/_/g, ' ');
  }
}