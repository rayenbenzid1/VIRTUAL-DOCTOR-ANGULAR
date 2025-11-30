import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminUserService } from '../../services/admin-user.service';
import {
  UserManagementResponse,
  UserSearchRequest,
  UserStatistics
} from '../../models/user.models';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, UserCardComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  private adminUserService = inject(AdminUserService);
  private router = inject(Router);

  // Signals
  loading = signal(true);
  users = signal<UserManagementResponse[]>([]);
  statistics = signal<UserStatistics>({
    totalUsers: 0,
    totalDoctors: 0,
    totalAdmins: 0
  });

  // Filters
  selectedRole = signal<string | null>(null);
  searchQuery = signal('');

  // Modal
  showUserModal = signal(false);
  selectedUser = signal<UserManagementResponse | null>(null);

  ngOnInit() {
    this.loadStatistics();
    this.loadAllUsers();
  }

  private loadStatistics() {
    this.adminUserService.getUserStatistics().subscribe({
      next: (response) => {
        if (response.success) {
          this.statistics.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
      }
    });
  }

  loadAllUsers() {
    this.loading.set(true);
    this.selectedRole.set(null);
    this.searchQuery.set('');

    this.adminUserService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading.set(false);
      }
    });
  }

  filterByRole(role: string) {
    this.loading.set(true);
    this.selectedRole.set(role);
    this.searchQuery.set('');

    this.adminUserService.getUsersByRole(role).subscribe({
      next: (response) => {
        if (response.success) {
          this.users.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error filtering users:', error);
        this.loading.set(false);
      }
    });
  }

  onSearch() {
    const query = this.searchQuery().trim();
    if (!query) {
      this.loadAllUsers();
      return;
    }

    this.loading.set(true);

    const searchRequest: UserSearchRequest = {
      email: query,
      firstName: query,
      lastName: query,
      role: this.selectedRole() || undefined,
      page: 0,
      size: 50
    };

    this.adminUserService.searchUsers(searchRequest).subscribe({
      next: (response) => {
        if (response.success) {
          this.users.set(response.data.content);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error searching users:', error);
        this.loading.set(false);
      }
    });
  }

  onViewDetails(user: UserManagementResponse) {
    this.selectedUser.set(user);
    this.showUserModal.set(true);
  }

  onDeleteUser(user: UserManagementResponse) {
    if (confirm(`Voulez-vous vraiment supprimer ${user.fullName} ?\n\nCette action est irréversible.`)) {
      this.adminUserService.deleteUser(user.id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('✅ Utilisateur supprimé avec succès');
            this.refreshData();
          }
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert('❌ Erreur lors de la suppression');
        }
      });
    }
  }

  closeUserModal() {
    this.showUserModal.set(false);
    this.selectedUser.set(null);
  }

  refreshData() {
    this.loadStatistics();
    if (this.selectedRole()) {
      this.filterByRole(this.selectedRole()!);
    } else {
      this.loadAllUsers();
    }
  }

  navigateToAdminDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }

  logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    }
  }
}