// src/app/services/biometric.api.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BiometricData {
  id: string;
  email: string;
  receivedAt: string;
  date: string;
  totalSteps: number;
  avgHeartRate: number;
  minHeartRate: number;
  maxHeartRate: number;
  totalDistanceKm: string;
  totalSleepHours: string;
  totalHydrationLiters: string;
  stressLevel: string;
  stressScore: number;
  steps: StepRecord[];
  heartRate: HeartRateRecord[];
  distance: DistanceRecord[];
  sleep: SleepRecord[];
  exercise: ExerciseRecord[];
  oxygenSaturation: OxygenSaturationRecord[];
  bodyTemperature: BodyTemperatureRecord[];
  bloodPressure: BloodPressureRecord[];
  weight: WeightRecord[];
  height: HeightRecord[];
  hydration: HydrationRecord[];
}

export interface StepRecord {
  count: number;
  startTime: string;
  endTime: string;
}

export interface HeartRateRecord {
  samples: number[];
  startTime: string;
  endTime: string;
}

export interface DistanceRecord {
  distanceMeters: number;
  startTime: string;
  endTime: string;
}

export interface SleepRecord {
  title: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

export interface ExerciseRecord {
  title: string;
  exerciseType: number;
  exerciseTypeName: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  steps: number;
  distanceMeters: number;
  distanceKm: string;
  activeCalories: number;
  totalCalories: number;
  avgHeartRate: number;
  minHeartRate: number;
  maxHeartRate: number;
  avgCadence: number;
  minCadence: number;
  maxCadence: number;
  avgSpeedKmh: string | null;
  maxSpeedKmh: string | null;
  minSpeedKmh: string | null;
  avgStrideLengthMeters: string | null;
  minStrideLengthMeters: string | null;
  maxStrideLengthMeters: string | null;
  avgPowerWatts: number | null;
}

export interface OxygenSaturationRecord {
  percentage: number;
  time: string;
}

export interface BodyTemperatureRecord {
  temperature: number;
  time: string;
}

export interface BloodPressureRecord {
  systolic: number;
  diastolic: number;
  time: string;
}

export interface WeightRecord {
  weight: number;
  time: string;
}

export interface HeightRecord {
  height: number;
  time: string;
}

export interface HydrationRecord {
  volumeMl: number;
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class BiometricApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/health-server/fetch';

  getTodayData(userId: string): Observable<BiometricData> {
    return this.http.get<BiometricData>(`${this.baseUrl}/user/${userId}/today`);
  }
}