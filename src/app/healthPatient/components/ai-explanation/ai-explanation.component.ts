// src/app/healthPatient/components/ai-explanation/ai-explanation.component.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-explanation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="explanation-section">
      <div class="explanation-header">
        <div class="header-content">
          <span class="header-icon">🤖</span>
          <div class="header-text">
            <h2 class="header-title">Analyse Personnalisée</h2>
            <p class="header-subtitle">Interprétation détaillée de votre état de santé</p>
          </div>
        </div>
      </div>

      <div class="explanation-body">
        <div class="explanation-card">
          <p class="explanation-text">{{ explanation() }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .explanation-section {
        background: white;
        border-radius: 20px;
        padding: 32px;
        margin-bottom: 28px;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      }

      .explanation-header {
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 2px solid #e2e8f0;
      }

      .header-content {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .header-icon {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        flex-shrink: 0;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      }

      .header-text {
        flex: 1;
      }

      .header-title {
        margin: 0 0 6px 0;
        font-size: 22px;
        font-weight: 800;
        color: #1e293b;
        letter-spacing: -0.5px;
      }

      .header-subtitle {
        margin: 0;
        font-size: 14px;
        color: #64748b;
        font-weight: 600;
      }

      .explanation-card {
        background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        border-radius: 16px;
        padding: 28px;
        border: 2px solid #e2e8f0;
        position: relative;
        overflow: hidden;
      }

      .explanation-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%);
      }

      .explanation-text {
        margin: 0;
        color: #334155;
        font-size: 16px;
        line-height: 1.8;
        font-weight: 500;
        text-align: justify;
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
export class AiExplanationComponent {
  explanation = input.required<string>();
}
