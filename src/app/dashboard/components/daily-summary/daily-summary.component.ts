// src/app/dashboard/components/daily-summary/daily-summary.component.ts
import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiometricData } from '../../services/biometric.api';

interface HealthMetric {
  id: string;
  icon: string;
  label: string;
  value: string;
  color: string;
  status: 'good' | 'warning' | 'danger' | 'neutral';
  details: string;
}

@Component({
  selector: 'app-daily-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="daily-summary">
      <div class="section-header">
        <span class="section-icon">📊</span>
        <h2>Résumé du Jour</h2>
        <span class="date-badge">{{ currentDate }}</span>
      </div>

      <div class="metrics-grid">
        <div 
          class="metric-card"
          *ngFor="let metric of metrics()"
          [style.background-color]="metric.color"
          [class.status-good]="metric.status === 'good'"
          [class.status-warning]="metric.status === 'warning'"
          [class.status-danger]="metric.status === 'danger'"
          [attr.data-status]="metric.status">
          
          <div class="metric-header">
            <div class="metric-icon">{{ metric.icon }}</div>
            <div class="status-indicator" [attr.data-status]="metric.status"></div>
          </div>
          
          <div class="metric-label">{{ metric.label }}</div>
          <div class="metric-value">{{ metric.value }}</div>
          
          <div class="metric-details">{{ metric.details }}</div>
        </div>
      </div>

      <div class="summary-info" *ngIf="!data">
        <svg class="info-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <p>En attente de synchronisation avec vos appareils...</p>
      </div>
    </div>
  `,
  styles: [`
    .daily-summary {
      background: white;
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
      margin-bottom: 24px;
    }

    .daily-summary:hover {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 28px;
      padding-bottom: 16px;
      border-bottom: 2px solid #f1f5f9;
      flex-wrap: wrap;
    }

    .section-icon {
      font-size: 28px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }

    .section-header h2 {
      font-size: 20px;
      font-weight: 700;
      margin: 0;
      color: #0f172a;
      flex: 1;
    }

    .date-badge {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 20px;
    }

    .metric-card {
      padding: 24px;
      border-radius: 16px;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      border: 2px solid transparent;
      position: relative;
      overflow: hidden;
    }

    .metric-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .metric-card:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      border-color: rgba(99, 102, 241, 0.3);
    }

    .metric-card:hover::before {
      opacity: 1;
    }

    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      position: relative;
      z-index: 1;
    }

    .metric-icon {
      font-size: 36px;
      transition: transform 0.3s ease;
    }

    .metric-card:hover .metric-icon {
      transform: scale(1.15) rotate(5deg);
    }

    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      position: relative;
      animation: pulse 2s ease-in-out infinite;
    }

    .status-indicator[data-status="good"] {
      background: #10b981;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    }

    .status-indicator[data-status="warning"] {
      background: #f59e0b;
      box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
    }

    .status-indicator[data-status="danger"] {
      background: #ef4444;
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }

    .status-indicator[data-status="neutral"] {
      background: #94a3b8;
      box-shadow: 0 0 0 0 rgba(148, 163, 184, 0.7);
    }

    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 0 0 0 currentColor;
      }
      50% {
        box-shadow: 0 0 0 8px transparent;
      }
    }

    .metric-label {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      position: relative;
      z-index: 1;
    }

    .metric-value {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      position: relative;
      z-index: 1;
      margin-bottom: 8px;
    }

    .metric-details {
      font-size: 11px;
      color: #64748b;
      position: relative;
      z-index: 1;
      font-weight: 500;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .metric-card:hover .metric-details {
      opacity: 1;
    }

    .summary-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 12px;
      border: 2px dashed #cbd5e1;
      margin-top: 20px;
    }

    .info-icon {
      color: #6366f1;
      flex-shrink: 0;
    }

    .summary-info p {
      margin: 0;
      color: #64748b;
      font-size: 14px;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }

      .daily-summary {
        padding: 24px 20px;
      }
    }

    @media (max-width: 480px) {
      .metric-value {
        font-size: 18px;
      }

      .metric-icon {
        font-size: 30px;
      }
    }
  `]
})
export class DailySummaryComponent {
  @Input() data: BiometricData | null = null;

  currentDate = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  metrics = computed<HealthMetric[]>(() => {
    const d = this.data;
    
    return [
      {
        id: 'steps',
        icon: '👣',
        label: 'Pas',
        value: d?.totalSteps ? d.totalSteps.toLocaleString() : '0',
        color: '#e8f5e9',
        status: this.getStepsStatus(d?.totalSteps),
        details: this.getStepsDetails(d?.totalSteps)
      },
      {
        id: 'distance',
        icon: '📏',
        label: 'Distance',
        value: d?.totalDistanceKm ? `${parseFloat(d.totalDistanceKm).toFixed(2)} km` : '0.00 km',
        color: '#e3f2fd',
        status: this.getDistanceStatus(d?.totalDistanceKm),
        details: this.getDistanceDetails(d?.totalDistanceKm)
      },
      {
        id: 'bpm',
        icon: '❤️',
        label: 'Fréquence Cardiaque',
        value: d?.avgHeartRate ? `${d.avgHeartRate} bpm` : '-- bpm',
        color: '#fce4ec',
        status: this.getHeartRateStatus(d?.avgHeartRate),
        details: this.getHeartRateDetails(d?.avgHeartRate, d?.minHeartRate, d?.maxHeartRate)
      },
      {
        id: 'sleep',
        icon: '💤',
        label: 'Sommeil',
        value: d?.totalSleepHours ? `${parseFloat(d.totalSleepHours).toFixed(1)}h` : '0.0h',
        color: '#f3e5f5',
        status: this.getSleepStatus(d?.totalSleepHours),
        details: this.getSleepDetails(d?.totalSleepHours)
      },
      {
        id: 'hydration',
        icon: '💧',
        label: 'Hydratation',
        value: d?.totalHydrationLiters ? `${parseFloat(d.totalHydrationLiters).toFixed(2)} L` : '0.00 L',
        color: '#e0f7fa',
        status: this.getHydrationStatus(d?.totalHydrationLiters),
        details: this.getHydrationDetails(d?.totalHydrationLiters)
      },
      {
        id: 'stress',
        icon: '🧠',
        label: 'Niveau de Stress',
        value: d?.stressLevel || '--',
        color: '#fff3e0',
        status: this.getStressStatus(d?.stressLevel),
        details: this.getStressDetails(d?.stressLevel, d?.stressScore)
      }
    ];
  });

  // Méthodes de statut pour les pas
  private getStepsStatus(steps?: number): 'good' | 'warning' | 'danger' | 'neutral' {
    if (!steps) return 'neutral';
    if (steps >= 10000) return 'good';
    if (steps >= 5000) return 'warning';
    return 'danger';
  }

  private getStepsDetails(steps?: number): string {
    if (!steps) return 'Aucune donnée';
    if (steps >= 10000) return 'Objectif atteint ! 🎉';
    if (steps >= 5000) return `Plus que ${10000 - steps} pas`;
    return 'Restez actif !';
  }

  // Méthodes de statut pour la distance
  private getDistanceStatus(distance?: string): 'good' | 'warning' | 'danger' | 'neutral' {
    if (!distance) return 'neutral';
    const dist = parseFloat(distance);
    if (dist >= 8) return 'good';
    if (dist >= 4) return 'warning';
    return 'danger';
  }

  private getDistanceDetails(distance?: string): string {
    if (!distance) return 'Aucune donnée';
    const dist = parseFloat(distance);
    if (dist >= 8) return 'Excellente distance !';
    if (dist >= 4) return 'Bonne activité';
    return 'Bougez plus !';
  }

  // Méthodes de statut pour la fréquence cardiaque
  private getHeartRateStatus(bpm?: number): 'good' | 'warning' | 'danger' | 'neutral' {
    if (!bpm) return 'neutral';
    if (bpm >= 60 && bpm <= 100) return 'good';
    if (bpm >= 50 && bpm <= 110) return 'warning';
    return 'danger';
  }

  private getHeartRateDetails(avg?: number, min?: number, max?: number): string {
    if (!avg) return 'Aucune donnée';
    if (avg >= 60 && avg <= 100) return `Min: ${min || '--'} | Max: ${max || '--'}`;
    if (avg < 60) return 'Fréquence basse';
    return 'Fréquence élevée';
  }

  // Méthodes de statut pour le sommeil
  private getSleepStatus(hours?: string): 'good' | 'warning' | 'danger' | 'neutral' {
    if (!hours) return 'neutral';
    const h = parseFloat(hours);
    if (h >= 7 && h <= 9) return 'good';
    if (h >= 6 && h <= 10) return 'warning';
    return 'danger';
  }

  private getSleepDetails(hours?: string): string {
    if (!hours) return 'Aucune donnée';
    const h = parseFloat(hours);
    if (h >= 7 && h <= 9) return 'Sommeil optimal 😴';
    if (h < 7) return 'Dormez plus';
    return 'Trop de sommeil';
  }

  // Méthodes de statut pour l'hydratation
  private getHydrationStatus(liters?: string): 'good' | 'warning' | 'danger' | 'neutral' {
    if (!liters) return 'neutral';
    const l = parseFloat(liters);
    if (l >= 2.0) return 'good';
    if (l >= 1.0) return 'warning';
    return 'danger';
  }

  private getHydrationDetails(liters?: string): string {
    if (!liters) return 'Aucune donnée';
    const l = parseFloat(liters);
    if (l >= 2.0) return 'Bien hydraté ! 💧';
    if (l >= 1.0) return `Buvez ${(2.0 - l).toFixed(1)}L de plus`;
    return 'Buvez plus d\'eau !';
  }

  // Méthodes de statut pour le stress
  private getStressStatus(level?: string): 'good' | 'warning' | 'danger' | 'neutral' {
    if (!level) return 'neutral';
    const l = level.toLowerCase();
    if (l.includes('low') || l.includes('faible')) return 'good';
    if (l.includes('medium') || l.includes('moyen')) return 'warning';
    return 'danger';
  }

  private getStressDetails(level?: string, score?: number): string {
    if (!level) return 'Aucune donnée';
    if (score !== undefined) return `Score: ${score}/100`;
    return level;
  }
}