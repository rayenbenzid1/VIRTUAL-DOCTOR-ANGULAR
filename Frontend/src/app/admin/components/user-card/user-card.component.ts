import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementResponse } from '../../models/user.models';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input() user!: UserManagementResponse;

  @Output() viewDetails = new EventEmitter<void>();
  @Output() deleteUser = new EventEmitter<void>();

  onViewDetails() {
    this.viewDetails.emit();
  }

  onDelete() {
    this.deleteUser.emit();
  }

  getRoleBadgeClass(roles: string[]): string {
    if (roles.includes('ADMIN')) return 'admin';
    if (roles.includes('DOCTOR')) return 'doctor';
    return 'user';
  }

  // ✅ Ajout de la méthode manquante pour l'activation status
  getActivationBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'pending';
      case 'APPROVED': return 'approved';
      case 'REJECTED': return 'rejected';
      default: return 'pending';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'active';
      case 'INACTIVE': return 'inactive';
      case 'LOCKED': return 'locked';
      case 'SUSPENDED': return 'suspended';
      default: return 'inactive';
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  }
}