import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminDoctorService } from '../../services/admin-doctor.service';
import { DoctorPendingResponse, DoctorActivationRequest } from '../../models/doctor.models';
import { DoctorCardComponent } from '../doctor-card/doctor-card.component';
import { DoctorDetailsModalComponent } from '../doctor-details-modal/doctor-details-modal.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, DoctorCardComponent, DoctorDetailsModalComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private adminDoctorService = inject(AdminDoctorService);
  private router = inject(Router);

  // Signals
  selectedTab = signal<'pending' | 'activated'>('pending');
  loading = signal(true);
  pendingDoctors = signal<DoctorPendingResponse[]>([]);
  activatedDoctors = signal<DoctorPendingResponse[]>([]);
  
  // Statistics
  pendingCount = signal(0);
  activatedCount = signal(0);
  totalCount = computed(() => this.pendingCount() + this.activatedCount());

  // Modal
  showDetailsModal = signal(false);
  selectedDoctor = signal<DoctorPendingResponse | null>(null);

  // Current user
  userName = signal('Admin');

  ngOnInit() {
    this.loadUserData();
    this.loadStatistics();
    this.loadPendingDoctors();
  }

  private loadUserData() {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.userName.set(userData.firstName || userData.name || 'Admin');
    }
  }

  private loadStatistics() {
    this.adminDoctorService.getPendingCount().subscribe({
      next: (response) => {
        this.pendingCount.set(response.count);
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
      }
    });
  }

  loadPendingDoctors() {
    this.loading.set(true);
    this.adminDoctorService.getPendingDoctors().subscribe({
      next: (doctors) => {
        this.pendingDoctors.set(doctors);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading pending doctors:', error);
        this.loading.set(false);
      }
    });
  }

  loadActivatedDoctors() {
    this.loading.set(true);
    this.adminDoctorService.getActivatedDoctors().subscribe({
      next: (doctors) => {
        this.activatedDoctors.set(doctors);
        this.activatedCount.set(doctors.length);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading activated doctors:', error);
        this.loading.set(false);
      }
    });
  }

  selectTab(tab: 'pending' | 'activated') {
    this.selectedTab.set(tab);
    if (tab === 'pending') {
      this.loadPendingDoctors();
    } else {
      this.loadActivatedDoctors();
    }
  }

  onApprove(doctor: DoctorPendingResponse) {
    if (confirm(`Voulez-vous approuver le Dr. ${doctor.fullName} ?`)) {
      const request: DoctorActivationRequest = {
        doctorId: doctor.doctorId,
        action: 'APPROVE',
        notes: ''
      };

      this.adminDoctorService.activateDoctor(request).subscribe({
        next: (response) => {
          alert('✅ Médecin approuvé avec succès');
          this.refreshData();
        },
        error: (error) => {
          console.error('Error approving doctor:', error);
          alert('❌ Erreur lors de l\'approbation');
        }
      });
    }
  }

  onReject(doctor: DoctorPendingResponse) {
    const reason = prompt('Raison du rejet (optionnel):');
    if (reason !== null) {
      const request: DoctorActivationRequest = {
        doctorId: doctor.doctorId,
        action: 'REJECT',
        notes: reason || 'Les informations n\'ont pas pu être vérifiées'
      };

      this.adminDoctorService.activateDoctor(request).subscribe({
        next: (response) => {
          alert('✅ Médecin rejeté');
          this.refreshData();
        },
        error: (error) => {
          console.error('Error rejecting doctor:', error);
          alert('❌ Erreur lors du rejet');
        }
      });
    }
  }

  onViewDetails(doctor: DoctorPendingResponse) {
    this.selectedDoctor.set(doctor);
    this.showDetailsModal.set(true);
  }

  closeDetailsModal() {
    this.showDetailsModal.set(false);
    this.selectedDoctor.set(null);
  }

  refreshData() {
    this.loadStatistics();
    if (this.selectedTab() === 'pending') {
      this.loadPendingDoctors();
    } else {
      this.loadActivatedDoctors();
    }
  }

  navigateToUserManagement() {
    this.router.navigate(['/admin/users']);
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