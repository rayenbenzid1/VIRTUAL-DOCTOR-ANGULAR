import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiometricData } from '../../services/biometric.api';

interface OrganData {
  name: string;
  status: string;
  icon: string;
  color: string;
  statusColor: string;
  details: string;
  metrics: { label: string; value: string }[];
}

interface OrganDataMap {
  heart: OrganData;
  lungs: OrganData;
  brain: OrganData;
  stomach: OrganData;
  [key: string]: OrganData;
}

@Component({
  selector: 'app-health-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health-avatar.component.html',
  styleUrls: ['./health-avatar.component.css'],
})
export class HealthAvatarComponent {
  @Input() biometricData?: BiometricData | null;

  hoveredOrgan = signal<string | null>(null);
  activeOrgan = signal<string | null>(null);

  // Fonction utilitaire : récupère la dernière valeur d'un tableau de mesures
  private getLastValue(arr: any[] | undefined | null, key: string): number | null {
    if (!arr || arr.length === 0) return null;
    const last = arr[arr.length - 1];
    return last?.[key] ?? null;
  }

  // Ou plus propre : moyenne du jour si disponible, sinon dernière mesure
  private getHeartRate(): string {
    const data = this.biometricData;

    // Si on a déjà une moyenne calculée (recommandé !)
    if (data?.avgHeartRate != null) {
      return `${Math.round(data.avgHeartRate)} bpm`;
    }

    // Sinon, on prend la dernière mesure du tableau heartRate
    const lastRate = this.getLastValue(data?.heartRate, 'bpm') ??
                     this.getLastValue(data?.heartRate, 'value') ??
                     this.getLastValue(data?.heartRate, 'rate');

    return lastRate != null ? `${Math.round(lastRate)} bpm` : '72 bpm';
  }

  organData = computed<OrganDataMap>(() => ({
    heart: {
      name: 'Cœur',
      status: 'Normal',
      icon: '❤️',
      color: '#fda4af',
      statusColor: '#f43f5e',
      details: 'Rythme cardiaque stable et sain.',
      metrics: [
        { label: 'Battements', value: this.getHeartRate() },
      ],
    },
    lungs: {
      name: 'Poumons',
      status: 'Bon',
      icon: '🫁',
      color: '#7dd3fc',
      statusColor: '#0284c7',
      details: 'Fonction respiratoire adéquate.',
      metrics: [
        { label: 'O2', value: `${this.biometricData?.oxygenSaturation?.[0]?.percentage ?? 98}%` },
      ],
    },
    brain: {
      name: 'Cerveau',
      status: 'Sain',
      icon: '🧠',
      color: '#c4b5fd',
      statusColor: '#7c3aed',
      details: 'Activité cognitive équilibrée.',
      metrics: [],
    },
    stomach: {
      name: 'Estomac',
      status: 'Normal',
      icon: '🍽️',
      color: '#fde68a',
      statusColor: '#ca8a04',
      details: 'Digestion en bon état.',
      metrics: [],
    },
  }));

  toggleOrgan(key: string): void {
    this.activeOrgan.set(this.activeOrgan() === key ? null : key);
  }

  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'bon':
      case 'normal':
      case 'sain':
        return '✔️';
      case 'moyen':
        return '⚠️';
      case 'faible':
        return '❗';
      default:
        return 'ℹ️';
    }
  }
}
