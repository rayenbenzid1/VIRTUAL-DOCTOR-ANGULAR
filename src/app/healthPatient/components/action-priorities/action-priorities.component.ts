import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionPriority } from '../../services/risk-alerts.api';

@Component({
  selector: 'app-action-priorities',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="action-priorities-section">
      <h2 class="section-title">
        <span class="section-icon">🎯</span>
        Actions Prioritaires
      </h2>

      <div class="priorities-list">
        @for (action of actionPriorities(); track $index) {
        <div class="priority-card" [class]="'urgency-' + action.urgency">
          <div class="priority-header">
            <div class="priority-badge" [class]="'badge-' + action.urgency">
              {{ getUrgencyIcon(action.urgency) }} {{ getUrgencyLabel(action.urgency) }}
            </div>
            <div class="priority-number">#{{ $index + 1 }}</div>
          </div>

          <h3 class="priority-action">{{ action.action }}</h3>

          <div class="priority-details">
            <div class="detail-item">
              <span class="detail-label">Catégorie:</span>
              <span class="detail-value">{{ getCategoryLabel(action.category) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Impact:</span>
              <span class="detail-value impact-value">{{ action.impact }}</span>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .action-priorities-section {
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

    .priorities-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .priority-card {
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
      border-radius: 16px;
      padding: 20px;
      border: 2px solid;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .priority-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      transition: width 0.3s ease;
    }

    .priority-card:hover::before {
      width: 8px;
    }

    .priority-card.urgency-critical {
      border-color: #fecaca;
    }

    .priority-card.urgency-critical::before {
      background: #ef4444;
    }

    .priority-card.urgency-high {
      border-color: #fed7aa;
    }

    .priority-card.urgency-high::before {
      background: #f59e0b;
    }

    .priority-card.urgency-medium {
      border-color: #bfdbfe;
    }

    .priority-card.urgency-medium::before {
      background: #3b82f6;
    }

    .priority-card.urgency-low {
      border-color: #bbf7d0;
    }

    .priority-card.urgency-low::before {
      background: #10b981;
    }

    .priority-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }

    .priority-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .priority-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-critical {
      background: #fef2f2;
      color: #ef4444;
      border: 1px solid #fecaca;
    }

    .badge-high {
      background: #fffbeb;
      color: #f59e0b;
      border: 1px solid #fed7aa;
    }

    .badge-medium {
      background: #eff6ff;
      color: #3b82f6;
      border: 1px solid #bfdbfe;
    }

    .badge-low {
      background: #ecfdf5;
      color: #10b981;
      border: 1px solid #bbf7d0;
    }

    .priority-number {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #e2e8f0;
      color: #475569;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
    }

    .priority-action {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 16px 0;
      line-height: 1.4;
    }

    .priority-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-label {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-value {
      font-size: 14px;
      color: #1e293b;
      font-weight: 600;
    }

    .impact-value {
      color: #4f46e5;
    }

    @media (max-width: 640px) {
      .priority-details {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ActionPrioritiesComponent {
  actionPriorities = input.required<ActionPriority[]>();

  getUrgencyIcon(urgency: string): string {
    const icons: Record<string, string> = {
      'critical': '🚨',
      'high': '⚠️',
      'medium': '📌',
      'low': 'ℹ️'
    };
    return icons[urgency] || '•';
  }

  getUrgencyLabel(urgency: string): string {
    const labels: Record<string, string> = {
      'critical': 'CRITIQUE',
      'high': 'HAUTE',
      'medium': 'MOYENNE',
      'low': 'FAIBLE'
    };
    return labels[urgency] || urgency.toUpperCase();
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'sleep_deprivation': 'Sommeil',
      'sleep_insufficient': 'Sommeil',
      'severe_inactivity': 'Activité physique',
      'low_activity': 'Activité physique',
      'high_stress': 'Gestion du stress',
      'moderate_stress': 'Gestion du stress',
      'dehydration': 'Hydratation',
      'critical_oxygen': 'Santé respiratoire',
      'high_fever': 'Santé générale'
    };
    return labels[category] || category.replace(/_/g, ' ');
  }
}