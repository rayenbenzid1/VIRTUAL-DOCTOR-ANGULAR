# Appointment Action Modal Integration Guide

## File: doctor-dashboard.component.ts

### Changes Needed:

1. **Add Import (after line 6)**
```typescript
import { AppointmentActionModalComponent, AppointmentActionData } from '../appointment-action-modal/appointment-action-modal.component';
```

2. **Update @Component imports array (line 46)**
Change:
```typescript
imports: [CommonModule, DashboardStatsComponent, DashboardAppointmentsComponent, DashboardPatientsComponent, PatientDetailsModalComponent],
```
To:
```typescript
imports: [CommonModule, DashboardStatsComponent, DashboardAppointmentsComponent, DashboardPatientsComponent, PatientDetailsModalComponent, AppointmentActionModalComponent],
```

3. **Add Modal Signals (after line 75, after showProfileModal)**
```typescript
    // Appointment action modal
    showActionModal = signal(false);
    currentActionType = signal<'reject' | 'cancel' | 'complete'>('reject');
    currentActionAppointmentId = signal('');
    currentActionPatientName = signal('');
```

4. **Add Modal Handler Methods (add before ngOnDestroy at the end)**
```typescript
    // Appointment action modal handlers
    openRejectModal(data: {id: string, name: string}) {
        this.currentActionType.set('reject');
        this.currentActionAppointmentId.set(data.id);
        this.currentActionPatientName.set(data.name);
        this.showActionModal.set(true);
    }

    openC

ancelModal(data: {id: string, name: string}) {
        this.currentActionType.set('cancel');
        this.currentActionAppointmentId.set(data.id);
        this.currentActionPatientName.set(data.name);
        this.showActionModal.set(true);
    }

    openCompleteModal(data: {id: string, name: string}) {
        this.currentActionType.set('complete');
        this.currentActionAppointmentId.set(data.id);
        this.currentActionPatientName.set(data.name);
        this.showActionModal.set(true);
    }

    closeActionModal() {
        this.showActionModal.set(false);
    }

    async handleActionSubmit(data: AppointmentActionData) {
        try {
            const appointmentId = this.currentActionAppointmentId();
            
            if (data.actionType === 'reject') {
                await this.rejectAppointment(appointmentId);
            } else if (data.actionType === 'cancel') {
                await this.cancelAppointment(appointmentId);
            } else if (data.actionType === 'complete') {
                await this.completeAppointment(appointmentId);
            }
            
            this.closeActionModal();
        } catch (error) {
            console.error('❌ Error handling action:', error);
        }
    }
```

## File: doctor-dashboard.component.html

### Add Modal Component (before closing div, around line 145)

```html
<!-- Appointment Action Modal -->
<app-appointment-action-modal
    [isVisible]="showActionModal()"
    [actionType]="currentActionType()"
    [appointmentId]="currentActionAppointmentId()"
    [patientName]="currentActionPatientName()"
    (submit)="handleActionSubmit($event)"
    (close)="closeActionModal()">
</app-appointment-action-modal>
```

### Update Event Handlers

In the dashboard-appointments component binding (around line 78), change:
```html
<app-dashboard-appointments
    [appointments]="appointments()"
    (accept)="acceptAppointment($event)"
    (reject)="rejectAppointment($event)"
    (cancel)="cancelAppointment($event)"
    (complete)="completeAppointment($event)"
    (viewPatient)="viewPatientInfo($event)"
/>
```

To:
```html
<app-dashboard-appointments
    [appointments]="appointments()"
    (accept)="acceptAppointment($event)"
    (reject)="openRejectModal($event)"
    (cancel)="openCancelModal($event)"
    (complete)="openCompleteModal($event)"
    (viewPatient)="viewPatientInfo($event)"
/>
```

---

These are ALL the changes needed to fully integrate the appointment action modal!
