import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DoctorDashboardComponent } from './doctor/components/doctor-dashboard/doctor-dashboard.component';
import { AlertsComponent } from './healthPatient/components/alerts/alerts.component';
import { TrendsComponent } from './healthPatient/components/trends/trends.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'doctor/dashboard', component: DoctorDashboardComponent },
  { path: 'health/alerts', component: AlertsComponent },
  { path: 'health/trends', component: TrendsComponent },
  { path: '**', redirectTo: 'login' }
];