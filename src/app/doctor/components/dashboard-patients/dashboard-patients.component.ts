import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Patient {
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
    selector: 'app-dashboard-patients',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard-patients.component.html',
    styleUrls: ['./dashboard-patients.component.css']
})
export class DashboardPatientsComponent {
    @Input() patients: Patient[] = [];
    @Input() viewType: 'list' | 'grid' = 'list';

    @Output() viewInfo = new EventEmitter<string>();

    onViewInfo(id: string) {
        this.viewInfo.emit(id);
    }
}
