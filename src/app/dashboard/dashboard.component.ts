// src/app/dashboard/dashboard.component.ts
import { Component, signal, computed, effect, inject, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileModalComponent } from '../shared/components/profile-modal/profile-modal.component';
import { UserResponse } from '../shared/models/profile.models';
import { BiometricApiService, BiometricData } from './services/biometric.api';
import { HealthAvatarComponent } from './components/health-avatar/health-avatar.component';
import { DataSummaryComponent } from './components/data-summary/data-summary.component';
import { DailySummaryComponent } from './components/daily-summary/daily-summary.component';
import { VitalSignsComponent } from './components/vital-signs/vital-signs.component';
import { PhysicalActivitiesComponent } from './components/physical-activities/physical-activities.component';

interface HealthMetric {
  id: string;
  icon: string;
  label: string;
  value: string;
  color: string;
}

interface VitalSign {
  icon: string;
  label: string;
  value: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ProfileModalComponent, HealthAvatarComponent, DataSummaryComponent, DailySummaryComponent, VitalSignsComponent, PhysicalActivitiesComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  private router = inject(Router);
  private biometricApi = inject(BiometricApiService);

  @ViewChild('profileModal') profileModal!: ProfileModalComponent;

  loading = signal(true);
  userName = signal('');
  showDropdown = signal(false);
  activeTab = signal('analyse');
  biometricData = signal<BiometricData | null>(null);

  // Métriques calculées
  dailyMetrics = computed<HealthMetric[]>(() => {
    const data = this.biometricData();
    
    return [
      { 
        id: 'steps', 
        icon: '👣', 
        label: 'Pas', 
        value: data?.totalSteps ? data.totalSteps.toLocaleString() : '0', 
        color: '#e8f5e9' 
      },
      { 
        id: 'distance', 
        icon: '📏', 
        label: 'Distance', 
        value: data?.totalDistanceKm ? `${parseFloat(data.totalDistanceKm).toFixed(2)} km` : '0.00 km', 
        color: '#e3f2fd' 
      },
      { 
        id: 'bpm', 
        icon: '❤️', 
        label: 'BPM', 
        value: data?.avgHeartRate ? `${data.avgHeartRate} bpm` : '-- bpm', 
        color: '#fce4ec' 
      },
      { 
        id: 'sleep', 
        icon: '💤', 
        label: 'Sommeil', 
        value: data?.totalSleepHours ? `${parseFloat(data.totalSleepHours).toFixed(1)}h` : '0.0h', 
        color: '#f3e5f5' 
      },
      { 
        id: 'hydration', 
        icon: '💧', 
        label: 'Hydratation', 
        value: data?.totalHydrationLiters ? `${parseFloat(data.totalHydrationLiters).toFixed(2)} L` : '0.00 L', 
        color: '#e0f7fa' 
      },
      { 
        id: 'stress', 
        icon: '🧠', 
        label: 'Stress', 
        value: data?.stressLevel ? data.stressLevel : '--', 
        color: '#fff3e0' 
      },
    ];
  });

  private formatFixed(value: number | undefined | null, decimals: number = 2): string {
    if (value == null || isNaN(value)) return '--';
    return value.toFixed(decimals);
  }

  // Signes vitaux calculés
  vitalSigns = computed<VitalSign[]>(() => {
    const data = this.biometricData();
    
    const lastOxygen = data?.oxygenSaturation?.[data.oxygenSaturation.length - 1];
    const lastTemperature = data?.bodyTemperature?.[data.bodyTemperature.length - 1];
    const lastBloodPressure = data?.bloodPressure?.[data.bloodPressure.length - 1];
    const lastWeight = data?.weight?.[data.weight.length - 1];
    const lastHeight = data?.height?.[data.height.length - 1];

    return [
      { 
        icon: '🫁', 
        label: 'SpO₂', 
        value: lastOxygen?.percentage ? `${lastOxygen.percentage}%` : '--', 
        color: '#e3f2fd' 
      },
      { 
        icon: '🌡️', 
        label: 'Température', 
        value: lastTemperature?.temperature != null 
        ? `${this.formatFixed(lastTemperature.temperature, 2)}°C` 
        : '--', 
        color: '#fff3e0' 
      },
      { 
        icon: '💉', 
        label: 'Tension', 
        value: lastBloodPressure ? `${lastBloodPressure.systolic}/${lastBloodPressure.diastolic}` : '--/--', 
        color: '#fce4ec' 
      },
      { 
        icon: '⚖️', 
        label: 'Poids', 
        value: lastWeight?.weight != null 
        ? `${this.formatFixed(lastWeight.weight, 2)} kg` 
        : '--', 
        color: '#e8f5e9' 
      },
      { 
        icon: '📏', 
        label: 'Taille', 
        value: lastHeight?.height ? `${(lastHeight.height * 100).toFixed(0)} cm` : '--', 
        color: '#f3e5f5' 
      },
    ];
  });

  // Données d'exercice calculées
  exerciseData = computed(() => {
    const data = this.biometricData();
    
    if (!data?.exercise || data.exercise.length === 0) {
      return null;
    }

    // Prendre le premier exercice (vous pouvez adapter pour afficher plusieurs exercices)
    const exercise = data.exercise[0];
    
    return {
      type: exercise.exerciseTypeName || 'Exercice',
      duration: exercise.durationMinutes || 0,
      distance: exercise.distanceKm ? `${parseFloat(exercise.distanceKm).toFixed(2)} km` : '0 km',
      calories: exercise.activeCalories || 0,
      time: exercise.startTime ? this.formatTime(exercise.startTime) : ''
    };
  });

  // Résumé des données calculé
  dataSummary = computed(() => {
    const data = this.biometricData();
    
    if (!data) {
      return "En attente de synchronisation avec vos appareils...";
    }

    const summaries = [];

    // Vérifier les pas
    if (data.totalSteps && data.totalSteps > 0) {
      summaries.push(`${data.totalSteps.toLocaleString()} pas`);
    }

    // Vérifier la distance
    if (data.totalDistanceKm && parseFloat(data.totalDistanceKm) > 0) {
      summaries.push(`${parseFloat(data.totalDistanceKm).toFixed(2)} km parcourus`);
    }

    // Vérifier les exercices
    if (data.exercise && data.exercise.length > 0) {
      const exerciseCount = data.exercise.length;
      summaries.push(`${exerciseCount} activité${exerciseCount > 1 ? 's' : ''} physique${exerciseCount > 1 ? 's' : ''}`);
    }

    // Vérifier la fréquence cardiaque
    if (data.heartRate && data.heartRate.length > 0) {
      summaries.push(`${data.heartRate.length} mesure${data.heartRate.length > 1 ? 's' : ''} cardiaque${data.heartRate.length > 1 ? 's' : ''}`);
    }

    // Vérifier le sommeil
    if (data.totalSleepHours && parseFloat(data.totalSleepHours) > 0) {
      summaries.push(`${parseFloat(data.totalSleepHours).toFixed(1)}h de sommeil`);
    }

    // Vérifier l'hydratation
    if (data.totalHydrationLiters && parseFloat(data.totalHydrationLiters) > 0) {
      summaries.push(`${parseFloat(data.totalHydrationLiters).toFixed(2)}L d'eau bue`);
    }

    return summaries.length > 0 
      ? `Aujourd'hui : ${summaries.join(', ')}`
      : "Peu d'activité enregistrée aujourd'hui";
  });

  ngOnInit() {
    this.loadUserData();
    this.loadBiometricData();
  }

  private logDataChanges = effect(() => {
    const data = this.biometricData();
    console.log('Données biométriques:', data);
    console.log('Exercice calculé:', this.exerciseData());
    console.log('Résumé calculé:', this.dataSummary());
  });

  private loadUserData() {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.userName.set(userData.firstName || userData.name || 'Utilisateur');
    }
  }

  private loadBiometricData() {
    const user = localStorage.getItem('user');
    if (!user) {
      this.loading.set(false);
      return;
    }

    const userData = JSON.parse(user);
    const userEmail = userData.email;

    this.biometricApi.getTodayData(userEmail).subscribe({
      next: (data) => {
        console.log('Données complètes reçues:', data);
        this.biometricData.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.loading.set(false);
      }
    });
  }

  private formatTime(timeString: string): string {
    try {
      const timePart = timeString.split(' ')[1]; // Prendre la partie heure "16:05:09"
      return timePart ? timePart.substring(0, 5) : timeString; // Retourner "16:05"
    } catch {
      return timeString;
    }
  }

  // ... le reste des méthodes reste inchangé
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-dropdown')) {
      this.showDropdown.set(false);
    }
  }

  toggleDropdown() {
    this.showDropdown.set(!this.showDropdown());
  }

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }

  editProfile() {
    this.showDropdown.set(false);
    if (this.profileModal) {
      this.profileModal.open();
    }
  }

  onProfileUpdated(user: UserResponse) {
    this.userName.set(user.firstName || user.fullName || 'Utilisateur');
  }

  onModalClosed() {
    console.log('Modal fermé');
  }

  analyze() {
    this.router.navigate(['/health/analysis']);
  }

  consult() {
    console.log('Consulter clicked');
  }

  goToAppointments() {
    this.router.navigate(['/appointments']);
  }

  viewAlerts() {
    this.router.navigate(['/health/alerts']);
  }

  viewTrends() {
    this.router.navigate(['/health/trends']);
  }

  viewGoals() {
    this.router.navigate(['/health/goals']);
  }

  viewAnalysis() {
    this.router.navigate(['/health/analysis']);
  }

  logout() {
    this.showDropdown.set(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}