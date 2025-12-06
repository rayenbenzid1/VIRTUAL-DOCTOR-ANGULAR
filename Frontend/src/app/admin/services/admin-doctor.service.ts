import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DoctorPendingResponse, DoctorActivationRequest } from '../models/doctor.models';

@Injectable({
  providedIn: 'root'
})
export class AdminDoctorService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.BASE_URL}/doctor-activation-service/api/admin/doctors`;

  getPendingDoctors(): Observable<DoctorPendingResponse[]> {
    return this.http.get<DoctorPendingResponse[]>(`${this.baseUrl}/pending`);
  }

  getActivatedDoctors(): Observable<DoctorPendingResponse[]> {
    return this.http.get<DoctorPendingResponse[]>(`${this.baseUrl}/activated`);
  }

  getPendingCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}/pending/count`);
  }
  getActivatedCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}/activated/count`);
  }

  activateDoctor(request: DoctorActivationRequest): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(
      `${this.baseUrl}/activate`,
      request
    );
  }
}