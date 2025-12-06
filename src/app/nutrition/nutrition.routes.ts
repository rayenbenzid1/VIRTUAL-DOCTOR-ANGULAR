// src/app/nutrition/nutrition.routes.ts
import { Routes } from '@angular/router';

export const NUTRITION_ROUTES: Routes = [
  {
    path: 'analysis',
    loadComponent: () => 
      import('./components/meal-analysis/meal-analysis.component').then(m => m.MealAnalysisComponent),
    title: 'Analyse Nutritionnelle'
  },
  {
    path: 'history',
    loadComponent: () => 
      import('./components/meal-history/meal-history.component').then(m => m.MealHistoryComponent),
    title: 'Historique des Repas'
  },
  {
    path: 'details/:id',
    loadComponent: () => 
      import('./components/meal-details/meal-details.component').then(m => m.MealDetailsComponent),
    title: 'Détails du Repas'
  },
  {
    path: '',
    redirectTo: 'analysis',
    pathMatch: 'full'
  }
];
