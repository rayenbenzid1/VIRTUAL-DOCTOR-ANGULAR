// src/app/dashboard/components/vital-signs/vital-signs.component.ts
import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiometricData } from '../../services/biometric.api';

interface VitalSign {
  icon: string;
  label: string;
  value: string;
  color: string;
  status: 'good' | 'warning' | 'danger' | 'neutral';
  details: string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
}

@Component({
  selector: 'app-vital-signs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="vital-signs-section">
      <div class="section-header">
        <span class="section-icon">🩺</span>
        <h2>Signes Vitaux</h2>
        <span class="vitals-count" *ngIf="vitalSigns().length > 0">
          {{ vitalSigns().length }} mesures
        </span>
      </div>

      <div class="vitals-grid">
        <div 
          class="vital-card"
          *ngFor="let vital of vitalSigns()"
          [attr.data-status]="vital.status">
          
          <div class="vital-header">
            <div class="vital-icon-wrapper">
              <span class="vital-icon">{{ vital.icon }}</span>
              <div class="status-pulse" [attr.data-status]="vital.status"></div>
            </div>
            <div class="trend-indicator" *ngIf="vital.trend">
              <svg 
                *ngIf="vital.trend === 'up'" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
              <svg 
                *ngIf="vital.trend === 'down'" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              <svg 
                *ngIf="vital.trend === 'stable'" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
          </div>

          <div class="vital-content">
            <div class="vital-label">{{ vital.label }}</div>
            <div class="vital-value-wrapper">
              <span class="vital-value">{{ vital.value }}</span>
              <span class="vital-unit" *ngIf="vital.unit">{{ vital.unit }}</span>
            </div>
            <div class="vital-details">{{ vital.details }}</div>
          </div>

          <div class="status-bar" [attr.data-status]="vital.status">
            <div class="status-fill"></div>
          </div>
        </div>
      </div>

      <div class="no-vitals" *ngIf="vitalSigns().length === 0">
        <div class="no-vitals-icon">🩺</div>
        <h3>Aucun signe vital enregistré</h3>
        <p>Les mesures apparaîtront ici une fois synchronisées</p>
      </div>
    </div>
  `,
  styles: [`
    .vital-signs-section {
      background: white;
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
      margin-bottom: 24px;
    }

    .vital-signs-section:hover {
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

    .vitals-count {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
    }

    .vitals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      align-items: stretch;
    }

    .vital-card {
      background: linear-gradient(135deg, #fafbff 0%, #f8fafc 100%);
      border-radius: 16px;
      padding: 24px;
      position: relative;
      overflow: hidden;
      border: 2px solid #e2e8f0;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      min-height: 200px;
    }

    .vital-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .vital-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
      border-color: #c7d2fe;
    }

    .vital-card:hover::before {
      opacity: 1;
    }

    .vital-card[data-status="good"] {
      border-color: #bbf7d0;
    }

    .vital-card[data-status="warning"] {
      border-color: #fed7aa;
    }

    .vital-card[data-status="danger"] {
      border-color: #fecaca;
    }

    .vital-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
      position: relative;
      z-index: 1;
    }

    .vital-icon-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .vital-icon {
      font-size: 48px;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
      transition: transform 0.4s ease;
    }

    .vital-card:hover .vital-icon {
      transform: scale(1.15) rotate(-5deg);
    }

    .status-pulse {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      animation: pulse-wave 2s ease-in-out infinite;
    }

    .status-pulse[data-status="good"] {
      background: #10b981;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    }

    .status-pulse[data-status="warning"] {
      background: #f59e0b;
      box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
    }

    .status-pulse[data-status="danger"] {
      background: #ef4444;
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }

    .status-pulse[data-status="neutral"] {
      background: #94a3b8;
      box-shadow: 0 0 0 0 rgba(148, 163, 184, 0.7);
    }

    @keyframes pulse-wave {
      0%, 100% {
        box-shadow: 0 0 0 0 currentColor;
      }
      50% {
        box-shadow: 0 0 0 10px transparent;
      }
    }

    .trend-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: rgba(99, 102, 241, 0.1);
      border-radius: 8px;
      color: #6366f1;
      transition: all 0.3s ease;
    }

    .vital-card:hover .trend-indicator {
      background: rgba(99, 102, 241, 0.15);
      transform: scale(1.1);
    }

    .vital-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      z-index: 1;
    }

    .vital-label {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
    }

    .vital-value-wrapper {
      display: flex;
      align-items: baseline;
      gap: 6px;
      margin-bottom: 10px;
    }

    .vital-value {
      font-size: 32px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
    }

    .vital-unit {
      font-size: 16px;
      font-weight: 600;
      color: #64748b;
    }

    .vital-details {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
      opacity: 0;
      transform: translateY(-5px);
      transition: all 0.3s ease;
    }

    .vital-card:hover .vital-details {
      opacity: 1;
      transform: translateY(0);
    }

    .status-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: #e2e8f0;
      overflow: hidden;
    }

    .status-fill {
      height: 100%;
      width: 100%;
      transform: translateX(-100%);
      transition: transform 0.6s ease;
    }

    .vital-card:hover .status-fill {
      transform: translateX(0);
    }

    .status-bar[data-status="good"] .status-fill {
      background: linear-gradient(90deg, #10b981, #059669);
    }

    .status-bar[data-status="warning"] .status-fill {
      background: linear-gradient(90deg, #f59e0b, #d97706);
    }

    .status-bar[data-status="danger"] .status-fill {
      background: linear-gradient(90deg, #ef4444, #dc2626);
    }

    .status-bar[data-status="neutral"] .status-fill {
      background: linear-gradient(90deg, #94a3b8, #64748b);
    }

    .no-vitals {
      text-align: center;
      padding: 60px 20px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 16px;
      border: 2px dashed #cbd5e1;
    }

    .no-vitals-icon {
      font-size: 64px;
      margin-bottom: 20px;
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .no-vitals h3 {
      font-size: 20px;
      color: #0f172a;
      margin: 0 0 12px 0;
      font-weight: 700;
    }

    .no-vitals p {
      color: #64748b;
      font-size: 15px;
      margin: 0;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .vitals-grid {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .vital-signs-section {
        padding: 24px 20px;
      }

      .vitals-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }

      .vital-card {
        min-height: 180px;
        padding: 20px;
      }

      .vital-icon {
        font-size: 40px;
      }

      .vital-value {
        font-size: 28px;
      }
    }

    @media (max-width: 480px) {
      .vitals-grid {
        grid-template-columns: 1fr;
      }

      .vital-card {
        min-height: 160px;
      }
    }
  `]
})
export class VitalSignsComponent {
  @Input() data: BiometricData | null = null;

  vitalSigns = computed<VitalSign[]>(() => {
    const d = this.data;
    const signs: VitalSign[] = [];

    // SpO₂ (Saturation en oxygène)
    const lastOxygen = d?.oxygenSaturation?.[d.oxygenSaturation.length - 1];
    if (lastOxygen?.percentage) {
      signs.push({
        icon: '🫁',
        label: 'SpO₂',
        value: lastOxygen.percentage.toString(),
        unit: '%',
        color: '#e3f2fd',
        status: this.getOxygenStatus(lastOxygen.percentage),
        details: this.getOxygenDetails(lastOxygen.percentage),
        trend: this.getOxygenTrend(d?.oxygenSaturation)
      });
    }

    // Température corporelle
    const lastTemperature = d?.bodyTemperature?.[d.bodyTemperature.length - 1];
    if (lastTemperature?.temperature) {
      signs.push({
        icon: '🌡️',
        label: 'Température',
        value: lastTemperature.temperature.toFixed(2),
        unit: '°C',
        color: '#fff3e0',
        status: this.getTemperatureStatus(lastTemperature.temperature),
        details: this.getTemperatureDetails(lastTemperature.temperature),
        trend: this.getTemperatureTrend(d?.bodyTemperature)
      });
    }

    // Tension artérielle
    const lastBloodPressure = d?.bloodPressure?.[d.bloodPressure.length - 1];
    if (lastBloodPressure) {
      signs.push({
        icon: '💉',
        label: 'Tension',
        value: `${lastBloodPressure.systolic}/${lastBloodPressure.diastolic}`,
        unit: 'mmHg',
        color: '#fce4ec',
        status: this.getBloodPressureStatus(lastBloodPressure.systolic, lastBloodPressure.diastolic),
        details: this.getBloodPressureDetails(lastBloodPressure.systolic, lastBloodPressure.diastolic),
        trend: 'stable'
      });
    }

    // Poids
    const lastWeight = d?.weight?.[d.weight.length - 1];
    if (lastWeight?.weight) {
      signs.push({
        icon: '⚖️',
        label: 'Poids',
        value: lastWeight.weight.toFixed(2),
        unit: 'kg',
        color: '#e8f5e9',
        status: 'neutral',
        details: 'Mesure récente',
        trend: this.getWeightTrend(d?.weight)
      });
    }

    // Taille
    const lastHeight = d?.height?.[d.height.length - 1];
    if (lastHeight?.height) {
      signs.push({
        icon: '📏',
        label: 'Taille',
        value: (lastHeight.height * 100).toFixed(0),
        unit: 'cm',
        color: '#f3e5f5',
        status: 'neutral',
        details: 'Mesure stable',
        trend: 'stable'
      });
    }

    return signs;
  });

  // Méthodes de statut pour SpO₂
  private getOxygenStatus(percentage: number): 'good' | 'warning' | 'danger' | 'neutral' {
    if (percentage >= 95) return 'good';
    if (percentage >= 90) return 'warning';
    return 'danger';
  }

  private getOxygenDetails(percentage: number): string {
    if (percentage >= 95) return 'Oxygénation optimale';
    if (percentage >= 90) return 'Oxygénation acceptable';
    return 'Oxygénation faible';
  }

  private getOxygenTrend(data?: any[]): 'up' | 'down' | 'stable' | undefined {
    if (!data || data.length < 2) return undefined;
    const current = data[data.length - 1].percentage;
    const previous = data[data.length - 2].percentage;
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  }

  // Méthodes de statut pour la température
  private getTemperatureStatus(temp: number): 'good' | 'warning' | 'danger' | 'neutral' {
    if (temp >= 36.1 && temp <= 37.2) return 'good';
    if ((temp >= 35.5 && temp < 36.1) || (temp > 37.2 && temp <= 38)) return 'warning';
    return 'danger';
  }

  private getTemperatureDetails(temp: number): string {
    if (temp >= 36.1 && temp <= 37.2) return 'Température normale';
    if (temp < 36.1) return 'Hypothermie légère';
    if (temp > 37.2 && temp <= 38) return 'Légère fièvre';
    return 'Fièvre';
  }

  private getTemperatureTrend(data?: any[]): 'up' | 'down' | 'stable' | undefined {
    if (!data || data.length < 2) return undefined;
    const current = data[data.length - 1].temperature;
    const previous = data[data.length - 2].temperature;
    const diff = current - previous;
    if (diff > 0.2) return 'up';
    if (diff < -0.2) return 'down';
    return 'stable';
  }

  // Méthodes de statut pour la tension
  private getBloodPressureStatus(systolic: number, diastolic: number): 'good' | 'warning' | 'danger' | 'neutral' {
    if (systolic >= 90 && systolic <= 120 && diastolic >= 60 && diastolic <= 80) return 'good';
    if (systolic >= 120 && systolic <= 140 || diastolic >= 80 && diastolic <= 90) return 'warning';
    return 'danger';
  }

  private getBloodPressureDetails(systolic: number, diastolic: number): string {
    if (systolic >= 90 && systolic <= 120 && diastolic >= 60 && diastolic <= 80) return 'Tension normale';
    if (systolic >= 120 && systolic <= 140) return 'Pré-hypertension';
    if (systolic > 140) return 'Hypertension';
    return 'Hypotension';
  }

  // Méthode de tendance pour le poids
  private getWeightTrend(data?: any[]): 'up' | 'down' | 'stable' | undefined {
    if (!data || data.length < 2) return undefined;
    const current = data[data.length - 1].weight;
    const previous = data[data.length - 2].weight;
    const diff = current - previous;
    if (diff > 0.5) return 'up';
    if (diff < -0.5) return 'down';
    return 'stable';
  }
}