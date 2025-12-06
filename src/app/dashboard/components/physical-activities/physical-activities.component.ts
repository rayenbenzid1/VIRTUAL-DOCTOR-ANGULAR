// src/app/dashboard/components/physical-activities/physical-activities.component.ts
import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiometricData, ExerciseRecord } from '../../services/biometric.api';

interface ExerciseDisplay {
  type: string;
  icon: string;
  duration: number;
  distance: string;
  calories: number;
  time: string;
  heartRate: string;
  intensity: 'low' | 'medium' | 'high';
  details: {
    pace?: string;
    cadence?: string;
    speed?: string;
  };
}

@Component({
  selector: 'app-physical-activities',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="physical-activities">
      <div class="section-header">
        <span class="section-icon">🏋️</span>
        <h2>Activités Physiques</h2>
        <span class="activities-count" *ngIf="exercises().length > 0">
          {{ exercises().length }} activité{{ exercises().length > 1 ? 's' : '' }}
        </span>
      </div>

      <div class="no-activity" *ngIf="exercises().length === 0">
        <div class="no-activity-icon">🎯</div>
        <h3>Aucune activité aujourd'hui</h3>
        <p>Commencez votre journée avec un peu d'exercice !</p>
        <div class="activity-suggestions">
          <span class="suggestion">🚶 Marche</span>
          <span class="suggestion">🏃 Course</span>
          <span class="suggestion">🚴 Vélo</span>
        </div>
      </div>

      <div class="exercises-list" *ngIf="exercises().length > 0">
        <div 
          class="exercise-card"
          *ngFor="let exercise of exercises(); let i = index"
          [attr.data-intensity]="exercise.intensity">
          
          <div class="exercise-header">
            <div class="exercise-icon">{{ exercise.icon }}</div>
            <div class="exercise-main-info">
              <h3 class="exercise-type">{{ exercise.type }}</h3>
              <span class="exercise-time">{{ exercise.time }}</span>
            </div>
            <div class="intensity-badge" [attr.data-intensity]="exercise.intensity">
              {{ getIntensityLabel(exercise.intensity) }}
            </div>
          </div>

          <div class="exercise-stats">
            <div class="stat-item">
              <svg class="stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <div class="stat-info">
                <span class="stat-value">{{ exercise.duration }} min</span>
                <span class="stat-label">Durée</span>
              </div>
            </div>

            <div class="stat-item" *ngIf="exercise.distance !== '0.00 km'">
              <svg class="stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
              <div class="stat-info">
                <span class="stat-value">{{ exercise.distance }}</span>
                <span class="stat-label">Distance</span>
              </div>
            </div>

            <div class="stat-item">
              <svg class="stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
              </svg>
              <div class="stat-info">
                <span class="stat-value">{{ exercise.calories }}</span>
                <span class="stat-label">Calories</span>
              </div>
            </div>

            <div class="stat-item" *ngIf="exercise.heartRate !== '-- bpm'">
              <svg class="stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <div class="stat-info">
                <span class="stat-value">{{ exercise.heartRate }}</span>
                <span class="stat-label">Moy. BPM</span>
              </div>
            </div>
          </div>

          <div class="exercise-details" *ngIf="hasDetails(exercise)">
            <div class="detail-chip" *ngIf="exercise.details.pace">
              <span class="detail-label">Allure:</span>
              <span class="detail-value">{{ exercise.details.pace }}</span>
            </div>
            <div class="detail-chip" *ngIf="exercise.details.speed">
              <span class="detail-label">Vitesse:</span>
              <span class="detail-value">{{ exercise.details.speed }}</span>
            </div>
            <div class="detail-chip" *ngIf="exercise.details.cadence">
              <span class="detail-label">Cadence:</span>
              <span class="detail-value">{{ exercise.details.cadence }}</span>
            </div>
          </div>

          <div class="exercise-progress">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="getCalorieProgress(exercise.calories)"></div>
            </div>
            <span class="progress-text">{{ getCalorieProgress(exercise.calories) }}% de l'objectif calorique</span>
          </div>
        </div>
      </div>

      <div class="daily-total" *ngIf="exercises().length > 0">
        <div class="total-card">
          <div class="total-icon">📊</div>
          <div class="total-info">
            <span class="total-label">Total du jour</span>
            <span class="total-value">{{ totalCalories() }} calories brûlées</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .physical-activities {
      background: white;
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
      margin-bottom: 24px;
    }

    .physical-activities:hover {
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

    .activities-count {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
    }

    .no-activity {
      text-align: center;
      padding: 60px 20px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 16px;
      border: 2px dashed #cbd5e1;
    }

    .no-activity-icon {
      font-size: 64px;
      margin-bottom: 20px;
      animation: bounce 2s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .no-activity h3 {
      font-size: 20px;
      color: #0f172a;
      margin: 0 0 12px 0;
      font-weight: 700;
    }

    .no-activity p {
      color: #64748b;
      font-size: 15px;
      margin: 0 0 24px 0;
    }

    .activity-suggestions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .suggestion {
      background: white;
      padding: 10px 20px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      color: #6366f1;
      border: 2px solid #e0e7ff;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .suggestion:hover {
      background: #6366f1;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .exercises-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .exercise-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px;
      border-radius: 16px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .exercise-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
      pointer-events: none;
    }

    .exercise-card[data-intensity="high"] {
      background: linear-gradient(135deg, #f43f5e 0%, #dc2626 100%);
    }

    .exercise-card[data-intensity="medium"] {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .exercise-card[data-intensity="low"] {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .exercise-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    }

    .exercise-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }

    .exercise-icon {
      font-size: 40px;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
    }

    .exercise-main-info {
      flex: 1;
    }

    .exercise-type {
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 4px 0;
    }

    .exercise-time {
      font-size: 14px;
      opacity: 0.9;
    }

    .intensity-badge {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
    }

    .exercise-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.15);
      padding: 12px;
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }

    .stat-icon {
      flex-shrink: 0;
      opacity: 0.9;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 16px;
      font-weight: 700;
    }

    .stat-label {
      font-size: 11px;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .exercise-details {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }

    .detail-chip {
      background: rgba(255, 255, 255, 0.2);
      padding: 8px 14px;
      border-radius: 20px;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .detail-label {
      opacity: 0.8;
    }

    .detail-value {
      font-weight: 700;
    }

    .exercise-progress {
      margin-top: 16px;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 8px;
    }

    .progress-fill {
      height: 100%;
      background: white;
      border-radius: 10px;
      transition: width 1s ease;
    }

    .progress-text {
      font-size: 12px;
      opacity: 0.9;
    }

    .daily-total {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 2px solid #f1f5f9;
    }

    .total-card {
      display: flex;
      align-items: center;
      gap: 16px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      padding: 20px 24px;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .total-icon {
      font-size: 36px;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
    }

    .total-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .total-label {
      font-size: 13px;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .total-value {
      font-size: 24px;
      font-weight: 800;
    }

    @media (max-width: 768px) {
      .physical-activities {
        padding: 24px 20px;
      }

      .exercise-stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .exercise-header {
        flex-wrap: wrap;
      }
    }
  `]
})
export class PhysicalActivitiesComponent {
  @Input() data: BiometricData | null = null;

  exercises = computed<ExerciseDisplay[]>(() => {
    if (!this.data?.exercise || this.data.exercise.length === 0) {
      return [];
    }

    return this.data.exercise.map(ex => this.mapExercise(ex));
  });

  totalCalories = computed(() => {
    return this.exercises().reduce((sum, ex) => sum + ex.calories, 0);
  });

  private mapExercise(exercise: ExerciseRecord): ExerciseDisplay {
    return {
      type: exercise.exerciseTypeName || 'Exercice',
      icon: this.getExerciseIcon(exercise.exerciseTypeName),
      duration: exercise.durationMinutes || 0,
      distance: exercise.distanceKm ? `${parseFloat(exercise.distanceKm).toFixed(2)} km` : '0.00 km',
      calories: exercise.activeCalories || 0,
      time: this.formatTime(exercise.startTime),
      heartRate: exercise.avgHeartRate ? `${exercise.avgHeartRate} bpm` : '-- bpm',
      intensity: this.getIntensity(exercise.avgHeartRate, exercise.activeCalories),
      details: {
        pace: exercise.avgSpeedKmh ? `${exercise.avgSpeedKmh} km/h` : undefined,
        speed: exercise.maxSpeedKmh ? `Max: ${exercise.maxSpeedKmh} km/h` : undefined,
        cadence: exercise.avgCadence ? `${exercise.avgCadence} pas/min` : undefined
      }
    };
  }

  private getExerciseIcon(type?: string): string {
    if (!type) return '🏃';
    
    const t = type.toLowerCase();
    if (t.includes('run') || t.includes('course')) return '🏃';
    if (t.includes('walk') || t.includes('marche')) return '🚶';
    if (t.includes('bike') || t.includes('vélo') || t.includes('cycl')) return '🚴';
    if (t.includes('swim') || t.includes('nata')) return '🏊';
    if (t.includes('yoga')) return '🧘';
    if (t.includes('gym') || t.includes('muscul')) return '🏋️';
    if (t.includes('hike') || t.includes('rando')) return '🥾';
    if (t.includes('dance') || t.includes('dans')) return '💃';
    
    return '🏃';
  }

  private getIntensity(heartRate?: number, calories?: number): 'low' | 'medium' | 'high' {
    if (!heartRate && !calories) return 'medium';
    
    // Basé sur la fréquence cardiaque
    if (heartRate) {
      if (heartRate >= 150) return 'high';
      if (heartRate >= 120) return 'medium';
      return 'low';
    }
    
    // Basé sur les calories (par minute)
    if (calories) {
      const caloriesPerMin = calories / 60; // Estimation
      if (caloriesPerMin >= 10) return 'high';
      if (caloriesPerMin >= 6) return 'medium';
      return 'low';
    }
    
    return 'medium';
  }

  getIntensityLabel(intensity: 'low' | 'medium' | 'high'): string {
    switch (intensity) {
      case 'low': return 'Faible';
      case 'medium': return 'Modéré';
      case 'high': return 'Intense';
    }
  }

  private formatTime(timeString: string): string {
    try {
      const timePart = timeString.split(' ')[1];
      return timePart ? timePart.substring(0, 5) : timeString;
    } catch {
      return timeString;
    }
  }

  hasDetails(exercise: ExerciseDisplay): boolean {
    return !!(exercise.details.pace || exercise.details.speed || exercise.details.cadence);
  }

  getCalorieProgress(calories: number): number {
    const dailyGoal = 500; // Objectif calorique quotidien
    return Math.min((calories / dailyGoal) * 100, 100);
  }
}