import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniChartComponent } from '../mini-chart/mini-chart.component';

export interface MetricData {
  key: string;
  label: string;
  icon: string;
  color: string;
  currentValue: number;
  averageValue: number;
  trend: string;
  data: number[];
  dates: string[];
  unit: string;
  minValue: number;
  maxValue: number;
}

@Component({
  selector: 'app-metric-cards',
  standalone: true,
  imports: [CommonModule, MiniChartComponent],
  template: `
    <div class="metrics-grid">
      @for (metric of metrics(); track metric.key) {
      <div class="metric-card" [style.border-color]="metric.color + '30'">
        <div class="metric-header">
          <div class="metric-icon" [style.background]="metric.color + '20'" [style.color]="metric.color">
            {{ metric.icon }}
          </div>
          <div class="metric-trend" [class]="'trend-' + metric.trend">
            {{ getTrendIcon(metric.trend) }}
          </div>
        </div>

        <h3 class="metric-label">{{ metric.label }}</h3>

        <div class="metric-values">
          <div class="current-value">
            <span class="value-number" [style.color]="metric.color">
              {{ formatValue(metric.currentValue) }}
            </span>
            <span class="value-unit">{{ metric.unit }}</span>
          </div>
          <div class="average-badge">
            <span class="badge-label">Moyenne:</span>
            <span class="badge-value">{{ formatValue(metric.averageValue) }}{{ metric.unit }}</span>
          </div>
        </div>

        <div class="metric-chart">
          <app-mini-chart 
            [data]="metric.data"
            [color]="metric.color"
            [minValue]="metric.minValue"
            [maxValue]="metric.maxValue">
          </app-mini-chart>
        </div>

        <div class="metric-range">
          <span class="range-label">Min: {{ formatValue(metric.minValue) }}{{ metric.unit }}</span>
          <span class="range-label">Max: {{ formatValue(metric.maxValue) }}{{ metric.unit }}</span>
        </div>
      </div>
      }
    </div>
  `,
  styles: [`
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .metric-card {
      background: white;
      border-radius: 20px;
      padding: 24px;
      border: 2px solid;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .metric-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--metric-color);
      transition: width 0.3s ease;
    }

    .metric-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    }

    .metric-card:hover::before {
      width: 8px;
    }

    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .metric-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .metric-trend {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
    }

    .metric-trend.trend-increasing {
      background: #ecfdf5;
      color: #10b981;
    }

    .metric-trend.trend-decreasing {
      background: #fef2f2;
      color: #ef4444;
    }

    .metric-trend.trend-stable {
      background: #eff6ff;
      color: #3b82f6;
    }

    .metric-trend.trend-insufficient_data {
      background: #f1f5f9;
      color: #64748b;
    }

    .metric-label {
      margin: 0 0 16px 0;
      font-size: 14px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .metric-values {
      margin-bottom: 20px;
    }

    .current-value {
      display: flex;
      align-items: baseline;
      gap: 4px;
      margin-bottom: 12px;
    }

    .value-number {
      font-size: 36px;
      font-weight: 800;
      line-height: 1;
    }

    .value-unit {
      font-size: 16px;
      font-weight: 600;
      color: #94a3b8;
    }

    .average-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #f8fafc;
      border-radius: 8px;
      font-size: 12px;
    }

    .badge-label {
      color: #64748b;
      font-weight: 500;
    }

    .badge-value {
      color: #1e293b;
      font-weight: 700;
    }

    .metric-chart {
      height: 80px;
      margin-bottom: 16px;
      border-radius: 12px;
      overflow: hidden;
      background: #f8fafc;
    }

    .metric-range {
      display: flex;
      justify-content: space-between;
      padding-top: 16px;
      border-top: 1px solid #f1f5f9;
    }

    .range-label {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MetricCardsComponent {
  metrics = input.required<MetricData[]>();

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'increasing': return '↑';
      case 'decreasing': return '↓';
      case 'stable': return '→';
      default: return '—';
    }
  }

  formatValue(value: number): string {
    return Math.round(value * 10) / 10 + '';
  }
}