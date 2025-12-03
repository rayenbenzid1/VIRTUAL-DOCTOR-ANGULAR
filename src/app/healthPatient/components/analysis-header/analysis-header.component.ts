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
        <span class="date-value">{{ analysisDate() | date : 'dd/MM/yyyy' }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      .analysis-header-card {
        background: white;
        border-radius: 20px;
        padding: 32px;
        margin-bottom: 28px;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        position: relative;
        overflow: hidden;
        border: 2px solid #e2e8f0;
      }

      .score-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        position: relative;
        z-index: 1;
        gap: 24px;
      }

      .score-badge {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px 40px;
        border-radius: 16px;
        background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border: 2px solid #e2e8f0;
      }

      .badge-label {
        font-size: 12px;
        font-weight: 700;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 12px;
      }

      .badge-score {
        font-size: 56px;
        font-weight: 900;
        color: #1e293b;
        line-height: 1;
        letter-spacing: -2px;
      }

      .badge-max {
        font-size: 18px;
        font-weight: 700;
        color: #94a3b8;
        margin-top: 4px;
      }

      .risk-badge {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 24px;
        border-radius: 12px;
        color: white;
        font-weight: 800;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 14px;
      }

      .date-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px 24px;
        background: #f8fafc;
        border-radius: 12px;
        position: relative;
        z-index: 1;
        border: 2px solid #e2e8f0;
      }

      .date-label {
        font-size: 11px;
        color: #64748b;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 6px;
      }

      .date-value {
        font-size: 15px;
        color: #1e293b;
        font-weight: 800;
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
