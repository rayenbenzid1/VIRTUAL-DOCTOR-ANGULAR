// src/app/healthPatient/components/anomalies-list/anomalies-list.component.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-anomalies-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="anomalies-section">
      <h2 class="section-title">
        <span class="section-icon">⚠️</span>
        Anomalies Détectées
      </h2>

      @if (anomalies().length === 0) {
      <div class="no-anomalies">
        <span class="success-icon">✅</span>
        <p class="success-message">Aucune anomalie détectée</p>
        <p class="success-subtitle">Toutes vos métriques sont dans les normes</p>
      </div>
      } @else {
      <div class="anomalies-list">
        @for (anomaly of anomalies(); track $index) {
        <div class="anomaly-item" [class]="getAnomalyClass(anomaly)">
          <span class="anomaly-icon">{{ getAnomalyIcon(anomaly) }}</span>
          <span class="anomaly-text">{{ anomaly }}</span>
        </div>
        }
      </div>
      }
    </div>
  `,
  styles: [
    `
      .anomalies-section {
        background: white;
        border-radius: 20px;
        padding: 32px;
        margin-bottom: 28px;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      }

      .no-anomalies {
        text-align: center;
        padding: 48px 28px;
        background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
        border-radius: 16px;
        border: 2px solid #a7f3d0;
      }

      .success-icon {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: #10b981;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 36px;
        font-weight: 900;
      }

      .success-message {
        margin: 0 0 8px 0;
        font-size: 20px;
        font-weight: 800;
        color: #059669;
        letter-spacing: -0.5px;
      }

      .success-subtitle {
        margin: 0;
        font-size: 15px;
        color: #10b981;
        font-weight: 600;
      }

      .anomalies-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .anomaly-item {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 20px 24px;
        border-radius: 16px;
        border-left: 4px solid;
        transition: all 0.3s ease;
      }

      .anomaly-item:hover {
        transform: translateX(8px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      }

      .anomaly-item.critical {
        background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
        border-color: #ef4444;
      }

      .anomaly-item.warning {
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        border-color: #f59e0b;
      }

      .anomaly-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 900;
        flex-shrink: 0;
      }

      .anomaly-item.critical .anomaly-icon {
        background: #ef4444;
        color: white;
      }

      .anomaly-item.warning .anomaly-icon {
        background: #f59e0b;
        color: white;
      }

      .anomaly-text {
        flex: 1;
        color: #1e293b;
        font-weight: 600;
        font-size: 15px;
        line-height: 1.6;
      }
      @media (max-width: 768px) {
        .breakdown-grid,
        .recommendations-grid {
          grid-template-columns: 1fr;
        }

        .score-section {
          flex-direction: column;
          align-items: stretch;
        }

        .header-content {
          flex-direction: column;
          text-align: center;
        }
      }
    `,
  ],
})
export class AnomaliesListComponent {
  anomalies = input.required<string[]>();

  getAnomalyClass(anomaly: string): string {
    if (anomaly.includes('🚨') || anomaly.includes('URGENCE') || anomaly.includes('ALERTE')) {
      return 'critical';
    }
    return 'warning';
  }

  getAnomalyIcon(anomaly: string): string {
    if (anomaly.includes('🚨') || anomaly.includes('URGENCE')) {
      return '🚨';
    }
    return '⚠️';
  }
}
