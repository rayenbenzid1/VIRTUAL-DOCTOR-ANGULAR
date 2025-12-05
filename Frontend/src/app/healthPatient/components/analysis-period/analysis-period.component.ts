import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analysis-period',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="period-selector-card">
      <div class="card-header">
        <h2 class="card-title">
          <span class="title-icon">📅</span>
          Période d'analyse
        </h2>
      </div>

      <div class="card-body">
        <!-- Quick periods -->
        <div class="quick-periods">
          <label class="period-label">Périodes rapides</label>
          <div class="period-buttons">
            <button 
              class="period-btn"
              [class.active]="selectedPeriod() === 1"
              (click)="onPeriodSelect(1)">
              Aujourd'hui
            </button>
            <button 
              class="period-btn"
              [class.active]="selectedPeriod() === 3"
              (click)="onPeriodSelect(3)">
              3 jours
            </button>
            <button 
              class="period-btn"
              [class.active]="selectedPeriod() === 7"
              (click)="onPeriodSelect(7)">
              7 jours
            </button>
            <button 
              class="period-btn"
              [class.active]="selectedPeriod() === 30"
              (click)="onPeriodSelect(30)">
              30 jours
            </button>
          </div>
        </div>

        <!-- Specific date -->
        <div class="date-selector">
          <label class="period-label">Date spécifique</label>
          <div class="date-input-group">
            <input 
              type="date"
              class="date-input"
              [value]="selectedDate() || ''"
              (change)="onDateChange($event)"
              [max]="today">
            <button 
              class="btn-clear"
              *ngIf="selectedDate()"
              (click)="clearDate()">
              ✕ Effacer
            </button>
          </div>
        </div>

        <!-- Analyze button -->
        <button class="btn-analyze" (click)="onAnalyze()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          Analyser
        </button>
      </div>
    </div>
  `,
  styles: [`
    .period-selector-card {
      background: white;
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .card-header {
      margin-bottom: 20px;
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
    }

    .title-icon {
      font-size: 24px;
    }

    .card-body {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .period-label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #475569;
      margin-bottom: 12px;
    }

    .period-buttons {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .period-btn {
      padding: 12px;
      border-radius: 12px;
      border: 2px solid #e2e8f0;
      background: white;
      color: #475569;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .period-btn:hover {
      border-color: #cbd5e1;
      background: #f8fafc;
    }

    .period-btn.active {
      border-color: #4f46e5;
      background: #eef2ff;
      color: #4f46e5;
    }

    .date-input-group {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .date-input {
      flex: 1;
      padding: 12px;
      border-radius: 12px;
      border: 2px solid #e2e8f0;
      font-size: 14px;
      font-weight: 500;
      color: #1e293b;
      transition: all 0.2s ease;
    }

    .date-input:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }

    .btn-clear {
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      background: #fee2e2;
      color: #ef4444;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-clear:hover {
      background: #fecaca;
    }

    .btn-analyze {
      width: 100%;
      padding: 14px;
      border-radius: 12px;
      border: none;
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: white;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }

    .btn-analyze:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
    }

    @media (max-width: 640px) {
      .period-buttons {
        grid-template-columns: repeat(2, 1fr);
      }

      .date-input-group {
        flex-direction: column;
      }

      .btn-clear {
        width: 100%;
      }
    }
  `]
})
export class AnalysisPeriodComponent {
  selectedPeriod = input.required<number>();
  selectedDate = input<string | null>(null);

  periodChange = output<number>();
  dateSelected = output<string>();
  analyze = output<void>();

  today = new Date().toISOString().split('T')[0];

  onPeriodSelect(period: number) {
    this.periodChange.emit(period);
  }

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.dateSelected.emit(input.value);
    }
  }

  clearDate() {
    this.dateSelected.emit('');
  }

  onAnalyze() {
    this.analyze.emit();
  }
}