import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentApiService, AppointmentResponse, DoctorInfo, AppointmentRequest } from '../../services/appointment.api';

@Component({
    selector: 'app-appointments',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
    private appointmentApi = inject(AppointmentApiService);
    private router = inject(Router);

    isLoading = signal(true);
    appointments = signal<AppointmentResponse[]>([]);
    availableDoctors = signal<DoctorInfo[]>([]);
    showBookModal = signal(false);
    showCancelModal = signal(false);
    selectedAppointmentId = signal('');

    // Form data
    selectedDoctorId = signal('');
    appointmentDate = signal('');
    appointmentTime = signal('');
    appointmentType = signal('CONSULTATION');
    reason = signal('');
    notes = signal('');
    cancellationReason = signal('');

    ngOnInit() {
        this.loadAppointments();
        this.loadAvailableDoctors();
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    async loadAppointments() {
        try {
            this.isLoading.set(true);
            const appointments = await this.appointmentApi.getMyAppointments().toPromise();
            this.appointments.set(appointments || []);
        } catch (error) {
            console.error('Error loading appointments:', error);
            this.appointments.set([]);
        } finally {
            this.isLoading.set(false);
        }
    }

    async loadAvailableDoctors() {
        try {
            const doctors = await this.appointmentApi.getAvailableDoctors().toPromise();
            console.log('🩺 Available doctors response:', doctors);
            if (doctors && doctors.length > 0) {
                console.log('🩺 First doctor object:', JSON.stringify(doctors[0], null, 2));
            }
            this.availableDoctors.set(doctors || []);
        } catch (error) {
            console.error('Error loading doctors:', error);
            this.availableDoctors.set([]);
        }
    }

    openBookModal() {
        this.resetForm();
        this.showBookModal.set(true);
    }

    closeBookModal() {
        this.showBookModal.set(false);
        this.resetForm();
    }

    resetForm() {
        this.selectedDoctorId.set('');
        this.appointmentDate.set('');
        this.appointmentTime.set('');
        this.appointmentType.set('CONSULTATION');
        this.reason.set('');
        this.notes.set('');
    }

    async bookAppointment() {
        if (!this.selectedDoctorId() || !this.appointmentDate() || !this.appointmentTime() || !this.reason()) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        try {
            const dateTime = `${this.appointmentDate()}T${this.appointmentTime()}:00`;

            const request: AppointmentRequest = {
                doctorId: this.selectedDoctorId(),
                appointmentDateTime: dateTime,
                appointmentType: this.appointmentType(),
                reason: this.reason(),
                notes: this.notes()
            };

            await this.appointmentApi.createAppointment(request).toPromise();
            alert('Rendez-vous créé avec succès!');
            this.closeBookModal();
            this.loadAppointments();
        } catch (error: any) {
            console.error('Error booking appointment:', error);
            const errorMsg = error.error?.message || error.message || 'Erreur inconnue';
            alert(`Erreur lors de la création du rendez-vous: ${errorMsg}`);
        }
    }

    openCancelModal(appointmentId: string) {
        this.selectedAppointmentId.set(appointmentId);
        this.cancellationReason.set('');
        this.showCancelModal.set(true);
    }

    closeCancelModal() {
        this.showCancelModal.set(false);
        this.selectedAppointmentId.set('');
        this.cancellationReason.set('');
    }

    async cancelAppointment() {
        if (!this.cancellationReason()) {
            alert('Veuillez fournir une raison d\'annulation');
            return;
        }

        try {
            await this.appointmentApi.cancelAppointment(
                this.selectedAppointmentId(),
                this.cancellationReason()
            ).toPromise();
            alert('Rendez-vous annulé avec succès');
            this.closeCancelModal();
            this.loadAppointments();
        } catch (error: any) {
            console.error('Error cancelling appointment:', error);
            const errorMsg = error.error?.message || error.message || 'Erreur inconnue';
            alert(`Erreur lors de l'annulation: ${errorMsg}`);
        }
    }

    getStatusClass(status: string): string {
        const statusMap: { [key: string]: string } = {
            'PENDING': 'status-pending',
            'ACCEPTED': 'status-accepted',
            'SCHEDULED': 'status-scheduled',
            'COMPLETED': 'status-completed',
            'CANCELLED': 'status-cancelled',
            'REJECTED': 'status-rejected'
        };
        return statusMap[status] || 'status-default';
    }

    getStatusLabel(status: string): string {
        const labelMap: { [key: string]: string } = {
            'PENDING': 'En attente',
            'ACCEPTED': 'Accepté',
            'SCHEDULED': 'Programmé',
            'COMPLETED': 'Terminé',
            'CANCELLED': 'Annulé',
            'REJECTED': 'Rejeté'
        };
        return labelMap[status] || status;
    }

    formatDateTime(dateTime: string | number[]): string {
        try {
            let date: Date;
            
            // Handle array format [2024, 12, 1, 14, 0] from Java LocalDateTime
            if (Array.isArray(dateTime)) {
                const [year, month, day, hour = 0, minute = 0] = dateTime;
                date = new Date(year, month - 1, day, hour, minute);
            } else {
                date = new Date(dateTime);
            }
            
            return date.toLocaleString('fr-FR', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return String(dateTime);
        }
    }

    getCurrentDate(): string {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    getDoctorDisplayName(doctor: DoctorInfo): string {
        // Try different name properties that backend might send
        if (doctor.name) return doctor.name;
        if (doctor.fullName) return doctor.fullName;
        if (doctor.firstName || doctor.lastName) {
            return `${doctor.firstName || ''} ${doctor.lastName || ''}`.trim();
        }
        return doctor.email?.split('@')[0] || 'Unknown';
    }

    canCancel(appointment: AppointmentResponse): boolean {
        return appointment.status === 'PENDING' ||
            appointment.status === 'ACCEPTED' ||
            appointment.status === 'SCHEDULED';
    }
}
