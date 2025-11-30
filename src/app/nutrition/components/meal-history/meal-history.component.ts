// src/app/nutrition/components/meal-history/meal-history.component.ts
import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NutritionService, HistoryItem } from '../../services/nutrition.service';

@Component({
  selector: 'app-meal-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meal-history.component.html',
  styleUrls: ['./meal-history.component.css']
})
export class MealHistoryComponent implements OnInit {
  private nutritionService = inject(NutritionService);
  private router = inject(Router);

  // Signals
  historyItems = signal<HistoryItem[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Computed
  hasItems = computed(() => this.historyItems().length > 0);
  
  totalMeals = computed(() => this.historyItems().length);
  
  avgCalories = computed(() => {
    const items = this.historyItems();
    if (items.length === 0) return 0;
    const total = items.reduce((sum, item) => sum + item.total_nutrition.calories, 0);
    return Math.round(total / items.length);
  });

  ngOnInit() {
    this.loadHistory();
  }

  /**
   * Charger l'historique
   */
  loadHistory() {
    this.isLoading.set(true);
    this.error.set(null);

    this.nutritionService.getHistory(50, 0).subscribe({
      next: (response) => {
        console.log('✅ Historique chargé:', response);
        this.historyItems.set(response.data.analyses);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Erreur chargement historique:', err);
        this.error.set(err.error?.message || 'Erreur lors du chargement');
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Voir les détails d'un repas
   */
  viewDetails(item: HistoryItem) {
    this.router.navigate(['/nutrition/details', item.analysis_id]);
  }

  /**
   * Formater la date
   */
  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Corriger l'URL de l'image MinIO
   */
  fixImageUrl(url: string): string {
    // Remplacer localhost par l'IP réelle
    return url.replace('http://localhost:9000', 'http://192.168.0.132:9000');
  }

  /**
   * Retour
   */
  goBack() {
    this.router.navigate(['/nutrition/analysis']);
  }
}