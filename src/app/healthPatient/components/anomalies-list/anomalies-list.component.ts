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
  styles: [`
    .anomalies-section {
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

    .no-anomalies {
      text-align: center;
      padding: 40px 20px;
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border-radius: 16px;
    }

    .success-icon {
      font-size: 48px;
      display: block;
      margin-bottom: 16px;
    }

    .success-message {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 700;
      color: #059669;
    }

    .success-subtitle {
      margin: 0;
      font-size: 14px;
      color: #10b981;
    }

    .anomalies-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .anomaly-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-radius: 12px;
      border-left: 4px solid;
      transition: all 0.3s ease;
    }

    .anomaly-item:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .anomaly-item.critical {
      background: #fef2f2;
      border-color: #ef4444;
    }

    .anomaly-item.warning {
      background: #fffbeb;
      border-color: #f59e0b;
    }

    .anomaly-icon {
      font-size: 24px;
      flex-shrink: 0;
    }

    .anomaly-text {
      flex: 1;
      color: #1e293b;
      font-weight: 500;
      font-size: 14px;
      line-height: 1.5;
    }
  `]
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