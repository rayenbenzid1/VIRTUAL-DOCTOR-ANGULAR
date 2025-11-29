import { Component, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RiskAlertsApiService, RiskAlertsResponse } from '../../services/risk-alerts.api';
import { AlertsHeaderComponent } from '../alerts-header/alerts-header.component';
import { AnalysisPeriodComponent } from '../analysis-period/analysis-period.component';
import { RiskFactorsComponent } from '../risk-factors/risk-factors.component';
import { ActionPrioritiesComponent } from '../action-priorities/action-priorities.component';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [
    CommonModule,
    AlertsHeaderComponent,
    AnalysisPeriodComponent,
    RiskFactorsComponent,
    ActionPrioritiesComponent
  ],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent {
  private riskAlertsApi = inject(RiskAlertsApiService);
  private router = inject(Router);

  // Signals
  alertsData = signal<RiskAlertsResponse | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  selectedPeriod = signal(7);
  selectedDate = signal<string | null>(null);

  // Computed values
  alertLevel = computed(() => this.alertsData()?.alert_level || 'Faible');
  
  criticalAlerts = computed(() => 
    this.alertsData()?.alerts.filter(a => a.includes('🚨')) || []
  );
  
  warningAlerts = computed(() => 
    this.alertsData()?.alerts.filter(a => a.includes('⚠️')) || []
  );
  
  successAlerts = computed(() => 
    this.alertsData()?.alerts.filter(a => a.includes('✅')) || []
  );

  alertLevelColor = computed(() => {
    const level = this.alertLevel().toLowerCase();
    if (level === 'critique') return '#ef4444';
    if (level === 'élevé') return '#f59e0b';
    if (level === 'modéré') return '#3b82f6';
    return '#10b981';
  });

  constructor() {
    // Charger les données au montage du composant
    effect(() => {
      this.loadAlerts();
    });
  }

  async loadAlerts() {
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
      const data = await this.riskAlertsApi.getRiskAlerts(
        email,
        this.selectedPeriod(),
        this.selectedDate() || undefined
      ).toPromise();

      if (data) {
        this.alertsData.set(data);
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des alertes:', err);
      this.error.set(err.error?.detail || 'Impossible de charger les alertes');
    } finally {
      this.isLoading.set(false);
    }
  }

  onPeriodChange(period: number) {
    this.selectedPeriod.set(period);
    this.selectedDate.set(null);
    this.loadAlerts();
  }

  onDateSelected(date: string) {
    this.selectedDate.set(date);
    this.loadAlerts();
  }

  onAnalyze() {
    this.loadAlerts();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}