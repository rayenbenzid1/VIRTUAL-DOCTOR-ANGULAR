import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    patientEmail?: string;
    patientPhone?: string;
    time: string;
    date: string | Date;
    type: string;
    status: string;
    notes?: string;
    appointmentDateTime?: string | number[];
    cancelledBy?: string;
    cancellationReason?: string;
    doctorResponseReason?: string;
    availableHoursSuggestion?: string;
    reason?: string;
    diagnosis?: string;
    prescription?: string;
    doctorNotes?: string;
}

@Component({
    selector: 'app-dashboard-appointments',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard-appointments.component.html',
    styleUrls: ['./dashboard-appointments.component.css']
})
export class DashboardAppointmentsComponent {
    @Input() appointments: Appointment[] = [];
    @Input() viewType: 'list' | 'table' = 'list';

    @Output() accept = new EventEmitter<string>();
    @Output() reject = new EventEmitter<string>();
    @Output() complete = new EventEmitter<string>();
    @Output() cancel = new EventEmitter<string>();
    @Output() viewInfo = new EventEmitter<{ patientId: string, appointment?: Appointment }>();

    // Status translation
    translateStatus(status: string): string {
        const statusMap: { [key: string]: string } = {
            'PENDING': 'En attente',
            'SCHEDULED': 'Planifié',
            'ACCEPTED': 'Accepté',
            'CONFIRMED': 'Confirmé',
            'COMPLETED': 'Terminé',
            'CANCELLED': 'Annulé',
            'REJECTED': 'Refusé'
        };
        return statusMap[status?.toUpperCase()] || status;
    }

    // Type translation
    translateType(type: string): string {
        const typeMap: { [key: string]: string } = {
            'CONSULTATION': 'Consultation',
            'FOLLOW_UP': 'Suivi',
            'FOLLOW-UP': 'Suivi',
            'Follow-up': 'Suivi',
            'EMERGENCY': 'Urgence',
            'CHECKUP': 'Bilan de santé',
            'CHECK_UP': 'Bilan de santé',
            'ROUTINE': 'Routine',
            'SPECIALIST': 'Spécialiste'
        };
        return typeMap[type] || type;
    }

    onAccept(id: string) {
        this.accept.emit(id);
    }

    onReject(id: string) {
        this.reject.emit(id);
    }

    onComplete(id: string) {
        this.complete.emit(id);
    }

    onCancel(id: string) {
        this.cancel.emit(id);
    }

    onViewInfo(patientId: string, appointment?: Appointment) {
        this.viewInfo.emit({ patientId, appointment });
    }
}
