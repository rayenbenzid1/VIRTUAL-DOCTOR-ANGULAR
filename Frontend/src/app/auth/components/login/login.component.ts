import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthApiService } from '../../services/auth.api';
import { DoctorAuthApiService } from '../../services/doctor-auth.api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form!: FormGroup;

  loading = signal(false);
  hidePassword = signal(true);
  loginError = signal('');

  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');

  constructor(
    private fb: FormBuilder,
    private authApi: AuthApiService,
    private doctorAuthApi: DoctorAuthApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.form.valueChanges.subscribe(() => {
      if (this.loginError()) {
        this.loginError.set('');
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toastMessage.set(message);
    this.toastType.set(type);

    setTimeout(() => {
      this.toastMessage.set('');
    }, 4000);
  }

  getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Email ou mot de passe incorrect';
    } else if (error.status === 403) {
      return 'Accès refusé. Vérifiez vos identifiants';
    } else if (error.status === 404) {
      return 'Utilisateur non trouvé';
    } else if (error.status === 0) {
      return 'Impossible de se connecter au serveur. Vérifiez votre connexion';
    } else if (error.error?.message) {
      return error.error.message;
    } else {
      return 'Une erreur est survenue lors de la connexion';
    }
  }

  validateForm(): boolean {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.get(key)?.markAsTouched();
    });

    if (this.form.invalid) {
      if (this.form.get('email')?.invalid) {
        this.loginError.set('Veuillez entrer un email valide');
      } else if (this.form.get('password')?.invalid) {
        this.loginError.set('Le mot de passe doit contenir au moins 6 caractères');
      }
      return false;
    }

    return true;
  }

  submit() {
    this.loginError.set('');

    if (!this.validateForm()) return;

    this.loading.set(true);

    // ✅ Détecter si c'est un email de médecin
    const email = this.form.value.email.toLowerCase();
    const isDoctor = email.includes('@doctor.') || email.endsWith('@doctor.com');

    console.log('🔍 Login attempt:', { email, isDoctor });

    // ✅ Utiliser le bon service selon le type d'utilisateur
    const loginService = isDoctor ? this.doctorAuthApi : this.authApi;

    loginService.login(this.form.value).subscribe({
      next: (res) => {
        try {
          // Stocker les tokens
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);

          // ---- 🔥 EXTRAIRE ROLE DEPUIS LE TOKEN ----
          const decoded: any = jwtDecode(res.accessToken);

          // Keycloak met les rôles ici :
          const roles = decoded.realm_access?.roles || [];
          console.log('Roles Keycloak :', roles);
          console.log('User data from backend:', res.user);

          // Choisir un rôle principal (ADMIN, DOCTOR, USER…)
          let userRole = 'USER';

          if (roles.includes('ADMIN')) userRole = 'ADMIN';
          else if (roles.includes('DOCTOR')) userRole = 'DOCTOR';
          else if (roles.includes('USER')) userRole = 'USER';

          // ✅ Utiliser les données COMPLÈTES du backend (res.user)
          const user = {
            id: res.user?.id || decoded.sub,
            email: res.user?.email || decoded.email,
            role: userRole,
            firstName: res.user?.firstName || decoded.given_name || '',
            lastName: res.user?.lastName || decoded.family_name || '',
            fullName: res.user?.fullName || decoded.name || '',
            phoneNumber: res.user?.phoneNumber || '',
            profilePictureUrl: res.user?.profilePictureUrl || '',
            birthDate: res.user?.birthDate || null,
            gender: res.user?.gender || null,
            isActivated: res.user?.isActivated ?? true,
            isEmailVerified: res.user?.isEmailVerified ?? true,
            roles: res.user?.roles || [userRole],
            accountStatus: res.user?.accountStatus || 'ACTIVE',
            // Données spécifiques médecin
            medicalLicenseNumber: res.user?.medicalLicenseNumber,
            specialization: res.user?.specialization,
            hospitalAffiliation: res.user?.hospitalAffiliation,
            yearsOfExperience: res.user?.yearsOfExperience,
          };

          console.log('✅ User data stored in localStorage:', user);
          localStorage.setItem('user', JSON.stringify(user));

          this.loading.set(false);
          this.showToast('Connexion réussie !', 'success');

          // ✅ REDIRECTION SELON LE RÔLE
          setTimeout(() => {
            if (userRole === 'ADMIN') {
              this.router.navigate(['/admin/dashboard']);
            } else if (userRole === 'DOCTOR') {
              this.router.navigate(['/doctor/dashboard']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          }, 800);
        } catch (e) {
          console.error('❌ Error processing token:', e);
          this.loading.set(false);
          this.loginError.set('Erreur lors du traitement du token');
        }
      },

      error: (err) => {
        console.error('❌ Login error:', err);
        this.loading.set(false);
        const msg = this.getErrorMessage(err);
        this.loginError.set(msg);
        this.showToast(msg, 'error');
      },
    });
  }
}