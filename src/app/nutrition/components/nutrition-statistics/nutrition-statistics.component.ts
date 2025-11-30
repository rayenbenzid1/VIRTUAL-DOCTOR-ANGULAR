// src/app/nutrition/components/nutrition-statistics/nutrition-statistics.component.ts
import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NutritionService } from '../../services/nutrition.service';

@Component({
  selector: 'app-nutrition-statistics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="statistics-container">
      
      <!-- Header -->
      <div class="header">
        <button class="btn-back" (click)="goBack()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div class="header-title">
          <h1>📊 Statistiques Nutritionnelles</h1>
          <p class="header-subtitle">Vue d'ensemble de votre alimentation</p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">

        <!-- Loading -->
        @if (isLoading()) {
        <div class="loading-section">
          <div class="loading-spinner"></div>
          <p>Calcul des statistiques...</p>
        </div>
        }

        <!-- Error -->
        @if (error()) {
        <div class="error-section">
          <div class="error-icon">⚠️</div>
          <h3>Erreur</h3>
          <p>{{ error() }}</p>
          <button class="btn-retry" (click)="loadStatistics()">Réessayer</button>
        </div>
        }

        <!-- Statistics -->
        @if (!isLoading() && !error() && stats()) {
        
        <!-- Total Analyses -->
        <div class="card summary-card">
          <div class="summary-icon">🎯</div>
          <div class="summary-content">
            <h2 class="summary-value">{{ stats()!.total_analyses }}</h2>
            <p class="summary-label">Repas analysés au total</p>
          </div>
        </div>

        <!-- Average Per Meal -->
        <div class="card averages-card">
          <h3 class="card-title">📊 Moyennes par repas</h3>
          
          <div class="metrics-grid">
            <div class="metric-item">
              <div class="metric-icon" style="background: #fef3c7;">🔥</div>
              <div class="metric-content">
                <span class="metric-value">{{ stats()!.average_per_meal.calories | number:'1.0-0' }}</span>
                <span class="metric-label">Calories</span>
              </div>
            </div>

            <div class="metric-item">
              <div class="metric-icon" style="background: #dbeafe;">💪</div>
              <div class="metric-content">
                <span class="metric-value">{{ stats()!.average_per_meal.proteins }}g</span>
                <span class="metric-label">Protéines</span>
              </div>
            </div>

            <div class="metric-item">
              <div class="metric-icon" style="background: #ffedd5;">🍞</div>
              <div class="metric-content">
                <span class="metric-value">{{ stats()!.average_per_meal.carbohydrates }}g</span>
                <span class="metric-label">Glucides</span>
              </div>
            </div>

            <div class="metric-item">
              <div class="metric-icon" style="background: #fee2e2;">🥑</div>
              <div class="metric-content">
                <span class="metric-value">{{ stats()!.average_per_meal.fats }}g</span>
                <span class="metric-label">Lipides</span>
              </div>
            </div>

            <div class="metric-item">
              <div class="metric-icon" style="background: #dcfce7;">🥦</div>
              <div class="metric-content">
                <span class="metric-value">{{ stats()!.average_per_meal.fiber }}g</span>
                <span class="metric-label">Fibres</span>
              </div>
            </div>

            <div class="metric-item">
              <div class="metric-icon" style="background: #f3e8ff;">🍬</div>
              <div class="metric-content">
                <span class="metric-value">{{ stats()!.average_per_meal.sugars }}g</span>
                <span class="metric-label">Sucres</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Tracked -->
        <div class="card total-card">
          <h3 class="card-title">🎯 Total suivi</h3>
          <div class="total-highlight">
            <div class="total-icon">🔥</div>
            <div class="total-content">
              <span class="total-value">{{ stats()!.total_calories_tracked | number:'1.0-0' }}</span>
              <span class="total-label">Calories totales suivies</span>
            </div>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="card recommendations-card">
          <h3 class="card-title">💡 Conseils nutritionnels</h3>
          <div class="recommendations-list">
            <div class="recommendation-item">
              <span class="recommendation-icon">✅</span>
              <p>Vous analysez régulièrement vos repas, continuez !</p>
            </div>
            <div class="recommendation-item">
              <span class="recommendation-icon">💧</span>
              <p>N'oubliez pas de vous hydrater entre les repas</p>
            </div>
            <div class="recommendation-item">
              <span class="recommendation-icon">🥗</span>
              <p>Variez vos sources de protéines et légumes</p>
            </div>
          </div>
        </div>

        }

      </div>

    </div>
  `,
  styles: [`
    .statistics-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
      padding-bottom: 80px;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      color: white;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-back {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: none;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-back:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .header-title h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }

    .header-subtitle {
      margin: 4px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }

    .main-content {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }

    .card {
      background: white;
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .card-title {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 20px 0;
    }

    .loading-section, .error-section {
      background: white;
      border-radius: 20px;
      padding: 60px 40px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f1f5f9;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .summary-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .summary-icon {
      font-size: 64px;
      flex-shrink: 0;
    }

    .summary-content {
      flex: 1;
    }

    .summary-value {
      font-size: 48px;
      font-weight: 800;
      margin: 0;
    }

    .summary-label {
      font-size: 16px;
      margin: 8px 0 0 0;
      opacity: 0.9;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 16px;
    }

    .metric-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 20px;
      background: #f8fafc;
      border-radius: 16px;
      transition: all 0.3s ease;
    }

    .metric-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .metric-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .metric-content {
      text-align: center;
    }

    .metric-value {
      display: block;
      font-size: 20px;
      font-weight: 800;
      color: #1e293b;
    }

    .metric-label {
      display: block;
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
    }

    .total-card {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    }

    .total-highlight {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px;
      background: white;
      border-radius: 16px;
    }

    .total-icon {
      font-size: 48px;
    }

    .total-value {
      display: block;
      font-size: 32px;
      font-weight: 800;
      color: #ea580c;
    }

    .total-label {
      display: block;
      font-size: 14px;
      color: #64748b;
      margin-top: 4px;
    }

    .recommendations-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .recommendation-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
    }

    .recommendation-icon {
      font-size: 24px;
      flex-shrink: 0;
    }

    .recommendation-item p {
      margin: 0;
      color: #334155;
      font-size: 14px;
      line-height: 1.5;
    }

    .btn-retry {
      padding: 12px 24px;
      border-radius: 12px;
      border: none;
      background: #667eea;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-retry:hover {
      background: #5568d3;
    }

    @media (max-width: 768px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .summary-card {
        flex-direction: column;
        text-align: center;
      }

      .total-highlight {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class NutritionStatisticsComponent implements OnInit {
  private nutritionService = inject(NutritionService);
  private router = inject(Router);

  stats = signal<any>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadStatistics();
  }

  loadStatistics() {
    this.isLoading.set(true);
    this.error.set(null);

    this.nutritionService.getStatistics().subscribe({
      next: (response) => {
        console.log('✅ Statistiques chargées:', response);
        this.stats.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Erreur statistiques:', err);
        this.error.set(err.error?.message || 'Erreur lors du chargement');
        this.isLoading.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/nutrition/history']);
  }
}