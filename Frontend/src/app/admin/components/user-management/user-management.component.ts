import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminUserService } from '../../services/admin-user.service';
import {
  UserManagementResponse,
  UserSearchRequest,
  UserStatistics,
  DoctorResponse,
} from '../../models/user.models';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, UserCardComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  private adminUserService = inject(AdminUserService);
  private router = inject(Router);

  // Signals
  loading = signal(true);
  users = signal<UserManagementResponse[]>([]);
  doctorStatistics = signal(0);
  statistics = signal<UserStatistics>({ totalUsers: 0, totalAdmins: 0 });

  // Filters
  selectedRole = signal<string | null>(null);
  searchQuery = signal('');

  // Modal
  showUserModal = signal(false);
  selectedUser = signal<UserManagementResponse | null>(null);

  ngOnInit() {
    this.loadStatistics();
    this.loadAllUsersWithDoctors();
  }

  private loadStatistics() {
    this.adminUserService.getUserStatistics().subscribe({
      next: (res) => res.success && this.statistics.set(res.data),
      error: (err) => console.error('Error loading statistics:', err),
    });

    // ✅ L'API retourne {"count": 2}
    this.adminUserService.getDoctorsStatistics().subscribe({
      next: (res) => {
        console.log('Doctors count response:', res);
        this.doctorStatistics.set(res.count);
      },
      error: (err) => console.error('Error loading doctors statistics:', err),
    });
  }

  /** 🔹 Map DoctorResponse → UserManagementResponse */
  private mapDoctorToUser(doctor: DoctorResponse): UserManagementResponse {
    // Extraction du prénom et nom depuis fullName si nécessaire
    const nameParts = doctor.fullName.split(' ');
    const firstName = doctor.firstName || nameParts[0] || '';
    const lastName = doctor.lastName || nameParts.slice(1).join(' ') || '';

    console.log('Mapping doctor:', doctor.fullName, 'activationStatus:', doctor.activationStatus);

    return {
      id: doctor.doctorId, // ✅ Utiliser doctorId au lieu de id
      email: doctor.email,
      fullName: doctor.fullName,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: doctor.phoneNumber || undefined,
      roles: ['DOCTOR'],
      accountStatus: doctor.accountStatus || 'ACTIVE',
      isActivated: doctor.isActivated ?? true,
      isEmailVerified: doctor.isEmailVerified ?? true,
      createdAt: doctor.registrationDate,
      lastLoginAt: doctor.lastLoginAt || undefined,
      activationStatus: doctor.activationStatus, // ✅ Conserver le statut d'activation
    };
  }

  loadAllUsersWithDoctors() {
    this.loading.set(true);
    this.selectedRole.set(null);
    this.searchQuery.set('');

    this.adminUserService.getAllUsers().subscribe({
      next: (resUsers) => {
        let allUsers: UserManagementResponse[] = resUsers.success ? resUsers.data : [];

        // ✅ Charger les docteurs (l'API retourne directement un tableau)
        this.adminUserService.getAllDoctors().subscribe({
          next: (doctorsArray: DoctorResponse[]) => {
            // Mapper les docteurs vers UserManagementResponse
            const doctors: UserManagementResponse[] = doctorsArray.map((d) => this.mapDoctorToUser(d));
            allUsers = [...allUsers, ...doctors];
            this.users.set(allUsers);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Error loading doctors:', err);
            this.users.set(allUsers);
            this.loading.set(false);
          },
        });
      },
      error: (err) => {
        console.error('Error loading users:', err);
        // Même si les users échouent, essayer de charger les docteurs
        this.adminUserService.getAllDoctors().subscribe({
          next: (doctorsArray: DoctorResponse[]) => {
            const doctors: UserManagementResponse[] = doctorsArray.map((d) => this.mapDoctorToUser(d));
            this.users.set(doctors);
            this.loading.set(false);
          },
          error: (errDoctors) => {
            console.error('Error loading doctors:', errDoctors);
            this.loading.set(false);
          },
        });
      },
    });
  }

  loadAllUsers() {
    this.loading.set(true);
    this.selectedRole.set(null);
    this.searchQuery.set('');

    this.adminUserService.getAllUsers().subscribe({
      next: (res) => {
        if (res.success) {
          this.users.set(res.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.loading.set(false);
      },
    });
  }

  // ✅ Correction pour loadAllDoctors()
  loadAllDoctors() {
    this.loading.set(true);
    this.selectedRole.set('DOCTOR');
    this.searchQuery.set('');

    this.adminUserService.getAllDoctors().subscribe({
      next: (doctorsArray: DoctorResponse[]) => {
        const doctors: UserManagementResponse[] = doctorsArray.map((d) => this.mapDoctorToUser(d));
        this.users.set(doctors);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading doctors:', err);
        this.loading.set(false);
      },
    });
  }

  filterByRole(role: string) {
    this.loading.set(true);
    this.selectedRole.set(role);
    this.searchQuery.set('');

    this.adminUserService.getUsersByRole(role).subscribe({
      next: (res) => {
        if (res.success) {
          this.users.set(res.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error filtering users:', err);
        this.loading.set(false);
      },
    });
  }

  onSearch() {
    const query = this.searchQuery().trim();
    if (!query) {
      this.selectedRole() === 'DOCTOR' ? this.loadAllDoctors() : this.loadAllUsersWithDoctors();
      return;
    }

    this.loading.set(true);

    const searchRequest: UserSearchRequest = {
      email: query,
      firstName: query,
      lastName: query,
      role: this.selectedRole() || undefined,
      page: 0,
      size: 50,
    };

    this.adminUserService.searchUsers(searchRequest).subscribe({
      next: (res) => {
        if (res.success) {
          this.users.set(res.data.content);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error searching users:', err);
        this.loading.set(false);
      },
    });
  }

  onViewDetails(user: UserManagementResponse) {
    this.selectedUser.set(user);
    this.showUserModal.set(true);
  }

  onDeleteUser(user: UserManagementResponse) {
    if (
      !confirm(`Voulez-vous vraiment supprimer ${user.fullName} ?\nCette action est irréversible.`)
    )
      return;

    // ✅ Vérifier si c'est un médecin
    if (user.roles.includes('DOCTOR')) {
      this.adminUserService.deleteDoctor(user.id).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            alert('✅ Médecin supprimé avec succès');
            this.refreshData();
          }
        },
        error: (err) => {
          console.error('Error deleting doctor:', err);
          alert('❌ Erreur lors de la suppression du médecin');
        },
      });
    } else {
      // Supprimer un utilisateur normal
      this.adminUserService.deleteUser(user.id).subscribe({
        next: (res) => {
          if (res.success) {
            alert('✅ Utilisateur supprimé avec succès');
            this.refreshData();
          }
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('❌ Erreur lors de la suppression');
        },
      });
    }
  }

  closeUserModal() {
    this.showUserModal.set(false);
    this.selectedUser.set(null);
  }

  refreshData() {
    this.loadStatistics();
    if (this.selectedRole() === 'DOCTOR') this.loadAllDoctors();
    else if (this.selectedRole()) this.filterByRole(this.selectedRole()!);
    else this.loadAllUsersWithDoctors();
  }

  navigateToAdminDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }

  logout() {
    if (!confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}