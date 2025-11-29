// src/app/healthPatient/components/recommendations-list/recommendations-list.component.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recommendations-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="recommendations-section">
      <h2 class="section-title">
        <span class="section-icon">💡</span>
        Recommandations Personnalisées
      </h2>

      <div class="recommendations-grid">
        @for (recommendation of recommendations(); track $index) {
          <div class="recommendation-card">
            <div class="card-number">{{ $index + 1 }}</div>
            <div class="card-content">
              <span class="card-icon">{{ getRecommendationIcon(recommendation) }}</span>
              <p class="card-text">{{ recommendation }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .recommendations-section {
      background: white;
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 20px 0;
    }

    .section-icon {
      font-size: 24px;
    }

    .recommendations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .recommendation-card {
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
      border-radius: 16px;
      padding: 20px;
      border: 2px solid #e2e8f0;
      transition: all 0.3s ease;
      position: relative;
      display: flex;
      gap: 16px;
    }

    .recommendation-card:hover {
      transform: translateY(-4px);
      border-color: #8b5cf6;
      box-shadow: 0 8px 16px rgba(139, 92, 246, 0.15);
    }

    .card-number {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      flex-shrink: 0;
    }

    .card-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .card-icon {
      font-size: 24px;
    }

    .card-text {
      margin: 0;
      color: #334155;
      font-size: 14px;
      line-height: 1.6;
      font-weight: 500;
    }

    @media (max-width: 640px) {
      .recommendations-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RecommendationsListComponent {
  recommendations = input.required<string[]>();

  getRecommendationIcon(recommendation: string): string {
    const text = recommendation.toLowerCase();
    
    if (text.includes('pas') || text.includes('marche') || text.includes('activité')) return '🚶';
    if (text.includes('exercice') || text.includes('sport')) return '🏃';
    if (text.includes('sommeil') || text.includes('dormir') || text.includes('coucher')) return '😴';
    if (text.includes('hydrat') || text.includes('eau') || text.includes('boire')) return '💧';
    if (text.includes('stress') || text.includes('méditation') || text.includes('relaxation')) return '🧘';
    if (text.includes('cardio') || text.includes('cœur') || text.includes('coeur')) return '❤️';
    if (text.includes('tension') || text.includes('pression')) return '🩺';
    if (text.includes('médecin') || text.includes('docteur') || text.includes('consulter')) return '👨‍⚕️';
    if (text.includes('alimentation') || text.includes('nutrition') || text.includes('sel')) return '🥗';
    if (text.includes('température') || text.includes('fièvre')) return '🌡️';
    
    return '📌';
  }
}