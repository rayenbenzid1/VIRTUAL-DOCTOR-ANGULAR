// src/app/dashboard/components/data-summary/data-summary.component.ts
import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiometricData } from '../../services/biometric.api';

interface DataPoint {
  icon: string;
  label: string;
  value: string;
  type: 'activity' | 'health' | 'sleep' | 'nutrition';
}

@Component({
  selector: 'app-data-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="data-summary">
      <div class="section-header">
        <span class="section-icon">📋</span>
        <h2>Résumé des Données</h2>
      </div>

      <div class="summary-content" *ngIf="hasSomeData(); else noData">
        <!-- Summary Banner -->
        <div class="summary-banner">
          <div class="banner-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div class="banner-content">
            <h3>Activité du jour</h3>
            <p class="summary-text">{{ summaryText() }}</p>
          </div>
          <div class="banner-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="quick-stats" *ngIf="quickStats().length > 0">
          <div class="stat-card" *ngFor="let stat of quickStats()">
            <div class="stat-icon">{{ stat.icon }}</div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <div class="data-categories">
          <div class="category-section" *ngIf="activityData().length > 0">
            <div class="category-header">
              <span class="category-icon">🏃</span>
              <h4>Activité Physique</h4>
              <span class="category-count">{{ activityData().length }}</span>
            </div>
            <div class="data-points">
              <div class="data-point" *ngFor="let point of activityData()">
                <span class="point-icon">{{ point.icon }}</span>
                <span class="point-label">{{ point.label }}</span>
                <span class="point-value">{{ point.value }}</span>
              </div>
            </div>
          </div>

          <div class="category-section" *ngIf="healthData().length > 0">
            <div class="category-header">
              <span class="category-icon">❤️</span>
              <h4>Santé</h4>
              <span class="category-count">{{ healthData().length }}</span>
            </div>
            <div class="data-points">
              <div class="data-point" *ngFor="let point of healthData()">
                <span class="point-icon">{{ point.icon }}</span>
                <span class="point-label">{{ point.label }}</span>
                <span class="point-value">{{ point.value }}</span>
              </div>
            </div>
          </div>

          <div class="category-section" *ngIf="sleepData().length > 0">
            <div class="category-header">
              <span class="category-icon">💤</span>
              <h4>Sommeil & Repos</h4>
              <span class="category-count">{{ sleepData().length }}</span>
            </div>
            <div class="data-points">
              <div class="data-point" *ngFor="let point of sleepData()">
                <span class="point-icon">{{ point.icon }}</span>
                <span class="point-label">{{ point.label }}</span>
                <span class="point-value">{{ point.value }}</span>
              </div>
            </div>
          </div>

          <div class="category-section" *ngIf="nutritionData().length > 0">
            <div class="category-header">
              <span class="category-icon">🍽️</span>
              <h4>Nutrition</h4>
              <span class="category-count">{{ nutritionData().length }}</span>
            </div>
            <div class="data-points">
              <div class="data-point" *ngFor="let point of nutritionData()">
                <span class="point-icon">{{ point.icon }}</span>
                <span class="point-label">{{ point.label }}</span>
                <span class="point-value">{{ point.value }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="sync-info">
          <svg class="sync-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          <span>Dernière synchronisation: {{ lastSync }}</span>
        </div>
      </div>

      <ng-template #noData>
        <div class="no-data">
          <div class="no-data-icon">🔄</div>
          <h3>En attente de synchronisation</h3>
          <p>Vos données seront affichées une fois synchronisées avec vos appareils de santé</p>
          <div class="sync-steps">
            <div class="sync-step">
              <span class="step-number">1</span>
              <span class="step-text">Connectez votre appareil</span>
            </div>
            <div class="sync-step">
              <span class="step-number">2</span>
              <span class="step-text">Autorisez l'accès aux données</span>
            </div>
            <div class="sync-step">
              <span class="step-number">3</span>
              <span class="step-text">Synchronisez automatiquement</span>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .data-summary {
      background: white;
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
      margin-bottom: 24px;
    }

    .data-summary:hover {
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

    .summary-banner {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 28px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      color: white;
      margin-bottom: 32px;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
      position: relative;
      overflow: hidden;
    }

    .summary-banner::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
      border-radius: 50%;
      transform: translate(30%, -30%);
    }

    .banner-icon {
      flex-shrink: 0;
      width: 72px;
      height: 72px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 1;
      animation: pulse-scale 3s ease-in-out infinite;
    }

    @keyframes pulse-scale {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .banner-icon svg {
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
    }

    .banner-content {
      flex: 1;
      position: relative;
      z-index: 1;
    }

    .banner-content h3 {
      margin: 0 0 10px 0;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .summary-text {
      margin: 0;
      font-size: 15px;
      line-height: 1.6;
      opacity: 0.95;
      font-weight: 500;
    }

    .banner-badge {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 1;
    }

    .quick-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 16px;
      border: 2px solid #e2e8f0;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .stat-card:hover {
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      border-color: #c7d2fe;
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    }

    .stat-icon {
      font-size: 32px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }

    .stat-info {
      flex: 1;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .data-categories {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .category-section {
      background: #f8fafc;
      border-radius: 16px;
      padding: 20px;
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .category-section:hover {
      background: #f1f5f9;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transform: translateY(-2px);
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e2e8f0;
    }

    .category-icon {
      font-size: 24px;
    }

    .category-header h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      flex: 1;
    }

    .category-count {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
    }

    .data-points {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .data-point {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: white;
      border-radius: 10px;
      transition: all 0.2s ease;
      cursor: default;
    }

    .data-point:hover {
      background: #f8fafc;
      transform: translateX(4px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .point-icon {
      font-size: 20px;
      flex-shrink: 0;
    }

    .point-label {
      font-size: 14px;
      color: #64748b;
      flex: 1;
    }

    .point-value {
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
    }

    .sync-info {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px;
      background: #f0fdf4;
      border-radius: 12px;
      border: 1px solid #bbf7d0;
      margin-top: 20px;
    }

    .sync-icon {
      color: #10b981;
      flex-shrink: 0;
      animation: rotate 2s linear infinite;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .sync-info span {
      font-size: 14px;
      color: #065f46;
      font-weight: 500;
    }

    .no-data {
      text-align: center;
      padding: 60px 20px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 16px;
      border: 2px dashed #cbd5e1;
    }

    .no-data-icon {
      font-size: 64px;
      margin-bottom: 20px;
      animation: spin 3s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .no-data h3 {
      font-size: 20px;
      color: #0f172a;
      margin: 0 0 12px 0;
      font-weight: 700;
    }

    .no-data p {
      color: #64748b;
      font-size: 15px;
      margin: 0 0 32px 0;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .sync-steps {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 400px;
      margin: 0 auto;
    }

    .sync-step {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      text-align: left;
    }

    .step-number {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      flex-shrink: 0;
    }

    .step-text {
      font-size: 14px;
      color: #1e293b;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .data-summary {
        padding: 24px 20px;
      }

      .data-categories {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .summary-banner {
        flex-direction: column;
        text-align: center;
        padding: 24px;
      }

      .summary-banner::before {
        width: 200px;
        height: 200px;
      }

      .quick-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .quick-stats {
        grid-template-columns: 1fr;
      }

      .stat-card {
        padding: 16px;
      }
    }
  `]
})
export class DataSummaryComponent {
  @Input() data: BiometricData | null = null;

  lastSync = new Date().toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  hasSomeData = computed(() => {
    const d = this.data;
    return !!(
      d?.totalSteps || 
      d?.totalDistanceKm || 
      d?.exercise?.length || 
      d?.heartRate?.length || 
      d?.totalSleepHours || 
      d?.totalHydrationLiters
    );
  });

  summaryText = computed(() => {
    const d = this.data;
    if (!d) return "En attente de synchronisation avec vos appareils...";

    const parts: string[] = [];

    if (d.totalSteps && d.totalSteps > 0) {
      parts.push(`${d.totalSteps.toLocaleString()} pas`);
    }

    if (d.totalDistanceKm && parseFloat(d.totalDistanceKm) > 0) {
      parts.push(`${parseFloat(d.totalDistanceKm).toFixed(2)} km parcourus`);
    }

    if (d.exercise && d.exercise.length > 0) {
      const count = d.exercise.length;
      parts.push(`${count} activité${count > 1 ? 's' : ''} physique${count > 1 ? 's' : ''}`);
    }

    if (d.heartRate && d.heartRate.length > 0) {
      parts.push(`${d.heartRate.length} mesure${d.heartRate.length > 1 ? 's' : ''} cardiaque${d.heartRate.length > 1 ? 's' : ''}`);
    }

    if (d.totalSleepHours && parseFloat(d.totalSleepHours) > 0) {
      parts.push(`${parseFloat(d.totalSleepHours).toFixed(1)}h de sommeil`);
    }

    if (d.totalHydrationLiters && parseFloat(d.totalHydrationLiters) > 0) {
      parts.push(`${parseFloat(d.totalHydrationLiters).toFixed(2)}L d'eau bue`);
    }

    return parts.length > 0 
      ? parts.join(' • ')
      : "Peu d'activité enregistrée aujourd'hui";
  });

  quickStats = computed(() => {
    const d = this.data;
    if (!d) return [];

    const stats = [];

    // Total de données collectées
    let totalDataPoints = 0;
    if (d.steps) totalDataPoints += d.steps.length;
    if (d.heartRate) totalDataPoints += d.heartRate.length;
    if (d.exercise) totalDataPoints += d.exercise.length;
    if (d.sleep) totalDataPoints += d.sleep.length;
    if (d.oxygenSaturation) totalDataPoints += d.oxygenSaturation.length;
    if (d.bodyTemperature) totalDataPoints += d.bodyTemperature.length;
    if (d.bloodPressure) totalDataPoints += d.bloodPressure.length;
    if (d.hydration) totalDataPoints += d.hydration.length;

    stats.push({
      icon: '📊',
      label: 'Points de données',
      value: totalDataPoints.toString()
    });

    // Calories totales
    if (d.exercise && d.exercise.length > 0) {
      const totalCalories = d.exercise.reduce((sum, ex) => sum + (ex.activeCalories || 0), 0);
      stats.push({
        icon: '🔥',
        label: 'Calories brûlées',
        value: `${totalCalories}`
      });
    }

    // Distance totale
    if (d.totalDistanceKm && parseFloat(d.totalDistanceKm) > 0) {
      stats.push({
        icon: '🏃',
        label: 'Distance totale',
        value: `${parseFloat(d.totalDistanceKm).toFixed(2)} km`
      });
    }

    // Minutes actives
    if (d.exercise && d.exercise.length > 0) {
      const totalMinutes = d.exercise.reduce((sum, ex) => sum + (ex.durationMinutes || 0), 0);
      stats.push({
        icon: '⏱️',
        label: 'Minutes actives',
        value: `${totalMinutes} min`
      });
    }

    return stats;
  });

  activityData = computed<DataPoint[]>(() => {
    const d = this.data;
    const points: DataPoint[] = [];

    if (d?.totalSteps && d.totalSteps > 0) {
      points.push({
        icon: '👣',
        label: 'Nombre de pas',
        value: d.totalSteps.toLocaleString(),
        type: 'activity'
      });
    }

    if (d?.totalDistanceKm && parseFloat(d.totalDistanceKm) > 0) {
      points.push({
        icon: '📏',
        label: 'Distance parcourue',
        value: `${parseFloat(d.totalDistanceKm).toFixed(2)} km`,
        type: 'activity'
      });
    }

    if (d?.exercise && d.exercise.length > 0) {
      const totalCalories = d.exercise.reduce((sum, ex) => sum + (ex.activeCalories || 0), 0);
      points.push({
        icon: '🔥',
        label: 'Calories brûlées',
        value: `${totalCalories} kcal`,
        type: 'activity'
      });
      
      points.push({
        icon: '🏃',
        label: 'Séances d\'exercice',
        value: `${d.exercise.length}`,
        type: 'activity'
      });
    }

    return points;
  });

  healthData = computed<DataPoint[]>(() => {
    const d = this.data;
    const points: DataPoint[] = [];

    if (d?.avgHeartRate) {
      points.push({
        icon: '❤️',
        label: 'Fréquence cardiaque moy.',
        value: `${d.avgHeartRate} bpm`,
        type: 'health'
      });
    }

    if (d?.heartRate && d.heartRate.length > 0) {
      points.push({
        icon: '📊',
        label: 'Mesures cardiaques',
        value: `${d.heartRate.length}`,
        type: 'health'
      });
    }

    if (d?.oxygenSaturation && d.oxygenSaturation.length > 0) {
      const lastSpo2 = d.oxygenSaturation[d.oxygenSaturation.length - 1];
      points.push({
        icon: '🫁',
        label: 'Saturation en oxygène',
        value: `${lastSpo2.percentage}%`,
        type: 'health'
      });
    }

    if (d?.bloodPressure && d.bloodPressure.length > 0) {
      const lastBP = d.bloodPressure[d.bloodPressure.length - 1];
      points.push({
        icon: '💉',
        label: 'Tension artérielle',
        value: `${lastBP.systolic}/${lastBP.diastolic}`,
        type: 'health'
      });
    }

    if (d?.bodyTemperature && d.bodyTemperature.length > 0) {
      const lastTemp = d.bodyTemperature[d.bodyTemperature.length - 1];
      points.push({
        icon: '🌡️',
        label: 'Température corporelle',
        value: `${lastTemp.temperature}°C`,
        type: 'health'
      });
    }

    return points;
  });

  sleepData = computed<DataPoint[]>(() => {
    const d = this.data;
    const points: DataPoint[] = [];

    if (d?.totalSleepHours && parseFloat(d.totalSleepHours) > 0) {
      points.push({
        icon: '💤',
        label: 'Heures de sommeil',
        value: `${parseFloat(d.totalSleepHours).toFixed(1)}h`,
        type: 'sleep'
      });
    }

    if (d?.sleep && d.sleep.length > 0) {
      points.push({
        icon: '🌙',
        label: 'Périodes de sommeil',
        value: `${d.sleep.length}`,
        type: 'sleep'
      });
    }

    if (d?.stressLevel) {
      points.push({
        icon: '🧠',
        label: 'Niveau de stress',
        value: d.stressLevel,
        type: 'sleep'
      });
    }

    if (d?.stressScore !== undefined) {
      points.push({
        icon: '📈',
        label: 'Score de stress',
        value: `${d.stressScore}/100`,
        type: 'sleep'
      });
    }

    return points;
  });

  nutritionData = computed<DataPoint[]>(() => {
    const d = this.data;
    const points: DataPoint[] = [];

    if (d?.totalHydrationLiters && parseFloat(d.totalHydrationLiters) > 0) {
      points.push({
        icon: '💧',
        label: 'Hydratation',
        value: `${parseFloat(d.totalHydrationLiters).toFixed(2)} L`,
        type: 'nutrition'
      });
    }

    if (d?.hydration && d.hydration.length > 0) {
      points.push({
        icon: '🥤',
        label: 'Consommations d\'eau',
        value: `${d.hydration.length}`,
        type: 'nutrition'
      });
    }

    if (d?.weight && d.weight.length > 0) {
      const lastWeight = d.weight[d.weight.length - 1];
      points.push({
        icon: '⚖️',
        label: 'Poids',
        value: `${lastWeight.weight} kg`,
        type: 'nutrition'
      });
    }

    return points;
  });
}