import { Component, signal, computed, effect, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorAuthApiService } from '../../../auth/services/doctor-auth.api';
import {
    AppointmentApiService,
    AppointmentResponse,
    PatientInfoResponse,
    DoctorStatsResponse
} from '../../services/appointment.api';

interface DashboardStats {
    totalPatients: number;
    todayAppointments: number;
    pendingConsultations: number;
    completedToday: number;
}

interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    patientEmail?: string;
    time: string;
    date: string;
    type: string;
    status: string;
    notes?: string;
    appointmentDateTime?: string;
    cancelledBy?: string;
    cancellationReason?: string;
    doctorResponseReason?: string;
    availableHoursSuggestion?: string;
}

interface Patient {
    id: string;
    name: string;
    email: string;
    age?: number;
    phone?: string;
    gender?: string;
    address?: string;
    lastVisit?: string;
    condition?: string;
    medicalHistory?: string[];
    allergies?: string[];
    currentMedications?: string[];
    totalAppointments?: number;
    completedAppointments?: number;
    cancelledAppointments?: number;
    nextAppointmentDate?: string;
    firstVisitDate?: string;
}

@Component({
    selector: 'app-doctor-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './doctor-dashboard.component.html',
    styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnDestroy {
    private doctorAuthApi = inject(DoctorAuthApiService);
    private appointmentApi = inject(AppointmentApiService);

    // Signals
    stats = signal<DashboardStats>({
        totalPatients: 0,
        todayAppointments: 0,
        pendingConsultations: 0,
        completedToday: 0
    });

    appointments = signal<Appointment[]>([]);
    recentPatients = signal<Patient[]>([]);
    selectedTab = signal<'overview' | 'appointments' | 'patients'>('overview');
    isLoading = signal(true);
    currentTime = signal(new Date());

    // Modals
    showPatientInfo = signal(false);
    selectedPatient = signal<Patient | null>(null);
    loadingPatientInfo = signal(false);
    currentUser = signal<any>(null);
    showProfileModal = signal(false);

    // Polling
    private pollingInterval: any = null;

    // Computed values
    upcomingAppointments = computed(() =>
        this.appointments().filter(apt =>
            apt.status === 'PENDING' || apt.status === 'SCHEDULED' || apt.status === 'ACCEPTED'
        )
    );

    pendingAppointments = computed(() =>
        this.appointments().filter(apt => apt.status === 'PENDING')
    );

    scheduledAppointments = computed(() =>
        this.appointments().filter(apt => apt.status === 'SCHEDULED' || apt.status === 'ACCEPTED')
    );

    completedAppointments = computed(() =>
        this.appointments().filter(apt => apt.status === 'COMPLETED')
    );

    completionRate = computed(() => {
        const total = this.stats().todayAppointments;
        const completed = this.stats().completedToday;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    });

    greeting = computed(() => {
        const hour = this.currentTime().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    });

    doctorName = computed(() => {
        const user = this.currentUser();
        return user?.name || user?.fullName || 'Doctor';
    });

    constructor() {
        // Update time every minute
        effect(() => {
            const interval = setInterval(() => {
                this.currentTime.set(new Date());
            }, 60000);
            return () => clearInterval(interval);
        });

        // Load initial data
        this.initializeDashboard();

        // Setup polling for real-time updates
        this.pollingInterval = setInterval(() => {
            this.refreshData();
        }, 30000); // Every 30 seconds
    }

    private async initializeDashboard() {
        await this.loadUserData();
        await this.loadDashboardData();
        this.isLoading.set(false);
    }

    private async loadUserData() {
        try {
            const user = localStorage.getItem('user');
            if (user && user !== 'undefined' && user !== 'null') {
                this.currentUser.set(JSON.parse(user));
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }

    private async loadDashboardData() {
        try {
            await Promise.all([
                this.loadStatsFromAPI(),
                this.loadAppointmentsFromAPI(),
                this.loadPatientsFromAPI()
            ]);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    private async refreshData() {
        // Only refresh if not loading
        if (!this.isLoading()) {
            await this.loadDashboardData();
        }
    }

    // Load stats from API
    private async loadStatsFromAPI() {
        try {
            console.log('🔄 Loading stats from API...');
            const stats = await this.appointmentApi.getDoctorStats().toPromise();
            console.log('📊 Stats response:', stats);

            if (stats) {
                console.log('✅ Loaded stats from API:', stats);

                this.stats.set({
                    totalPatients: stats.totalPatients || 0,
                    todayAppointments: stats.todayAppointments || 0,
                    pendingConsultations: stats.pendingAppointments || 0,
                    completedToday: stats.todayCompleted || 0
                });
            } else {
                console.warn('⚠️ Stats response was empty or null');
            }
        } catch (error) {
            console.error('❌ Error loading stats from API:', error);
        }
    }

    // Load appointments from API
    private async loadAppointmentsFromAPI() {
        try {
            console.log('🔄 Loading appointments from API...');
            const appointments = await this.appointmentApi.getDoctorAppointments().toPromise();
            console.log('📅 Appointments response:', appointments);

            if (appointments && appointments.length > 0) {
                console.log('✅ Loaded appointments from API:', appointments);

                const transformedAppointments: Appointment[] = appointments.map(apt => {
                    const appointmentDate = new Date(apt.appointmentDateTime);
                    return {
                        id: apt.id,
                        patientId: apt.patientId,
                        patientName: apt.patientName,
                        patientEmail: apt.patientEmail,
                        time: appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        date: appointmentDate.toISOString().split('T')[0],
                        type: apt.appointmentType,
                        status: apt.status,
                        notes: apt.notes,
                        appointmentDateTime: apt.appointmentDateTime,
                        cancelledBy: apt.cancelledBy,
                        cancellationReason: apt.cancellationReason,
                        doctorResponseReason: apt.doctorResponseReason,
                        availableHoursSuggestion: apt.availableHoursSuggestion
                    };
                });

                this.appointments.set(transformedAppointments);
            } else {
                console.warn('⚠️ No appointments found');
            }
        } catch (error) {
            console.error('❌ Error loading appointments from API:', error);
        }
    }

    // Load patients from API
    private async loadPatientsFromAPI() {
        try {
            console.log('🔄 Loading patients from API...');
            const patients = await this.appointmentApi.getDoctorPatients().toPromise();
            console.log('👥 Patients response:', patients);

            if (patients && patients.length > 0) {
                console.log('✅ Loaded patients from API:', patients);

                const transformedPatients: Patient[] = patients.map(p => ({
                    id: p.patientId,
                    name: p.patientName,
                    email: p.patientEmail,
                    phone: p.patientPhone,
                    lastVisit: p.lastAppointmentDate,
                    condition: 'Follow-up', // Default value as backend doesn't provide this
                    totalAppointments: p.totalAppointments,
                    completedAppointments: p.completedAppointments,
                    cancelledAppointments: p.cancelledAppointments,
                    nextAppointmentDate: p.nextAppointmentDate,
                    firstVisitDate: p.firstVisitDate
                }));

                this.recentPatients.set(transformedPatients);
            } else {
                console.warn('⚠️ No patients found');
            }
        } catch (error) {
            console.error('❌ Error loading patients from API:', error);
        }
    }

    // Appointment Actions
    async acceptAppointment(appointmentId: string) {
        try {
            const updatedAppointment = await this.appointmentApi.acceptAppointment(appointmentId).toPromise();
            if (updatedAppointment) {
                console.log('✅ Appointment accepted:', updatedAppointment);
                this.updateAppointmentStatus(appointmentId, 'SCHEDULED');
                this.updateStatsAfterAction('accept');
                alert('Appointment accepted successfully!');
            }
        } catch (error) {
            console.error('❌ Error accepting appointment:', error);
            alert('Error accepting appointment. Please try again.');
        }
    }

    async rejectAppointment(appointmentId: string) {
        const reason = prompt('Please provide a reason for rejection (optional):') || '';
        const availableHours = prompt('Please suggest available hours (optional):') || '';

        try {
            const updatedAppointment = await this.appointmentApi.rejectAppointment(appointmentId, reason, availableHours).toPromise();
            if (updatedAppointment) {
                console.log('✅ Appointment rejected:', updatedAppointment);
                this.updateAppointmentStatus(appointmentId, 'REJECTED');
                this.updateStatsAfterAction('reject');
                alert('Appointment rejected.');
            }
        } catch (error) {
            console.error('❌ Error rejecting appointment:', error);
            alert('Error rejecting appointment. Please try again.');
        }
    }

    async cancelAppointment(appointmentId: string) {
        const reason = prompt('Please provide a reason for cancellation (optional):') || '';

        try {
            await this.appointmentApi.cancelAppointment(appointmentId, reason).toPromise();
            console.log('✅ Appointment cancelled');
            this.updateAppointmentStatus(appointmentId, 'CANCELLED');
            alert('Appointment cancelled.');
        } catch (error) {
            console.error('❌ Error cancelling appointment:', error);
            alert('Error cancelling appointment. Please try again.');
        }
    }

    async completeAppointment(appointmentId: string) {
        const diagnosis = prompt('Enter diagnosis:') || '';
        const prescription = prompt('Enter prescription:') || '';
        const notes = prompt('Add any notes about this appointment (optional):') || '';

        if (!diagnosis || !prescription) {
            alert('Diagnosis and prescription are required.');
            return;
        }

        try {
            const updatedAppointment = await this.appointmentApi.completeAppointment(appointmentId, diagnosis, prescription, notes).toPromise();
            if (updatedAppointment) {
                console.log('✅ Appointment completed:', updatedAppointment);
                this.updateAppointmentStatus(appointmentId, 'COMPLETED');
                this.updateStatsAfterAction('complete');
                alert('Appointment marked as completed!');
            }
        } catch (error) {
            console.error('❌ Error completing appointment:', error);
            alert('Error completing appointment. Please try again.');
        }
    }

    private updateAppointmentStatus(appointmentId: string, newStatus: string) {
        const currentAppointments = this.appointments();
        const updatedAppointments = currentAppointments.map(apt =>
            apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        );
        this.appointments.set(updatedAppointments);
    }

    private updateStatsAfterAction(action: 'accept' | 'reject' | 'complete') {
        this.stats.update(current => {
            switch (action) {
                case 'accept':
                case 'reject':
                    return {
                        ...current,
                        pendingConsultations: Math.max(0, current.pendingConsultations - 1)
                    };
                case 'complete':
                    return {
                        ...current,
                        completedToday: current.completedToday + 1
                    };
                default:
                    return current;
            }
        });
    }

    // Patient Info
    async viewPatientInfo(patientId: string) {
        this.loadingPatientInfo.set(true);
        this.showPatientInfo.set(true);

        try {
            const patientInfo = await this.appointmentApi.getPatientInfo(patientId).toPromise();
            if (patientInfo) {
                this.selectedPatient.set({
                    id: patientInfo.id,
                    name: patientInfo.name || `${patientInfo.firstName} ${patientInfo.lastName}`,
                    email: patientInfo.email,
                    age: patientInfo.age,
                    phone: patientInfo.phone,
                    gender: patientInfo.gender,
                    address: patientInfo.address,
                    medicalHistory: patientInfo.medicalHistory,
                    allergies: patientInfo.allergies,
                    currentMedications: patientInfo.currentMedications
                });
            } else {
                const patient = this.recentPatients().find(p => p.id === patientId);
                if (patient) {
                    this.selectedPatient.set(patient);
                }
            }
        } catch (error) {
            console.error('Error loading patient details:', error);
            const patient = this.recentPatients().find(p => p.id === patientId);
            if (patient) {
                this.selectedPatient.set(patient);
            }
        }

        this.loadingPatientInfo.set(false);
    }

    closePatientInfo() {
        this.showPatientInfo.set(false);
        this.selectedPatient.set(null);
    }

    // Tab Navigation
    selectTab(tab: 'overview' | 'appointments' | 'patients') {
        this.selectedTab.set(tab);
    }

    // Profile Methods
    openProfileSettings() {
        this.showProfileModal.set(true);
    }

    closeProfileSettings() {
        this.showProfileModal.set(false);
    }

    updateProfile(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const nameInput = form.querySelector('input[type="text"]') as HTMLInputElement;
        const newName = nameInput.value;

        if (newName) {
            const user = this.currentUser() || {};
            const updatedUser = { ...user, name: newName };
            this.currentUser.set(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            alert('Profile updated successfully!');
            this.closeProfileSettings();
        }
    }

    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }

    ngOnDestroy() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
    }
}