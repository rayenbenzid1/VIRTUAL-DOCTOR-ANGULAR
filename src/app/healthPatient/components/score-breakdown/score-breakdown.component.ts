// src/app/healthPatient/components/score-breakdown/score-breakdown.component.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreBreakdown } from '../../models/analysis.models';

@Component({
  selector: 'app-score-breakdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="breakdown-section">
      <h2 class="section-title">
        <span class="section-icon">📊</span>
        Répartition du Score
      </h2>

      <div class="breakdown-grid">
        <div class="breakdown-card">
          <div class="card-header">
            <span class="card-icon" style="background: #10b98120; color: #10b981">🚶</span>
            <span class="card-label">Activité</span>
          </div>
          <div class="card-score">
            <span class="score-value" style="color: #10b981">{{ breakdown().activity }}</span>
            <span class="score-max">/25</span>
          </div>
          <div class="card-bar">
            <div
              class="bar-fill"
              [style.width.%]="getPercentage(breakdown().activity, 25)"
              style="background: linear-gradient(90deg, #10b981, #34d399)"
            ></div>
          </div>
        </div>

        <div class="breakdown-card">
          <div class="card-header">
            <span class="card-icon" style="background: #ef444420; color: #ef4444">❤️</span>
            <span class="card-label">Cardiovasculaire</span>
          </div>
          <div class="card-score">
            <span class="score-value" style="color: #ef4444">{{ breakdown().cardiovascular }}</span>
            <span class="score-max">/25</span>
          </div>
          <div class="card-bar">
            <div
              class="bar-fill"
              [style.width.%]="getPercentage(breakdown().cardiovascular, 25)"
              style="background: linear-gradient(90deg, #ef4444, #f87171)"
            ></div>
          </div>
        </div>

        <div class="breakdown-card">
          <div class="card-header">
            <span class="card-icon" style="background: #3b82f620; color: #3b82f6">💤</span>
            <span class="card-label">Sommeil</span>
          </div>
          <div class="card-score">
            <span class="score-value" style="color: #3b82f6">{{ breakdown().sleep }}</span>
            <span class="score-max">/20</span>
          </div>
          <div class="card-bar">
            <div
              class="bar-fill"
              [style.width.%]="getPercentage(breakdown().sleep, 20)"
              style="background: linear-gradient(90deg, #3b82f6, #60a5fa)"
            ></div>
          </div>
        </div>

        <div class="breakdown-card">
          <div class="card-header">
            <span class="card-icon" style="background: #06b6d420; color: #06b6d4">💧</span>
            <span class="card-label">Hydratation</span>
          </div>
          <div class="card-score">
            <span class="score-value" style="color: #06b6d4">{{ breakdown().hydration }}</span>
            <span class="score-max">/10</span>
          </div>
          <div class="card-bar">
            <div
              class="bar-fill"
              [style.width.%]="getPercentage(breakdown().hydration, 10)"
              style="background: linear-gradient(90deg, #06b6d4, #22d3ee)"
            ></div>
          </div>
        </div>

        <div class="breakdown-card">
          <div class="card-header">
            <span class="card-icon" style="background: #f59e0b20; color: #f59e0b">🧠</span>
            <span class="card-label">Stress</span>
          </div>
          <div class="card-score">
            <span class="score-value" style="color: #f59e0b">{{ breakdown().stress }}</span>
            <span class="score-max">/10</span>
          </div>
          <div class="card-bar">
            <div
              class="bar-fill"
              [style.width.%]="getPercentage(breakdown().stress, 10)"
              style="background: linear-gradient(90deg, #f59e0b, #fbbf24)"
            ></div>
          </div>
        </div>

        <div class="breakdown-card">
          <div class="card-header">
            <span class="card-icon" style="background: #8b5cf620; color: #8b5cf6">🩺</span>
            <span class="card-label">Signes vitaux</span>
          </div>
          <div class="card-score">
            <span class="score-value" style="color: #8b5cf6">{{ breakdown().vitals }}</span>
            <span class="score-max">/10</span>
          </div>
          <div class="card-bar">
            <div
              class="bar-fill"
              [style.width.%]="getPercentage(breakdown().vitals, 10)"
              style="background: linear-gradient(90deg, #8b5cf6, #a78bfa)"
            ></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .breakdown-section {
        background: white;
        border-radius: 20px;
        padding: 32px;
        margin-bottom: 28px;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 22px;
        font-weight: 800;
        color: #1e293b;
        margin: 0 0 24px 0;
        letter-spacing: -0.5px;
      }

      .section-title::before {
        content: '';
        width: 4px;
        height: 28px;
        background: linear-gradient(180deg, #6366f1, #8b5cf6);
        border-radius: 4px;
      }

      .breakdown-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
      }

      .breakdown-card {
        background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        border-radius: 16px;
        padding: 24px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid #e2e8f0;
        position: relative;
        overflow: hidden;
      }

      .breakdown-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, #6366f1, #8b5cf6);
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }

      .breakdown-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
        border-color: #6366f1;
      }

      .breakdown-card:hover::before {
        transform: scaleX(1);
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 20px;
      }

      .card-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .card-label {
        font-size: 13px;
        font-weight: 700;
        color: #475569;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .card-score {
        display: flex;
        align-items: baseline;
        gap: 6px;
        margin-bottom: 16px;
      }

      .score-value {
        font-size: 42px;
        font-weight: 900;
        line-height: 1;
        letter-spacing: -1px;
      }

      .score-max {
        font-size: 20px;
        font-weight: 700;
        color: #94a3b8;
      }

      .card-bar {
        height: 10px;
        background: #e2e8f0;
        border-radius: 6px;
        overflow: hidden;
      }

      .bar-fill {
        height: 100%;
        border-radius: 6px;
        transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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
export class ScoreBreakdownComponent {
  breakdown = input.required<ScoreBreakdown>();

  getPercentage(value: number, max: number): number {
    return (value / max) * 100;
  }
}
