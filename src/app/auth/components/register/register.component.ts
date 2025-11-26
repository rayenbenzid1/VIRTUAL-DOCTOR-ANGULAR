import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthApiService } from '../../services/auth.api';
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

  constructor(private fb: FormBuilder, private authApi: AuthApiService, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
    });
  }
  togglePassword() {
    this.hidePassword.set(!this.hidePassword());
  }

  toggleConfirmPassword() {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
  }

  submit() {
    if (this.form.invalid) return;

    if (this.form.value.password !== this.form.value.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    const payload = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      email: this.form.value.email,
      phoneNumber: this.form.value.phone,
      password: this.form.value.password,
      role: this.role(),
      gender: 'MALE',
      birthDate: '2000-01-01',

      // Doctor fields
      medicalLicenseNumber: this.role() === 'DOCTOR' ? 'ABC-123' : null,
      specialization: this.role() === 'DOCTOR' ? 'Généraliste' : null,
      hospitalAffiliation: this.role() === 'DOCTOR' ? 'Clinique Centrale' : null,
      yearsOfExperience: this.role() === 'DOCTOR' ? 5 : null,
    };

    this.loading.set(true);

    this.authApi.register(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
