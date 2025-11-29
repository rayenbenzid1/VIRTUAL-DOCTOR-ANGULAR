import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../dashboard-appointments/dashboard-appointments.component';
import { Patient } from '../dashboard-patients/dashboard-patients.component';

@Component({
    selector: 'app-patient-details-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './patient-details-modal.component.html',
    styleUrls: ['./patient-details-modal.component.css']
})
export class PatientDetailsModalComponent {
    @Input() patient: Patient | null = null;
    @Input() appointmentContext: Appointment | null = null;
    @Input() isVisible: boolean = false;
    @Input() isLoading: boolean = false;

    @Output() close = new EventEmitter<void>();

    onClose() {
        this.close.emit();
    }

    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
