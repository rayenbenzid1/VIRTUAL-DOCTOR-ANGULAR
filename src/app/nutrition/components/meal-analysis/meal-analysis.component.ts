// src/app/nutrition/components/meal-analysis/meal-analysis.component.ts
import { Component, signal, computed, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NutritionService, AnalysisResponse } from '../../services/nutrition.service';

@Component({
  selector: 'app-meal-analysis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meal-analysis.component.html',
  styleUrls: ['./meal-analysis.component.css']
})
export class MealAnalysisComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('cameraInput') cameraInput!: ElementRef<HTMLInputElement>;

  private nutritionService = inject(NutritionService);
  private router = inject(Router);

  // Signals pour la gestion d'état
  selectedImage = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  isLoading = signal(false);
  analysisResult = signal<AnalysisResponse | null>(null);
  error = signal<string | null>(null);

  // Computed properties
  hasImage = computed(() => this.selectedImage() !== null);
  hasResult = computed(() => this.analysisResult() !== null);
  detectedFoods = computed(() => this.analysisResult()?.data?.detected_foods || []);
  totalNutrition = computed(() => this.analysisResult()?.data?.total_nutrition);
  alternatives = computed(() => this.analysisResult()?.data?.alternatives || []);
  recommendations = computed(() => this.analysisResult()?.data?.recommendations);

  /**
   * Ouvrir la galerie pour sélectionner une image
   */
  openGallery() {
    this.fileInput.nativeElement.click();
  }

  /**
   * Ouvrir la caméra pour prendre une photo
   */
  openCamera() {
    this.cameraInput.nativeElement.click();
  }

  /**
   * Gérer la sélection d'une image (galerie ou caméra)
   */
  onFileSelected(event: Event, fromCamera: boolean = false) {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validation du type de fichier
      if (!file.type.startsWith('image/')) {
        this.error.set('⚠️ Veuillez sélectionner une image valide (JPG, PNG)');
        return;
      }

      // Validation de la taille (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        this.error.set('⚠️ L\'image ne doit pas dépasser 10MB');
        return;
      }

      this.selectedFile.set(file);
      this.error.set(null);

      // Créer l'aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage.set(e.target?.result as string);
        // Analyser automatiquement dès que l'image est chargée
        this.analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Analyser l'image sélectionnée
   */
  async analyzeImage() {
    const file = this.selectedFile();
    if (!file) {
      this.error.set('Aucune image sélectionnée');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.analysisResult.set(null);

    console.log('🔄 Début de l\'analyse de l\'image...');

    this.nutritionService.analyzeFood(file, true).subscribe({
      next: (response) => {
        console.log('✅ Analyse réussie:', response);
        
        if (response.success) {
          this.analysisResult.set(response);
        } else {
          this.error.set(response.message || 'Erreur lors de l\'analyse');
        }
        
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Erreur lors de l\'analyse:', err);
        
        let errorMessage = 'Une erreur est survenue lors de l\'analyse';
        
        if (err.status === 401) {
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        } else if (err.status === 0) {
          errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }
        
        this.error.set(errorMessage);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Réinitialiser pour analyser un nouveau repas
   */
  scanNewMeal() {
    this.selectedImage.set(null);
    this.selectedFile.set(null);
    this.analysisResult.set(null);
    this.error.set(null);
    
    // Réinitialiser les inputs
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    if (this.cameraInput) {
      this.cameraInput.nativeElement.value = '';
    }
  }

  /**
   * Naviguer vers l'historique
   */
  goToHistory() {
    this.router.navigate(['/nutrition/history']);
  }

  /**
   * Retourner au dashboard
   */
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Obtenir la couleur de la barre de progression selon le pourcentage
   */
  getProgressColor(value: number, max: number): string {
    const percentage = (value / max) * 100;
    
    if (percentage < 50) return '#10b981'; // Vert
    if (percentage < 80) return '#f59e0b'; // Orange
    return '#ef4444'; // Rouge
  }

  /**
   * Calculer le pourcentage de progression (max 100%)
   */
  getProgressPercentage(value: number, max: number): number {
    return Math.min(100, Math.round((value / max) * 100));
  }

  /**
   * Formater un nombre avec décimales
   */
  formatNumber(value: number, decimals: number = 1): string {
    return value.toFixed(decimals);
  }
}