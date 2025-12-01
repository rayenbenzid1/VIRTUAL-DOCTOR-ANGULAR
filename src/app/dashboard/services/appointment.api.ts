// Patient Appointment API Service
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASE_URL = environment.BASE_URL;

// Backend ApiResponse wrapper structure
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp?: string;
}

export interface AppointmentRequest {
    doctorId: string;
    appointmentDateTime: string;
    appointmentType: string;
    reason: string;
    notes?: string;
}

export interface AppointmentResponse {
    id: string;
    patientId: string;
    patientEmail: string;
    patientName: string;
    patientPhone?: string;
    doctorId: string;
    doctorEmail: string;
    doctorName: string;
    specialization: string;
    appointmentDateTime: string | number[]; // Can be ISO string or Java LocalDateTime array
    appointmentType: string;
    reason: string;
    notes?: string;
    status: string;
}

export interface DoctorInfo {
    id: string;
    name?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    specialization?: string;
    phoneNumber?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AppointmentApiService {
    private http = inject(HttpClient);

    /**
     * Get all available activated doctors
     */
    getAvailableDoctors(): Observable<DoctorInfo[]> {
        return this.http.get<ApiResponse<DoctorInfo[]>>(`${BASE_URL}/user-service/api/v1/appointments/doctors`)
            .pipe(map(response => response.data || []));
    }

    /**
     * Create a new appointment with a doctor
     */
    createAppointment(request: AppointmentRequest): Observable<AppointmentResponse> {
        return this.http.post<ApiResponse<AppointmentResponse>>(
            `${BASE_URL}/user-service/api/v1/appointments`,
            request
        ).pipe(map(response => response.data));
    }

    /**
     * Get my appointments (as a patient)
     */
    getMyAppointments(): Observable<AppointmentResponse[]> {
        return this.http.get<ApiResponse<AppointmentResponse[]>>(`${BASE_URL}/user-service/api/v1/appointments`)
            .pipe(map(response => response.data || []));
    }

    /**
     * Cancel an appointment
     */
    cancelAppointment(appointmentId: string, reason: string): Observable<any> {
        return this.http.post<ApiResponse<any>>(
            `${BASE_URL}/user-service/api/v1/appointments/${appointmentId}/cancel`,
            { reason }
        ).pipe(map(response => response.data));
    }
}
