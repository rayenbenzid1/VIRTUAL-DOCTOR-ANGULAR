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
  styles: [
    `
      .recommendations-section {
        background: white;
        border-radius: 20px;
        padding: 32px;
        margin-bottom: 28px;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      }

      .recommendations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 20px;
      }

      .recommendation-card {
        background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        border-radius: 16px;
        padding: 24px;
        border: 2px solid #e2e8f0;
        transition: all 0.3s ease;
        position: relative;
        display: flex;
        gap: 20px;
      }

      .recommendation-card:hover {
        transform: translateY(-6px);
        border-color: #6366f1;
        box-shadow: 0 12px 24px rgba(99, 102, 241, 0.15);
      }

      .card-number {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 16px;
        flex-shrink: 0;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      }

      .card-text {
        margin: 0;
        color: #334155;
        font-size: 15px;
        line-height: 1.7;
        font-weight: 600;
      }
      @media (max-width: 768px) {
        .breakdown-grid,
        .recommendations-grid {
          grid-template-columns: 1fr;
        }

        .score-section {
          flex-direction: column;
          align-items: stretch;
        }

        .header-content {
          flex-direction: column;
          text-align: center;
        }
      }
    `,
  ],
})
export class RecommendationsListComponent {
  recommendations = input.required<string[]>();

  getRecommendationIcon(recommendation: string): string {
    const text = recommendation.toLowerCase();

    if (text.includes('pas') || text.includes('marche') || text.includes('activité')) return '🚶';
    if (text.includes('exercice') || text.includes('sport')) return '🏃';
    if (text.includes('sommeil') || text.includes('dormir') || text.includes('coucher'))
      return '😴';
    if (text.includes('hydrat') || text.includes('eau') || text.includes('boire')) return '💧';
    if (text.includes('stress') || text.includes('méditation') || text.includes('relaxation'))
      return '🧘';
    if (text.includes('cardio') || text.includes('cœur') || text.includes('coeur')) return '❤️';
    if (text.includes('tension') || text.includes('pression')) return '🩺';
    if (text.includes('médecin') || text.includes('docteur') || text.includes('consulter'))
      return '👨‍⚕️';
    if (text.includes('alimentation') || text.includes('nutrition') || text.includes('sel'))
      return '🥗';
    if (text.includes('température') || text.includes('fièvre')) return '🌡️';

    return '📌';
  }
}
