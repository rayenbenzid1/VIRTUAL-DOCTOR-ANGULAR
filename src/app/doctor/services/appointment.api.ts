// appointment.api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASE_URL = environment.BASE_URL;

export interface AppointmentResponse {
    id: string;
    patientId: string;
    patientName: string;
    patientEmail: string;
    patientPhone?: string;
    doctorId: string;
    doctorName: string;
    specialization: string;
    appointmentDateTime: string;
    appointmentType: string;
    reason: string;
    notes?: string;
    status: string;
    cancelledBy?: string;
    cancellationReason?: string;
    doctorResponse?: string;
    doctorResponseReason?: string;
    availableHoursSuggestion?: string;
    diagnosis?: string;
    prescription?: string;
    doctorNotes?: string;
    completedAt?: string;
    createdAt: string;
}

export interface PatientInfoResponse {
    patientId: string;
    patientName: string;
    patientEmail: string;
    patientPhone?: string;
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    lastAppointmentDate: string;
    nextAppointmentDate?: string;
    firstVisitDate?: string;
}

export interface DoctorStatsResponse {
    doctorId: string;
    doctorName: string;
    specialization: string;
    todayAppointments: number;
    todayCompleted: number;
    todayPending: number;
    pendingAppointments: number;
    totalAppointments: number;
    totalPatients: number;
    upcomingAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    thisWeekAppointments: number;
    thisMonthAppointments: number;
    generatedAt: string;
}

export interface AppointmentResponseRequest {
    reason?: string;
    availableHours?: string;
}

export interface CompleteAppointmentRequest {
    diagnosis: string;
    prescription: string;
    notes: string;
}

@Injectable({
    providedIn: 'root'
})
export class AppointmentApiService {
    private http = inject(HttpClient);

    // Get all appointments for the logged-in doctor
    getDoctorAppointments(): Observable<AppointmentResponse[]> {
        return this.http.get<AppointmentResponse[]>(`${BASE_URL}/doctor-activation-service/api/doctors/appointments`);
    }

    // Get upcoming appointments
    getUpcomingAppointments(): Observable<AppointmentResponse[]> {
        return this.http.get<AppointmentResponse[]>(`${BASE_URL}/doctor-activation-service/api/doctors/appointments/upcoming`);
    }

    // Get pending appointments
    getPendingAppointments(): Observable<AppointmentResponse[]> {
        return this.http.get<AppointmentResponse[]>(`${BASE_URL}/doctor-activation-service/api/doctors/appointments/pending`);
    }

    // Get doctor's patients
    getMyPatients(): Observable<PatientInfoResponse[]> {
        return this.http.get<PatientInfoResponse[]>(`${BASE_URL}/doctor-activation-service/api/doctors/appointments/patients`);
    }

    // Get dashboard statistics
    getDashboardStats(): Observable<DoctorStatsResponse> {
        return this.http.get<DoctorStatsResponse>(`${BASE_URL}/doctor-activation-service/api/doctors/appointments/dashboard/stats`);
    }

    // Accept appointment
    acceptAppointment(appointmentId: string): Observable<AppointmentResponse> {
        return this.http.post<AppointmentResponse>(
            `${BASE_URL}/doctor-activation-service/api/doctors/appointments/${appointmentId}/accept`,
            {}
        );
    }

    // Reject appointment
    rejectAppointment(appointmentId: string, reason: string, availableHours?: string): Observable<AppointmentResponse> {
        const request: AppointmentResponseRequest = { reason };
        if (availableHours) {
            request.availableHours = availableHours;
        }

        return this.http.post<AppointmentResponse>(
            `${BASE_URL}/doctor-activation-service/api/doctors/appointments/${appointmentId}/reject`,
            request
        );
    }

    // Complete appointment
    completeAppointment(appointmentId: string, diagnosis: string, prescription: string, notes: string): Observable<AppointmentResponse> {
        const request = { diagnosis, prescription, notes };
        return this.http.post<AppointmentResponse>(
            `${BASE_URL}/doctor-activation-service/api/doctors/appointments/${appointmentId}/complete`,
            request
        );
    }

    // Cancel appointment
    cancelAppointment(appointmentId: string, reason: string): Observable<any> {
        return this.http.post<any>(
            `${BASE_URL}/doctor-activation-service/api/doctors/appointments/${appointmentId}/cancel`,
            { reason }
        );
    }

    // Get appointment details
    getAppointmentDetails(appointmentId: string): Observable<AppointmentResponse> {
        return this.http.get<AppointmentResponse>(`${BASE_URL}/doctor-activation-service/api/doctors/appointments/${appointmentId}`);
    }
}