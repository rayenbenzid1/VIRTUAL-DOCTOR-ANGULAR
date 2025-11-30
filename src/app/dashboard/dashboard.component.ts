// src/app/dashboard/dashboard.component.ts
import { Component, signal, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileModalComponent } from '../shared/components/profile-modal/profile-modal.component';
import { UserResponse } from '../shared/models/profile.models';

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
  imports: [CommonModule, ProfileModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  // ViewChild pour accéder au modal
  @ViewChild('profileModal') profileModal!: ProfileModalComponent;

  loading = signal(true);
  userName = signal('');
  showDropdown = signal(false);
  activeTab = signal('analyse');

  dailyMetrics = signal<HealthMetric[]>([
    { id: 'steps', icon: '👣', label: 'Pas', value: '0', color: '#e8f5e9' },
    { id: 'distance', icon: '📏', label: 'Distance', value: '0.00 km', color: '#e3f2fd' },
    { id: 'bpm', icon: '❤️', label: 'BPM', value: '-- bpm', color: '#fce4ec' },
    { id: 'sleep', icon: '💤', label: 'Sommeil', value: '0.0h', color: '#f3e5f5' },
    { id: 'hydration', icon: '💧', label: 'Hydratation', value: '0.00 L', color: '#e0f7fa' },
    { id: 'stress', icon: '🧠', label: 'Stress', value: '--', color: '#fff3e0' },
  ]);

  vitalSigns = signal<VitalSign[]>([
    { icon: '🫁', label: 'SpO₂', value: '--', color: '#e3f2fd' },
    { icon: '🌡️', label: 'Température', value: '--', color: '#fff3e0' },
    { icon: '💉', label: 'Tension', value: '--/--', color: '#fce4ec' },
    { icon: '⚖️', label: 'Poids', value: '--', color: '#e8f5e9' },
    { icon: '📏', label: 'Taille', value: '--', color: '#f3e5f5' },
  ]);

  constructor(private router: Router) {}

  ngOnInit() {
    // Charger les données utilisateur
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.userName.set(userData.firstName || userData.name || 'Utilisateur');
    }

    // Simuler le chargement des données
    setTimeout(() => {
      this.loading.set(false);
    }, 1500);
  }

  // Fermer le dropdown si on clique ailleurs
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
    console.log('Navigation vers:', tab);
  }

  editProfile() {
    // Fermer le dropdown
    this.showDropdown.set(false);
    
    // Ouvrir le modal de profil
    if (this.profileModal) {
      this.profileModal.open();
    } else {
      console.error('Profile modal not found');
    }
  }

  // Callback quand le profil est mis à jour
  onProfileUpdated(user: UserResponse) {
    console.log('Profil mis à jour:', user);
    // Mettre à jour le nom affiché
    this.userName.set(user.firstName || user.fullName || 'Utilisateur');
    // Vous pouvez aussi recharger les données du dashboard si nécessaire
  }

  // Callback quand le modal est fermé
  onModalClosed() {
    console.log('Modal fermé');
  }

  analyze() {
    console.log('Analyser clicked');
    this.router.navigate(['/health/analysis']);
  }

  consult() {
    console.log('Consulter clicked');
    // Naviguer vers la page de consultation
    // this.router.navigate(['/consult']);
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