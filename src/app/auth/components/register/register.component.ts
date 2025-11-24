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
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  form!: FormGroup;

  loading = signal(false);
  role = signal<'PATIENT' | 'MEDECIN'>('PATIENT');

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  // Mode démo pour tester sans backend
  demoMode = true;

  constructor(
    private fb: FormBuilder,
    private authApi: AuthApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  togglePassword() {
    this.hidePassword.set(!this.hidePassword());
  }

  toggleConfirmPassword() {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
  }

  submit() {
    console.log('Submit clicked');
    console.log('Form valid:', this.form.valid);
    console.log('Form value:', this.form.value);

    // Vérifier si le formulaire est valide
    if (this.form.invalid) {
      console.log('Form errors:', this.form.errors);

      // Afficher les erreurs spécifiques
      if (this.form.get('firstName')?.invalid) {
        alert('Veuillez entrer votre prénom.');
        return;
      }
      if (this.form.get('lastName')?.invalid) {
        alert('Veuillez entrer votre nom.');
        return;
      }
      if (this.form.get('email')?.invalid) {
        alert('Veuillez entrer un email valide.');
        return;
      }
      if (this.form.get('phone')?.invalid) {
        alert('Veuillez entrer votre numéro de téléphone.');
        return;
      }
      if (this.form.get('password')?.invalid) {
        alert('Le mot de passe doit contenir au moins 6 caractères.');
        return;
      }
      if (this.form.get('acceptTerms')?.invalid) {
        alert('Veuillez accepter les conditions d\'utilisation.');
        return;
      }

      alert('Veuillez remplir tous les champs correctement.');
      return;
    }

    // Vérifier si les mots de passe correspondent
    if (this.form.value.password !== this.form.value.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    this.loading.set(true);

    // Mode démo - inscription simulée
    if (this.demoMode) {
      console.log('Demo mode - simulating registration');

      setTimeout(() => {
        this.loading.set(false);
        alert('✅ Inscription réussie ! Vous allez être redirigé vers la page de connexion.');

        setTimeout(() => {
          this.router.navigate(['/login']).then(success => {
            console.log('Navigation to login success:', success);
          });
        }, 500);
      }, 1000);

      return;
    }

    // Mode production avec API
    const payload = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      email: this.form.value.email,
      phoneNumber: this.form.value.phone,
      password: this.form.value.password,
      role: this.role(),
      gender: "MALE",
      birthDate: "2000-01-01",

      // Doctor fields
      medicalLicenseNumber: this.role() === 'MEDECIN' ? "ABC-123" : null,
      specialization: this.role() === 'MEDECIN' ? "Généraliste" : null,
      hospitalAffiliation: this.role() === 'MEDECIN' ? "Clinique Centrale" : null,
      yearsOfExperience: this.role() === 'MEDECIN' ? 5 : null
    };

    this.authApi.register(payload).subscribe({
      next: () => {
        this.loading.set(false);
        alert('✅ Inscription réussie ! Vous allez être redirigé vers la page de connexion.');

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 500);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.loading.set(false);
        alert('❌ Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    });
  }
}
