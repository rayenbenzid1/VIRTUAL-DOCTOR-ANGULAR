// src/app/shared/components/navbar/navbar.component.ts
import { Component, signal, inject, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { UserResponse } from '../../models/profile.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ProfileModalComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private router = inject(Router);

  @ViewChild('profileModal') profileModal!: ProfileModalComponent;

  showDropdown = signal(false);
  userName = signal('');
  userRole = signal('');

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData() {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.userName.set(userData.firstName || userData.name || 'Utilisateur');
      this.userRole.set(userData.role || 'USER');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-dropdown')) {
      this.showDropdown.set(false);
    }
  }

  toggleDropdown() {
    this.showDropdown.set(!this.showDropdown());
  }

  isActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  editProfile() {
    this.showDropdown.set(false);
    if (this.profileModal) {
      this.profileModal.open();
    }
  }

  onProfileUpdated(user: UserResponse) {
    this.userName.set(user.firstName || user.fullName || 'Utilisateur');
  }

  onModalClosed() {
    console.log('Modal fermé');
  }

  logout() {
    this.showDropdown.set(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}