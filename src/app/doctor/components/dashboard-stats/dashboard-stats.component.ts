import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DashboardStats {
    totalPatients: number;
    todayAppointments: number;
    pendingConsultations: number;
    completedToday: number;
    totalCompleted: number;
}

@Component({
    selector: 'app-dashboard-stats',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard-stats.component.html',
    styleUrls: ['./dashboard-stats.component.css']
})
export class DashboardStatsComponent {
    @Input() stats: DashboardStats = {
        totalPatients: 0,
        todayAppointments: 0,
        pendingConsultations: 0,
        completedToday: 0,
        totalCompleted: 0
    };
    @Input() completionRate: number = 0;
}
