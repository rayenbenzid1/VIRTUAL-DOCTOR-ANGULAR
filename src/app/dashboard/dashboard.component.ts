import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  loading = signal(true);
  userName = signal('');

  dailyMetrics = signal<HealthMetric[]>([
    { id: 'steps', icon: '👣', label: 'Pas', value: '0', color: '#e8f5e9' },
    { id: 'distance', icon: '📏', label: 'Distance', value: '0.00 km', color: '#e3f2fd' },
    { id: 'bpm', icon: '❤️', label: 'BPM', value: '-- bpm', color: '#fce4ec' },
    { id: 'sleep', icon: '💤', label: 'Sommeil', value: '0.0h', color: '#f3e5f5' },
    { id: 'hydration', icon: '💧', label: 'Hydratation', value: '0.00 L', color: '#e0f7fa' },
    { id: 'stress', icon: '🧠', label: 'Stress', value: '--', color: '#fff3e0' }
  ]);

  vitalSigns = signal<VitalSign[]>([
    { icon: '🫁', label: 'SpO₂', value: '--', color: '#e3f2fd' },
    { icon: '🌡️', label: 'Température', value: '--', color: '#fff3e0' },
    { icon: '💉', label: 'Tension', value: '--/--', color: '#fce4ec' },
    { icon: '⚖️', label: 'Poids', value: '--', color: '#e8f5e9' },
    { icon: '📏', label: 'Taille', value: '--', color: '#f3e5f5' }
  ]);

  constructor(private router: Router) {}

  ngOnInit() {
    // Charger les données utilisateur
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.userName.set(userData.firstName || 'Utilisateur');
    }

    // Simuler le chargement des données
    setTimeout(() => {
      this.loading.set(false);
    }, 1500);
  }

  refresh() {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 1000);
  }

  analyze() {
    console.log('Analyser clicked');
  }

  consult() {
    console.log('Consulter clicked');
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
