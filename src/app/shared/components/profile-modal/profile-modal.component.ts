// src/app/shared/components/profile-modal/profile-modal.component.ts
import { Component, signal, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { UpdateUserRequest, ChangePasswordRequest, UserResponse } from '../../models/profile.models';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.css']
})
export class ProfileModalComponent {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);

  modalClosed = output<void>();
  profileUpdated = output<UserResponse>();

  isVisible = signal(false);
  activeTab = signal<'profile' | 'password'>('profile');
  isLoading = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser = signal<UserResponse | null>(null);

  constructor() {
    // Initialiser le formulaire de profil
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
    });

    // Initialiser le formulaire de mot de passe
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,128}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  open() {
    const user = this.profileService.getCurrentUser();
    if (user) {
      this.currentUser.set(user);
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        profilePictureUrl: user.profilePictureUrl || ''
      });
    }
    this.isVisible.set(true);
    this.resetMessages();
  }

  close() {
    this.isVisible.set(false);
    this.activeTab.set('profile');
    this.profileForm.reset();
    this.passwordForm.reset();
    this.resetMessages();
    this.modalClosed.emit();
  }

  switchTab(tab: 'profile' | 'password') {
    this.activeTab.set(tab);
    this.resetMessages();
  }

  resetMessages() {
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  onSubmitProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.resetMessages();

    const request: UpdateUserRequest = {
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      email: this.profileForm.value.email,
      phoneNumber: this.profileForm.value.phoneNumber || undefined,
    };

    this.profileService.updateProfile(request).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.successMessage.set(response.message || 'Profil mis à jour avec succès');
        this.currentUser.set(response.data);
        this.profileUpdated.emit(response.data);
        
        setTimeout(() => {
          this.close();
        }, 2000);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.error?.message || 
          'Erreur lors de la mise à jour du profil'
        );
      }
    });
  }

  onSubmitPassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.resetMessages();

    const request: ChangePasswordRequest = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.profileService.changePassword(request).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.successMessage.set(response.message || 'Mot de passe modifié avec succès');
        this.passwordForm.reset();
        
        setTimeout(() => {
          this.switchTab('profile');
        }, 2000);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.error?.message || 
          'Erreur lors du changement de mot de passe'
        );
      }
    });
  }

  getFieldError(formGroup: FormGroup, fieldName: string): string | null {
    const field = formGroup.get(fieldName);
    if (!field || !field.touched || !field.errors) return null;

    if (field.errors['required']) return 'Ce champ est requis';
    if (field.errors['email']) return 'Email invalide';
    if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    if (field.errors['maxlength']) return `Maximum ${field.errors['maxlength'].requiredLength} caractères`;
    if (field.errors['pattern']) {
      if (fieldName === 'phoneNumber') return 'Numéro de téléphone invalide';
      if (fieldName === 'newPassword') return 'Le mot de passe doit contenir: 1 minuscule, 1 majuscule, 1 chiffre, 1 caractère spécial (min. 8 caractères)';
    }
    if (field.errors['mismatch']) return 'Les mots de passe ne correspondent pas';

    return 'Champ invalide';
  }
}