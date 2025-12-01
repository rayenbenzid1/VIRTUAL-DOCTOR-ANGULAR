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
import { AdminDashboardComponent } from './admin/components/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './admin/components/user-management/user-management.component';
import { ChatbotComponent } from './chatbot/chatbot.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'doctor/dashboard', component: DoctorDashboardComponent },
  { path: 'health/analysis', component: AnalysisComponent },
  { path: 'health/alerts', component: AlertsComponent },
  { path: 'health/trends', component: TrendsComponent },
  { path: 'health/goals', component: GoalsComponent },
  { path: 'chatbot', component: ChatbotComponent },
    // ✅ ROUTES ADMIN
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/users', component: UserManagementComponent },
  {
    path: 'nutrition',
    children: [
      {
        path: 'analysis',
        loadComponent: () => 
          import('./nutrition/components/meal-analysis/meal-analysis.component')
            .then(m => m.MealAnalysisComponent),
        title: 'Analyse Nutritionnelle'
      },
      {
        path: 'history',
        loadComponent: () => 
          import('./nutrition/components/meal-history/meal-history.component')
            .then(m => m.MealHistoryComponent),
        title: 'Historique des Repas'
      },
      {
        path: 'details/:id',
        loadComponent: () => 
          import('./nutrition/components/meal-details/meal-details.component')
            .then(m => m.MealDetailsComponent),
        title: 'Détails du Repas'
      },
      {
        path: 'statistics',
        loadComponent: () => 
          import('./nutrition/components/nutrition-statistics/nutrition-statistics.component')
            .then(m => m.NutritionStatisticsComponent),
        title: 'Statistiques Nutritionnelles'
      },
      {
        path: '',
        redirectTo: 'analysis',
        pathMatch: 'full'
      }
    ]
  },
  
  { path: '**', redirectTo: 'login' },


];