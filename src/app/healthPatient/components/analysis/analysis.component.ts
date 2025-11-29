// src/app/healthPatient/components/analysis/analysis.component.ts
import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  HealthAnalysisApiService, 
  BiometricData, 
  HealthAnalysisResult,
  TodayDataResponse 
} from '../../services/health-analysis.api';
import { AnalysisHeaderComponent } from '../analysis-header/analysis-header.component';
import { ScoreBreakdownComponent } from '../score-breakdown/score-breakdown.component';
import { AnomaliesListComponent } from '../anomalies-list/anomalies-list.component';
import { RecommendationsListComponent } from '../recommendations-list/recommendations-list.component';
import { HealthInsightsComponent } from '../health-insights/health-insights.component';
import { AiExplanationComponent } from '../ai-explanation/ai-explanation.component';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [
    CommonModule,
    AnalysisHeaderComponent,
    ScoreBreakdownComponent,
    AnomaliesListComponent,
    RecommendationsListComponent,
    HealthInsightsComponent,
    AiExplanationComponent
  ],
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent {
  private analysisApi = inject(HealthAnalysisApiService);
  private router = inject(Router);

  // Signals
  analysisData = signal<HealthAnalysisResult | null>(null);
  todayData = signal<TodayDataResponse | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Computed values
  hasData = computed(() => this.analysisData() !== null);

  constructor() {
    this.loadAnalysis();
  }

  async loadAnalysis() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      // Récupérer l'email depuis localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        this.router.navigate(['/login']);
        return;
      }

      const user = JSON.parse(userStr);
      const email = user.email;

      // 1. Récupérer les données d'aujourd'hui
      const todayResponse = await this.analysisApi.getTodayData(email).toPromise();
      
      if (!todayResponse) {
        this.error.set('Aucune donnée disponible pour aujourd\'hui');
        this.isLoading.set(false);
        return;
      }

      this.todayData.set(todayResponse);

      // 2. Convertir en BiometricData pour l'analyse
      const biometricData: BiometricData = {
        totalSteps: todayResponse.totalSteps,
        avgHeartRate: todayResponse.avgHeartRate,
        minHeartRate: todayResponse.minHeartRate,
        maxHeartRate: todayResponse.maxHeartRate,
        totalDistanceKm: parseFloat(todayResponse.totalDistanceKm),
        totalSleepHours: parseFloat(todayResponse.totalSleepHours),
        totalHydrationLiters: parseFloat(todayResponse.totalHydrationLiters),
        stressLevel: todayResponse.stressLevel,
        stressScore: todayResponse.stressScore,
        dailyTotalCalories: todayResponse.dailyTotalCalories,
        oxygenSaturation: todayResponse.oxygenSaturation || [],
        bodyTemperature: todayResponse.bodyTemperature || [],
        bloodPressure: todayResponse.bloodPressure || [],
        weight: todayResponse.weight || [],
        height: todayResponse.height || [],
        exercise: todayResponse.exercise || []
      };

      // 3. Analyser les données
      const analysisResult = await this.analysisApi.analyzeHealth(biometricData).toPromise();

      if (analysisResult) {
        this.analysisData.set(analysisResult);
      }

    } catch (err: any) {
      console.error('Erreur lors de l\'analyse:', err);
      this.error.set(
        err.error?.detail || 
        'Impossible de charger l\'analyse. Assurez-vous d\'avoir des données pour aujourd\'hui.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  retryAnalysis() {
    this.loadAnalysis();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}