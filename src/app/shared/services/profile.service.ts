// src/app/shared/services/profile.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  UpdateUserRequest, 
  ChangePasswordRequest, 
  UserResponse, 
  ApiResponse 
} from '../models/profile.models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.BASE_URL}/user-service/api/v1/users`;

  updateProfile(request: UpdateUserRequest): Observable<ApiResponse<UserResponse>> {
    return this.http.put<ApiResponse<UserResponse>>(
      `${this.baseUrl}/profile`,
      request
    ).pipe(
      tap(response => {
        // Mettre à jour localStorage avec les nouvelles données
        if (response.success && response.data) {
          const currentUser = localStorage.getItem('user');
          if (currentUser) {
            const user = JSON.parse(currentUser);
            const updatedUser = { ...user, ...response.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        }
      })
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(
      `${this.baseUrl}/change-password`,
      request
    );
  }

  getCurrentUser(): UserResponse | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}