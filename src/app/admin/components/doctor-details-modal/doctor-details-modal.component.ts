import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorPendingResponse } from '../../models/doctor.models';

@Component({
  selector: 'app-doctor-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-details-modal.component.html',
  styleUrls: ['./doctor-details-modal.component.css']
})
export class DoctorDetailsModalComponent {
  @Input() isVisible: boolean = false;
  @Input() doctor: DoctorPendingResponse | null = null;

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  formatDate(dateString: string | undefined): string {
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