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

  constructor(
    private fb: FormBuilder,
    private authApi: AuthApiService,
    private doctorAuthApi: DoctorAuthApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // submit() {
  //   if (this.form.invalid) return;

  //   this.loading.set(true);

  //   const email = this.form.value.email;
  //   const isDoctor = email.endsWith('@doctor.com');

  //   // Choose the appropriate authentication method based on email domain
  //   const authMethod = isDoctor
  //     ? this.doctorAuthApi.login(this.form.value)
  //     : this.authApi.login(this.form.value);

  //   authMethod.subscribe({
  //     next: (res) => {
  //       console.log('Login response:', res);

  //       // Store tokens
  //       localStorage.setItem('accessToken', res.accessToken);
  //       localStorage.setItem('refreshToken', res.refreshToken);

  //       // Construct user object from response properties
  //       const user = {
  //         id: res.doctorId || res.userId || res.id,
  //         name: res.user.fullName,
  //         firstName: res.user.firstName,
  //         lastName: res.user.lastName,
  //         email: res.user.email,
  //         role: res.role
  //       };

  //       console.log('Constructed user object:', user);
  //       localStorage.setItem('user', JSON.stringify(user));

  //       this.loading.set(false);
  //      if (res.role === 'ADMIN') {
  //       this.router.navigate(['/admin/dashboard']);
  //     } else if (isDoctor) {
  //         this.router.navigate(['/doctor/dashboard']);
  //       } else {
  //         this.router.navigate(['/dashboard']);
  //       }
  //     },
  //     error: () => {
  //       this.loading.set(false);
  //     }
  //   });
  // }
  submit() {
  if (this.form.invalid) return;

  this.loading.set(true);

  const email = this.form.value.email;
  const isDoctor = email.endsWith('@doctor.com');

  // Choose the appropriate authentication method based on email domain
  const authMethod = isDoctor
    ? this.doctorAuthApi.login(this.form.value)
    : this.authApi.login(this.form.value);

  authMethod.subscribe({
    next: (res) => {
      console.log('🔍 Login response complète:', res);
      console.log('🔍 res.user:', res.user);
      console.log('🔍 res.user.roles:', res.user?.roles);

      // Store tokens
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);

      // Construct user object from response properties
      const user = {
        id: res.doctorId || res.userId || res.id,
        name: res.user.firstName,
        firstName: res.user.firstName,
        lastName: res.user.lastName,
        email: res.user.email,
        role: this.getPrimaryRole(res.user.roles) // ✅ CORRECTION ICI
      };

      console.log('🔍 Constructed user object:', user);
      console.log('🔍 User role:', user.role);
      localStorage.setItem('user', JSON.stringify(user));

      this.loading.set(false);
      
      // FIX: Vérifier le rôle EN PREMIER (priorité au rôle sur l'email)
      if (user.role === 'ADMIN') {
        console.log('✅ Redirecting to admin dashboard');
        this.router.navigate(['/admin/dashboard']);
      } else if (user.role === 'DOCTOR' || isDoctor) {
        console.log('✅ Redirecting to doctor dashboard');
        this.router.navigate(['/doctor/dashboard']);
      } else {
        console.log('✅ Redirecting to user dashboard');
        this.router.navigate(['/dashboard']);
      }
    },
    error: (error) => {
      console.error('❌ Login error:', error);
      this.loading.set(false);
    }
  });
}

/**
 * Extrait le rôle principal depuis le tableau de rôles
 * Priorité: ADMIN > DOCTOR > USER
 */
private getPrimaryRole(roles: string[] | Set<string> | undefined): string {
  console.log('🔍 getPrimaryRole input:', roles);
  
  if (!roles) {
    console.warn('⚠️ No roles found, defaulting to USER');
    return 'USER';
  }

  // Convertir Set en Array si nécessaire
  const rolesArray = Array.isArray(roles) ? roles : Array.from(roles);
  console.log('🔍 Roles array:', rolesArray);

  // Priorité des rôles
  if (rolesArray.includes('ADMIN')) {
    console.log('✅ Found ADMIN role');
    return 'ADMIN';
  }
  if (rolesArray.includes('DOCTOR')) {
    console.log('✅ Found DOCTOR role');
    return 'DOCTOR';
  }
  
  console.log('✅ Defaulting to USER role');
  return 'USER';
}
}
