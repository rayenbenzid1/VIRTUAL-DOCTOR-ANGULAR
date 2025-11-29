import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trends-period-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="period-selector">
      <button 
        class="period-btn"
        [class.active]="selectedPeriod() === 7"
        (click)="onPeriodSelect(7)">
        1 semaine
      </button>
      <button 
        class="period-btn"
        [class.active]="selectedPeriod() === 14"
        (click)="onPeriodSelect(14)">
        2 semaines
      </button>
      <button 
        class="period-btn"
        [class.active]="selectedPeriod() === 30"
        (click)="onPeriodSelect(30)">
        1 mois
      </button>
      <button 
        class="period-btn"
        [class.active]="selectedPeriod() === 60"
        (click)="onPeriodSelect(60)">
        2 mois
      </button>
    </div>
  `,
  styles: [`
    .period-selector {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background: white;
      padding: 16px;
      border-radius: 20px;
      margin-bottom: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .period-btn {
      padding: 12px 16px;
      border-radius: 12px;
      border: 2px solid transparent;
      background: #f8fafc;
      color: #64748b;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .period-btn:hover {
      background: #f1f5f9;
      color: #475569;
      transform: translateY(-2px);
    }

    .period-btn.active {
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
      color: white;
      border-color: transparent;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }

    @media (max-width: 640px) {
      .period-selector {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class TrendsPeriodSelectorComponent {
  selectedPeriod = input.required<number>();
  periodChange = output<number>();

  onPeriodSelect(days: number) {
    this.periodChange.emit(days);
  }
}