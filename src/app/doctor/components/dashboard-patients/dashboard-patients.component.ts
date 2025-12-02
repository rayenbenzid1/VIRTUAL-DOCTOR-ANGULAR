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

    // Condition/Type translation
    translateCondition(condition: string | undefined): string {
        if (!condition) return '';
        const conditionMap: { [key: string]: string } = {
            'Follow-up': 'Suivi',
            'FOLLOW_UP': 'Suivi',
            'FOLLOW-UP': 'Suivi',
            'Checkup': 'Bilan de santé',
            'CHECK_UP': 'Bilan de santé',
            'CHECKUP': 'Bilan de santé',
            'Emergency': 'Urgence',
            'EMERGENCY': 'Urgence',
            'Consultation': 'Consultation',
            'CONSULTATION': 'Consultation',
            'Routine': 'Routine',
            'ROUTINE': 'Routine'
        };
        return conditionMap[condition] || condition;
    }

    onViewInfo(id: string) {
        this.viewInfo.emit(id);
    }
}
