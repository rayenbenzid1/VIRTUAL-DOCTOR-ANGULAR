import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerts-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert-level-card" [style.background]="cardBackground()">
      <div class="alert-badge" [style.background]="alertLevelColor()">
        <span class="badge-text">Niveau d'alerte</span>
        <span class="badge-level">{{ alertLevel() }}</span>
      </div>
      
      <div class="alert-info">
        <div class="info-item">
          <span class="info-label">Période:</span>
          <span class="info-value">{{ analysisPeriod() }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Type:</span>
          <span class="info-value">{{ analysisType() }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Points analysés:</span>
          <span class="info-value">{{ dataPointsAnalyzed() }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .alert-level-card {
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
    }

    .alert-level-card::before {
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

    .alert-badge {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 32px;
      border-radius: 16px;
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      position: relative;
      z-index: 1;
      margin-bottom: 20px;
    }

    .badge-text {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.9;
    }

    .badge-level {
      font-size: 32px;
      font-weight: 800;
      margin-top: 4px;
    }

    .alert-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      position: relative;
      z-index: 1;
    }

    .info-item {
      background: rgba(255, 255, 255, 0.9);
      padding: 16px;
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }

    .info-label {
      display: block;
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      display: block;
      font-size: 16px;
      color: #1e293b;
      font-weight: 700;
    }

    @media (max-width: 640px) {
      .alert-info {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AlertsHeaderComponent {
  alertLevel = input.required<string>();
  alertLevelColor = input.required<string>();
  analysisPeriod = input.required<string>();
  analysisType = input.required<string>();
  dataPointsAnalyzed = input.required<number>();

  cardBackground = () => {
    const color = this.alertLevelColor();
    return `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`;
  };
}