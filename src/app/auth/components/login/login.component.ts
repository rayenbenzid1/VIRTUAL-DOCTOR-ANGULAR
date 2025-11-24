import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthApiService } from '../../services/auth.api';
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

  // Mode démo pour tester sans backend
  demoMode = true;

  constructor(
    private fb: FormBuilder,
    private authApi: AuthApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    console.log('Submit clicked');
    console.log('Form valid:', this.form.valid);
    console.log('Form value:', this.form.value);

    if (this.form.invalid) {
      console.log('Form errors:', this.form.errors);
      alert('Veuillez remplir tous les champs correctement.');
      return;
    }

    this.loading.set(true);

    // Mode démo - navigation directe vers le dashboard
    if (this.demoMode) {
      console.log('Demo mode - navigating to dashboard');

      // Simuler des données utilisateur
      const demoUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: this.form.value.email,
        role: 'PATIENT'
      };

      localStorage.setItem('accessToken', 'demo-token-123');
      localStorage.setItem('refreshToken', 'demo-refresh-456');
      localStorage.setItem('user', JSON.stringify(demoUser));

      setTimeout(() => {
        this.loading.set(false);
        console.log('Navigating to dashboard...');
        this.router.navigate(['/dashboard']).then(success => {
          console.log('Navigation success:', success);
        }).catch(err => {
          console.error('Navigation error:', err);
        });
      }, 500);

      return;
    }

    // Mode production avec API
    this.authApi.login(this.form.value).subscribe({
      next: (res) => {
        console.log('Login successful', res);
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.user));

        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login error', err);
        this.loading.set(false);
        alert('Erreur de connexion. Vérifiez vos identifiants ou votre connexion au serveur.');
      }
    });
  }
}
