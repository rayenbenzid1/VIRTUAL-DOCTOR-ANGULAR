// src/app/nutrition/components/meal-details/meal-details.component.ts
import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NutritionService, HistoryItem } from '../../services/nutrition.service';

@Component({
  selector: 'app-meal-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meal-details.component.html',
  styleUrls: ['./meal-details.component.css']
})
export class MealDetailsComponent implements OnInit {
  private nutritionService = inject(NutritionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals
  mealData = signal<HistoryItem | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Computed
  hasData = computed(() => this.mealData() !== null);
  
  mainFood = computed(() => {
    const foods = this.mealData()?.detected_foods;
    return foods && foods.length > 0 ? foods[0] : null;
  });

  totalNutrition = computed(() => this.mealData()?.total_nutrition);

  ngOnInit() {
    const analysisId = this.route.snapshot.paramMap.get('id');
    if (analysisId) {
      this.loadDetails(analysisId);
    } else {
      this.error.set('ID d\'analyse manquant');
      this.isLoading.set(false);
    }
  }

  /**
   * Charger les détails
   */
  loadDetails(analysisId: string) {
    this.isLoading.set(true);
    this.error.set(null);

    this.nutritionService.getAnalysisById(analysisId).subscribe({
      next: (response) => {
        console.log('✅ Détails chargés:', response);
        if (response.success) {
          this.mealData.set(response.data);
        } else {
          this.error.set(response.message || 'Erreur lors du chargement');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Erreur chargement détails:', err);
        this.error.set(err.error?.message || 'Erreur lors du chargement');
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Formater la date
   */
  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Corriger l'URL de l'image
   */
  fixImageUrl(url: string): string {
    return url.replace('http://localhost:9000', 'http://192.168.0.132:9000');
  }

  /**
   * Retour
   */
  goBack() {
    this.router.navigate(['/nutrition/history']);
  }
}