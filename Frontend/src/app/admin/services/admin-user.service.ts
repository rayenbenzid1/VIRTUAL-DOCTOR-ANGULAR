import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  UserManagementResponse,
  UserSearchRequest,
  UserStatistics,
  PageResponse,
  DoctorResponse
} from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.BASE_URL}/user-service/api/v1/admin/users`;

  getAllUsers(): Observable<{ success: boolean; message: string; data: UserManagementResponse[] }> {
    return this.http.get<{ success: boolean; message: string; data: UserManagementResponse[] }>(this.baseUrl);
  }

  // ✅ Correction: L'API retourne directement un tableau DoctorResponse[]
  getAllDoctors(): Observable<DoctorResponse[]> {
    return this.http.get<DoctorResponse[]>('http://localhost:8888/doctor-activation-service/api/admin/doctors');
  }

  getUsersByRole(role: string): Observable<{ success: boolean; message: string; data: UserManagementResponse[] }> {
    return this.http.get<{ success: boolean; message: string; data: UserManagementResponse[] }>(
      `${this.baseUrl}/role/${role}`
    );
  }

  searchUsers(request: UserSearchRequest): Observable<{ success: boolean; message: string; data: PageResponse<UserManagementResponse> }> {
    return this.http.post<{ success: boolean; message: string; data: PageResponse<UserManagementResponse> }>(
      `${this.baseUrl}/search`,
      request
    );
  }

  getUserStatistics(): Observable<{ success: boolean; message: string; data: UserStatistics }> {
    return this.http.get<{ success: boolean; message: string; data: UserStatistics }>(
      `${this.baseUrl}/statistics`
    );
  }

  // ✅ L'API retourne {"count": 2}
  getDoctorsStatistics(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(
      'http://localhost:8888/doctor-activation-service/api/admin/doctors/count'
    );
  }

  deleteUser(userId: string): Observable<{ success: boolean; message: string; data: null }> {
    return this.http.delete<{ success: boolean; message: string; data: null }>(
      `${this.baseUrl}/${userId}`
    );
  }

  // ✅ Supprimer un médecin
  deleteDoctor(doctorId: string): Observable<{ status: string; message: string }> {
    return this.http.delete<{ status: string; message: string }>(
      `http://localhost:8888/doctor-activation-service/api/admin/doctors/${doctorId}`
    );
  }
}