import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorPendingResponse } from '../../models/doctor.models';

@Component({
  selector: 'app-doctor-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-card.component.html',
  styleUrls: ['./doctor-card.component.css']
})
export class DoctorCardComponent {
  @Input() doctor!: DoctorPendingResponse;
  @Input() isPending: boolean = true;

  @Output() approve = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();
  @Output() viewDetails = new EventEmitter<void>();

  onApprove(): void {
    this.approve.emit();
  }

  onReject(): void {
    this.reject.emit();
  }

  onViewDetails(): void {
    this.viewDetails.emit();
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  }
}
