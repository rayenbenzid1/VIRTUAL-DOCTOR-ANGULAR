import { Component, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HealthTrendsApiService, HealthTrendsResponse } from '../../services/health-trends.api';
import { TrendsPeriodSelectorComponent } from '../trends-period-selector/trends-period-selector.component';
import { HealthScoreChartComponent } from '../health-score-chart/health-score-chart.component';
import { MetricCardsComponent } from '../metric-cards/metric-cards.component';

@Component({
  selector: 'app-trends',
  standalone: true,
  imports: [
    CommonModule,
    TrendsPeriodSelectorComponent,
    HealthScoreChartComponent,
    MetricCardsComponent
  ],
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.css']
})
export class TrendsComponent {
  private healthTrendsApi = inject(HealthTrendsApiService);
  private router = inject(Router);

  // Signals
  trendsData = signal<HealthTrendsResponse | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  selectedPeriod = signal(7); // Par défaut 1 semaine

  // Computed values
  hasData = computed(() => this.trendsData() !== null);
  
  dataPoints = computed(() => this.trendsData()?.data_points || 0);
  
  // Score de santé moyen
  averageHealthScore = computed(() => {
    const stats = this.trendsData()?.statistics?.health_scores;
    return stats ? Math.round(stats.mean) : 0;
  });

  healthScoreTrend = computed(() => {
    return this.trendsData()?.statistics?.health_scores?.trend || 'stable';
  });

  // Graphique du score de santé
  healthScoreChartData = computed(() => {
    const trends = this.trendsData()?.trends;
    if (!trends) return null;

    return {
      dates: trends.dates,
      scores: trends.health_scores
    };
  });

  // Métriques détaillées
  metricsData = computed(() => {
    const trends = this.trendsData()?.trends;
    const stats = this.trendsData()?.statistics;
    if (!trends || !stats) return [];

    return [
      {
        key: 'steps',
        label: 'Pas quotidiens',
        icon: '🚶',
        color: '#10b981',
        currentValue: trends.steps[trends.steps.length - 1] || 0,
        averageValue: Math.round(stats.steps.mean),
        trend: stats.steps.trend,
        data: trends.steps,
        dates: trends.dates,
        unit: 'pas',
        minValue: stats.steps.min,
        maxValue: stats.steps.max
      },
      {
        key: 'heart_rate',
        label: 'Fréquence cardiaque',
        icon: '❤️',
        color: '#ef4444',
        currentValue: trends.heart_rate[trends.heart_rate.length - 1] || 0,
        averageValue: Math.round(stats.heart_rate.mean),
        trend: stats.heart_rate.trend,
        data: trends.heart_rate,
        dates: trends.dates,
        unit: 'bpm',
        minValue: stats.heart_rate.min,
        maxValue: stats.heart_rate.max
      },
      {
        key: 'sleep_hours',
        label: 'Sommeil',
        icon: '💤',
        color: '#3b82f6',
        currentValue: trends.sleep_hours[trends.sleep_hours.length - 1] || 0,
        averageValue: Math.round(stats.sleep_hours.mean * 10) / 10,
        trend: stats.sleep_hours.trend,
        data: trends.sleep_hours,
        dates: trends.dates,
        unit: 'h',
        minValue: stats.sleep_hours.min,
        maxValue: stats.sleep_hours.max
      },
      {
        key: 'stress_score',
        label: 'Stress',
        icon: '🧠',
        color: '#f59e0b',
        currentValue: trends.stress_score[trends.stress_score.length - 1] || 0,
        averageValue: Math.round(stats.stress_score.mean * 10) / 10,
        trend: stats.stress_score.trend,
        data: trends.stress_score,
        dates: trends.dates,
        unit: '/100',
        minValue: stats.stress_score.min,
        maxValue: stats.stress_score.max
      },
      {
        key: 'hydration',
        label: 'Hydratation',
        icon: '💧',
        color: '#06b6d4',
        currentValue: trends.hydration[trends.hydration.length - 1] || 0,
        averageValue: Math.round(stats.hydration.mean * 10) / 10,
        trend: stats.hydration.trend,
        data: trends.hydration,
        dates: trends.dates,
        unit: 'L',
        minValue: stats.hydration.min,
        maxValue: stats.hydration.max
      },
      {
        key: 'weight',
        label: 'Poids',
        icon: '⚖️',
        color: '#8b5cf6',
        currentValue: trends.weight[trends.weight.length - 1] || 0,
        averageValue: Math.round(stats.weight.mean * 10) / 10,
        trend: stats.weight.trend,
        data: trends.weight,
        dates: trends.dates,
        unit: 'kg',
        minValue: stats.weight.min,
        maxValue: stats.weight.max
      }
    ];
  });

  constructor() {
    // Charger les données au montage
    effect(() => {
      this.loadTrends();
    });
  }

  async loadTrends() {
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

      // Appel API
      const data = await this.healthTrendsApi.getHealthTrends(
        email,
        this.selectedPeriod()
      ).toPromise();

      if (data) {
        this.trendsData.set(data);
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des tendances:', err);
      this.error.set(err.error?.detail || 'Impossible de charger les tendances');
    } finally {
      this.isLoading.set(false);
    }
  }

  onPeriodChange(days: number) {
    this.selectedPeriod.set(days);
    this.loadTrends();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'increasing': return '↑';
      case 'decreasing': return '↓';
      case 'stable': return '→';
      default: return '—';
    }
  }

  getTrendLabel(trend: string): string {
    switch (trend) {
      case 'increasing': return 'En hausse';
      case 'decreasing': return 'En baisse';
      case 'stable': return 'Stable';
      default: return 'Insuffisant';
    }
  }
}