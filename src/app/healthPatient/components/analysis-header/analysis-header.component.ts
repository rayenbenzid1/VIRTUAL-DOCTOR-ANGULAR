// src/app/healthPatient/components/analysis-header/analysis-header.component.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analysis-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analysis-header-card" [style.background]="cardBackground()">
      <div class="score-section">
        <div class="score-badge">
          <span class="badge-label">Score de Santé</span>
          <span class="badge-score">{{ healthScore() }}</span>
          <span class="badge-max">/100</span>
        </div>
        
        <div class="risk-badge" [style.background]="riskColor()">
          <span class="risk-icon">{{ getRiskIcon() }}</span>
          <span class="risk-label">Risque {{ riskLevel() }}</span>
        </div>
      </div>

      <div class="date-section">
        <span class="date-label">Données du</span>
        <span class="date-value">{{ analysisDate() | date:'dd/MM/yyyy' }}</span>
      </div>
    </div>
  `,
  styles: [`
    .analysis-header-card {
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
    }

    .analysis-header-card::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
      animation: pulse 4s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }

    .score-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      position: relative;
      z-index: 1;
    }

    .score-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 32px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .badge-label {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    .badge-score {
      font-size: 48px;
      font-weight: 800;
      color: #1e293b;
      line-height: 1;
    }

    .badge-max {
      font-size: 16px;
      font-weight: 600;
      color: #94a3b8;
    }

    .risk-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 12px;
      color: white;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .risk-icon {
      font-size: 20px;
    }

    .risk-label {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .date-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 12px;
      position: relative;
      z-index: 1;
    }

    .date-label {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .date-value {
      font-size: 14px;
      color: #1e293b;
      font-weight: 700;
    }

    @media (max-width: 640px) {
      .score-section {
        flex-direction: column;
        gap: 16px;
      }

      .score-badge {
        width: 100%;
      }

      .risk-badge {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class AnalysisHeaderComponent {
  healthScore = input.required<number>();
  riskLevel = input.required<string>();
  analysisDate = input.required<string>();

  cardBackground = () => {
    const color = this.riskColor();
    return `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`;
  };

  riskColor = () => {
    const level = this.riskLevel().toLowerCase();
    if (level === 'critique') return '#ef4444';
    if (level === 'élevé') return '#f59e0b';
    if (level === 'modéré') return '#3b82f6';
    return '#10b981';
  };

  getRiskIcon(): string {
    const level = this.riskLevel().toLowerCase();
    if (level === 'critique') return '🔴';
    if (level === 'élevé') return '🟠';
    if (level === 'modéré') return '🔵';
    return '🟢';
  }
}