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
