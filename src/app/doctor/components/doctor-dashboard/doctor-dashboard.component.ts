import { Component, signal, computed, effect, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStatsComponent } from '../dashboard-stats/dashboard-stats.component';
import { DashboardAppointmentsComponent, Appointment } from '../dashboard-appointments/dashboard-appointments.component';
import { DashboardPatientsComponent } from '../dashboard-patients/dashboard-patients.component';
import { PatientDetailsModalComponent } from '../patient-details-modal/patient-details-modal.component';
import { AppointmentActionModalComponent, AppointmentActionData } from '../appointment-action-modal/appointment-action-modal.component';

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
    totalCompleted: number;
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
    imports: [CommonModule, DashboardStatsComponent, DashboardAppointmentsComponent, DashboardPatientsComponent, PatientDetailsModalComponent, AppointmentActionModalComponent],
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
        completedToday: 0,
        totalCompleted: 0
    });

    appointments = signal<Appointment[]>([]);
    recentPatients = signal<Patient[]>([]);
    selectedTab = signal<'overview' | 'appointments' | 'patients'>('overview');
    isLoading = signal(true);
    currentTime = signal(new Date());

    // Modals
    showPatientInfo = signal(false);
    selectedPatient = signal<Patient | null>(null);
    selectedAppointmentContext = signal<Appointment | null>(null);
    loadingPatientInfo = signal(false);
    currentUser = signal<any>(null);
    showProfileModal = signal(false);

    // Appointment action modal
    showActionModal = signal(false);
    currentActionType = signal<'reject' | 'cancel' | 'complete'>('reject');
    currentActionAppointmentId = signal('');
    currentActionPatientName = signal('');

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
            const stats = await this.appointmentApi.getDashboardStats().toPromise();
            console.log('📊 Stats response:', stats);

            if (stats) {
                console.log('✅ Loaded stats from API:', stats);

                this.stats.set({
                    totalPatients: stats.totalPatients || 0,
                    todayAppointments: stats.todayAppointments || 0,
                    pendingConsultations: stats.pendingAppointments || 0,
                    completedToday: stats.todayCompleted || 0,
                    totalCompleted: stats.completedAppointments || 0
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
                    // Parse the appointmentDateTime - handle different formats
                    let appointmentDate: Date;
                    let timeStr: string;
                    
                    console.log('🕐 Raw appointmentDateTime:', apt.appointmentDateTime, 'Type:', typeof apt.appointmentDateTime);
                    
                    if (apt.appointmentDateTime) {
                        // Handle array format [2024, 12, 1, 14, 0] from Java LocalDateTime
                        if (Array.isArray(apt.appointmentDateTime)) {
                            const [year, month, day, hour = 0, minute = 0] = apt.appointmentDateTime;
                            appointmentDate = new Date(year, month - 1, day, hour, minute);
                            console.log('📆 Parsed from array:', appointmentDate);
                        } else if (typeof apt.appointmentDateTime === 'string') {
                            // Handle ISO string format
                            appointmentDate = new Date(apt.appointmentDateTime);
                            console.log('📆 Parsed from string:', appointmentDate);
                        } else {
                            // Handle object with date/time properties
                            appointmentDate = new Date();
                            console.log('⚠️ Unknown format, using current date');
                        }
                    } else {
                        appointmentDate = new Date();
                    }

                    // Check if date is valid
                    if (isNaN(appointmentDate.getTime())) {
                        console.error('❌ Invalid date for appointment:', apt.id);
                        appointmentDate = new Date();
                    }

                    // Format time properly
                    timeStr = appointmentDate.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                    });

                    console.log('✅ Final date:', appointmentDate, 'Time:', timeStr);

                    return {
                        id: apt.id,
                        patientId: apt.patientId,
                        patientName: apt.patientName,
                        patientEmail: apt.patientEmail,
                        patientPhone: apt.patientPhone,
                        time: timeStr,
                        date: appointmentDate, // Pass Date object directly for date pipe
                        type: apt.appointmentType,
                        status: apt.status,
                        notes: apt.notes,
                        appointmentDateTime: apt.appointmentDateTime,
                        cancelledBy: apt.cancelledBy,
                        cancellationReason: apt.cancellationReason,
                        doctorResponseReason: apt.doctorResponseReason,
                        availableHoursSuggestion: apt.availableHoursSuggestion,
                        reason: apt.reason,
                        diagnosis: apt.diagnosis,
                        prescription: apt.prescription,
                        doctorNotes: apt.doctorNotes
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
            const patients = await this.appointmentApi.getMyPatients().toPromise();
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

    // Actions
    async acceptAppointment(appointmentId: string) {
        try {
            const updatedAppointment = await this.appointmentApi.acceptAppointment(appointmentId).toPromise();
            if (updatedAppointment) {
                console.log('✅ Appointment accepted:', updatedAppointment);
                this.updateAppointmentStatus(appointmentId, 'ACCEPTED');
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
                        completedToday: current.completedToday + 1,
                        totalCompleted: current.totalCompleted + 1
                    };
                default:
                    return current;
            }
        });
    }

    // Patient Info
    viewPatientInfo(patientId: string, appointmentContext?: Appointment) {
        this.loadingPatientInfo.set(true);
        this.showPatientInfo.set(true);
        this.selectedAppointmentContext.set(appointmentContext || null);

        // Try to find patient in recent patients list
        const patient = this.recentPatients().find(p => p.id === patientId);

        if (patient) {
            // Merge appointment details if available (especially phone which might be missing in patient list)
            if (appointmentContext?.patientPhone && !patient.phone) {
                this.selectedPatient.set({
                    ...patient,
                    phone: appointmentContext.patientPhone
                });
            } else {
                this.selectedPatient.set(patient);
            }
        } else if (appointmentContext) {
            // Fallback to appointment data if patient not found in list
            this.selectedPatient.set({
                id: appointmentContext.patientId,
                name: appointmentContext.patientName,
                email: appointmentContext.patientEmail || '',
                phone: appointmentContext.patientPhone,
                condition: 'Unknown',
                totalAppointments: 0,
                completedAppointments: 0,
                cancelledAppointments: 0
            });
        }

        this.loadingPatientInfo.set(false);
    }

    closePatientInfo() {
        this.showPatientInfo.set(false);
        this.selectedPatient.set(null);
        this.selectedAppointmentContext.set(null);
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

    // Appointment action modal handlers
    openRejectModal(appointmentId: string) {
        const appointment = this.appointments().find(a => a.id === appointmentId);
        if (appointment) {
            this.currentActionType.set('reject');
            this.currentActionAppointmentId.set(appointmentId);
            this.currentActionPatientName.set(appointment.patientName);
            this.showActionModal.set(true);
        }
    }

    openCancelModal(appointmentId: string) {
        const appointment = this.appointments().find(a => a.id === appointmentId);
        if (appointment) {
            this.currentActionType.set('cancel');
            this.currentActionAppointmentId.set(appointmentId);
            this.currentActionPatientName.set(appointment.patientName);
            this.showActionModal.set(true);
        }
    }

    openCompleteModal(appointmentId: string) {
        const appointment = this.appointments().find(a => a.id === appointmentId);
        if (appointment) {
            this.currentActionType.set('complete');
            this.currentActionAppointmentId.set(appointmentId);
            this.currentActionPatientName.set(appointment.patientName);
            this.showActionModal.set(true);
        }
    }

    closeActionModal() {
        this.showActionModal.set(false);
    }

    async handleActionSubmit(data: AppointmentActionData) {
        try {
            const appointmentId = this.currentActionAppointmentId();

            if (data.action === 'reject') {
                await this.appointmentApi.rejectAppointment(
                    appointmentId,
                    data.reason || '',
                    data.availableHours
                ).toPromise();
                this.updateAppointmentStatus(appointmentId, 'REJECTED');
                this.updateStatsAfterAction('reject');
            } else if (data.action === 'cancel') {
                await this.appointmentApi.cancelAppointment(
                    appointmentId,
                    data.cancellationReason || ''
                ).toPromise();
                this.updateAppointmentStatus(appointmentId, 'CANCELLED');
            } else if (data.action === 'complete') {
                await this.appointmentApi.completeAppointment(
                    appointmentId,
                    data.diagnosis || '',
                    data.prescription || '',
                    data.notes || ''
                ).toPromise();
                this.updateAppointmentStatus(appointmentId, 'COMPLETED');
                this.updateStatsAfterAction('complete');
            }

            // Refresh appointments
            await this.loadAppointmentsFromAPI();
            this.closeActionModal();
        } catch (error) {
            console.error('❌ Error handling action:', error);
            alert('Error processing request. Please try again.');
        }
    }

    ngOnDestroy() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
    }
}


