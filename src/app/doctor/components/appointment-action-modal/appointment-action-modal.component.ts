import { Component, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AppointmentActionData {
    action: 'reject' | 'cancel' | 'complete';
    appointmentId: string;
    patientName: string;
    // For reject
    reason?: string;
    availableHours?: string;
    // For cancel
    cancellationReason?: string;
    // For complete
    diagnosis?: string;
    prescription?: string;
    notes?: string;
}

@Component({
    selector: 'app-appointment-action-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './appointment-action-modal.component.html',
    styleUrls: ['./appointment-action-modal.component.css']
})
export class AppointmentActionModalComponent {
    isVisible = input.required<boolean>();
    actionType = input.required<'reject' | 'cancel' | 'complete'>();
    appointmentId = input.required<string>();
    patientName = input.required<string>();

    close = output<void>();
    actionSubmit = output<AppointmentActionData>();

    // Form fields
    reason = signal('');
    availableHours = signal('');
    cancellationReason = signal('');
    diagnosis = signal('');
    prescription = signal('');
    notes = signal('');

    isSubmitting = signal(false);

    getTitle(): string {
        switch (this.actionType()) {
            case 'reject': return 'Refuser le Rendez-vous';
            case 'cancel': return 'Annuler le Rendez-vous';
            case 'complete': return 'Terminer le Rendez-vous';
        }
    }

    onClose() {
        this.resetForm();
        this.close.emit();
    }

    onSubmit(event: Event) {
        event.preventDefault();

        const data: AppointmentActionData = {
            action: this.actionType(),
            appointmentId: this.appointmentId(),
            patientName: this.patientName()
        };

        switch (this.actionType()) {
            case 'reject':
                data.reason = this.reason();
                data.availableHours = this.availableHours();
                break;
            case 'cancel':
                data.cancellationReason = this.cancellationReason();
                break;
            case 'complete':
                data.diagnosis = this.diagnosis();
                data.prescription = this.prescription();
                data.notes = this.notes();
                break;
        }

        this.actionSubmit.emit(data);
        this.resetForm();
    }

    isValid(): boolean {
        switch (this.actionType()) {
            case 'reject':
                return true; // Reason is optional
            case 'cancel':
                return true; // Reason is optional
            case 'complete':
                return this.diagnosis().trim() !== '' &&
                    this.prescription().trim() !== '';
        }
    }

    private resetForm() {
        this.reason.set('');
        this.availableHours.set('');
        this.cancellationReason.set('');
        this.diagnosis.set('');
        this.prescription.set('');
        this.notes.set('');
    }
}
