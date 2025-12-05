import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthApiService } from '../../services/auth.api';
import { DoctorAuthApiService } from '../../services/doctor-auth.api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form!: FormGroup;

  loading = signal(false);
  role = signal<'USER' | 'DOCTOR'>('USER');

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  
  onlineConsultation = signal(false);
  inPersonConsultation = signal(false);

  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');
  globalError = signal('');

  constructor(
    private fb: FormBuilder, 
    private authApi: AuthApiService,
    private doctorAuthApi: DoctorAuthApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    
    // Réinitialiser l'erreur globale quand l'utilisateur modifie le formulaire
    this.form.valueChanges.subscribe(() => {
      if (this.globalError()) {
        this.globalError.set('');
      }
    });
  }

  initForm() {
    const baseFields = {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
    };

    if (this.role() === 'DOCTOR') {
      this.form = this.fb.group({
        ...baseFields,
        systemEmail: ['', [
          Validators.required, 
          Validators.email,
          Validators.pattern(/.*@doctor\.com$/)
        ]],
        specialization: ['', Validators.required],
        licenseNumber: ['', Validators.required],
        yearsOfExperience: ['', [Validators.required, Validators.min(0)]],
        education: ['', Validators.required],
        hospitalName: ['', Validators.required],
        hospitalAddress: ['', Validators.required],
        consultationFee: [''],
        languages: ['', Validators.required],
        bio: ['', Validators.required],
      });
    } else {
      this.form = this.fb.group(baseFields);
    }
  }

  changeRole(newRole: 'USER' | 'DOCTOR') {
    if (this.role() !== newRole) {
      this.role.set(newRole);
      this.initForm();
      this.globalError.set('');
    }
  }

  togglePassword() {
    this.hidePassword.set(!this.hidePassword());
  }

  toggleConfirmPassword() {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  passwordMismatch(): boolean {
    const password = this.form.get('password')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;
    return password !== confirmPassword && confirmPassword !== '';
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    
    setTimeout(() => {
      this.toastMessage.set('');
    }, 4000);
  }

  getErrorMessage(error: any): string {
    if (error.status === 400) {
      return error.error?.message || 'Données invalides. Vérifiez vos informations';
    } else if (error.status === 409) {
      return 'Cet email est déjà utilisé';
    } else if (error.status === 422) {
      return 'Format de données incorrect';
    } else if (error.status === 0) {
      return 'Impossible de se connecter au serveur';
    } else if (error.error?.message) {
      return error.error.message;
    } else {
      return 'Une erreur est survenue lors de l\'inscription';
    }
  }

  validateForm(): boolean {
    // Marquer tous les champs comme touchés
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });

    if (this.form.invalid) {
      // Trouver le premier champ invalide
      const invalidFields = Object.keys(this.form.controls)
        .filter(key => this.form.get(key)?.invalid);
      
      if (invalidFields.length > 0) {
        const firstInvalid = invalidFields[0];
        const fieldLabels: { [key: string]: string } = {
          'firstName': 'Prénom',
          'lastName': 'Nom',
          'systemEmail': 'Email système',
          'email': 'Email',
          'phone': 'Téléphone',
          'password': 'Mot de passe',
          'confirmPassword': 'Confirmation mot de passe',
          'acceptTerms': 'Conditions d\'utilisation',
          'specialization': 'Spécialisation',
          'licenseNumber': 'Numéro de licence',
          'yearsOfExperience': 'Années d\'expérience',
          'education': 'Formation',
          'hospitalName': 'Nom de la clinique',
          'hospitalAddress': 'Adresse de la clinique',
          'languages': 'Langues parlées',
          'bio': 'Biographie',
        };
        
        this.globalError.set(`Le champ "${fieldLabels[firstInvalid]}" est requis`);
      } else {
        this.globalError.set('Veuillez remplir tous les champs obligatoires');
      }
      
      this.showToast('Veuillez corriger les erreurs du formulaire', 'error');
      return false;
    }

    if (this.passwordMismatch()) {
      this.globalError.set('Les mots de passe ne correspondent pas');
      this.showToast('Les mots de passe ne correspondent pas', 'error');
      return false;
    }

    if (this.role() === 'DOCTOR') {
      if (!this.onlineConsultation() && !this.inPersonConsultation()) {
        this.globalError.set('Veuillez sélectionner au moins un type de consultation');
        this.showToast('Sélectionnez au moins un type de consultation', 'error');
        return false;
      }
    }

    return true;
  }

  submit() {
    // Réinitialiser les erreurs
    this.globalError.set('');

    if (!this.validateForm()) {
      return;
    }

    this.loading.set(true);

    const basePayload = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      email: this.form.value.email,
      phoneNumber: this.form.value.phone,
      password: this.form.value.password,
      role: this.role(),
      gender: 'MALE',
      birthDate: '2000-01-01',
    };

    if (this.role() === 'DOCTOR') {
      const doctorPayload = {
        ...basePayload,
        email: this.form.value.systemEmail, // Email système @doctor.com
        contactEmail: this.form.value.email, // Email de contact
        medicalLicenseNumber: this.form.value.licenseNumber,
        specialization: this.form.value.specialization,
        hospitalAffiliation: this.form.value.hospitalName,
        hospitalAddress: this.form.value.hospitalAddress,
        yearsOfExperience: parseInt(this.form.value.yearsOfExperience),
        education: this.form.value.education,
        consultationFee: this.form.value.consultationFee ? 
          parseFloat(this.form.value.consultationFee) : null,
        languages: this.form.value.languages,
        bio: this.form.value.bio,
        availableForOnlineConsultation: this.onlineConsultation(),
        availableForInPersonConsultation: this.inPersonConsultation(),
      };

      this.doctorAuthApi.register(doctorPayload).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.loading.set(false);
          this.showToast('Inscription réussie ! Redirection...', 'success');
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.loading.set(false);
          
          const errorMessage = this.getErrorMessage(error);
          this.globalError.set(errorMessage);
          this.showToast(errorMessage, 'error');
        },
      });
    } else {
      // Inscription patient
      this.authApi.register(basePayload).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.loading.set(false);
          this.showToast('Inscription réussie ! Redirection...', 'success');
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.loading.set(false);
          
          const errorMessage = this.getErrorMessage(error);
          this.globalError.set(errorMessage);
          this.showToast(errorMessage, 'error');
        },
      });
    }
  }
}