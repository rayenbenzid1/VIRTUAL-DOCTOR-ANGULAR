import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthApiService } from '../../services/auth.api';
import { DoctorAuthApiService } from '../../services/doctor-auth.api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Réinitialiser l'erreur quand l'utilisateur modifie les champs
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
    // Marquer tous les champs comme touchés
    Object.keys(this.form.controls).forEach(key => {
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
    // Réinitialiser les erreurs
    this.loginError.set('');

    if (!this.validateForm()) {
      return;
    }

    this.loading.set(true);

    const email = this.form.value.email;
    const isDoctor = email.endsWith('@doctor.com');
    const isAdmin = email.endsWith('@admin.com');

    // Choisir la méthode d'authentification appropriée
    const authMethod = isDoctor
      ? this.doctorAuthApi.login(this.form.value)
      : this.authApi.login(this.form.value);

  authMethod.subscribe({
    next: (res) => {
      console.log('🔍 Login response complète:', res);
      console.log('🔍 res.user:', res.user);
      console.log('🔍 res.user.roles:', res.user?.roles);

        try {
          // Stocker les tokens
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);

<<<<<<< HEAD
        // Handle different response structures for doctor vs patient login
        // Doctor login may have user data directly on response, patient login has it nested under 'user'
        const userData = res.user || res;
        
        // Construct user object from response properties
        const user = {
          id: res.doctorId || res.userId || res.id || userData.id,
          name: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: res.role || userData.role
        };
=======
          // Construire l'objet utilisateur
          const user = {
            id: res.doctorId || res.userId || res.id,
            name: res.user?.fullName || `${res.user?.firstName} ${res.user?.lastName}`,
            firstName: res.user?.firstName,
            lastName: res.user?.lastName,
            email: res.user?.email,
            phoneNumber: res.user?.phoneNumber,
            role: res.role
          };
>>>>>>> 71ad615f8eeb29e447bf8976ba9027a39e9c4b7d

          console.log('Constructed user object:', user);
          localStorage.setItem('user', JSON.stringify(user));

          this.loading.set(false);
          this.showToast('Connexion réussie ! Redirection...', 'success');

          // Rediriger selon le rôle
          setTimeout(() => {
            if (isDoctor) {
              this.router.navigate(['/doctor/dashboard']);
            } else if (isAdmin) {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/dashboard']);
            }
          }, 1000);
          
        } catch (error) {
          console.error('Error processing login response:', error);
          this.loading.set(false);
          this.loginError.set('Erreur lors du traitement de la réponse');
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.loading.set(false);
        
        const errorMessage = this.getErrorMessage(error);
        this.loginError.set(errorMessage);
        this.showToast(errorMessage, 'error');
      }
    });
  }
}