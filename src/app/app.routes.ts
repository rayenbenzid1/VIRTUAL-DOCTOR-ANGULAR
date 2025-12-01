// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DoctorDashboardComponent } from './doctor/components/doctor-dashboard/doctor-dashboard.component';
import { AlertsComponent } from './healthPatient/components/alerts/alerts.component';
import { TrendsComponent } from './healthPatient/components/trends/trends.component';
import { GoalsComponent } from './healthPatient/components/goals/goals.component';
import { AnalysisComponent } from './healthPatient/components/analysis/analysis.component';
import { AppointmentsComponent } from './dashboard/components/appointments/appointments.component';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'doctor/dashboard', component: DoctorDashboardComponent, canActivate: [authGuard] },
  { path: 'health/analysis', component: AnalysisComponent, canActivate: [authGuard] },
  { path: 'health/alerts', component: AlertsComponent, canActivate: [authGuard] },
  { path: 'health/trends', component: TrendsComponent, canActivate: [authGuard] },
  { path: 'health/goals', component: GoalsComponent, canActivate: [authGuard] },
  { path: 'appointments', component: AppointmentsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];