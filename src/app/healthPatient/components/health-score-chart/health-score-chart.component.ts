import { Component, input, computed, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ChartData {
  dates: string[];
  scores: number[];
}

@Component({
  selector: 'app-health-score-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div class="chart-header">
        <h3>Évolution du score de santé</h3>
      </div>
      <div class="chart-wrapper">
        <canvas #chartCanvas></canvas>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      background: white;
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .chart-header {
      margin-bottom: 20px;
    }

    .chart-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
    }

    .chart-wrapper {
      position: relative;
      height: 300px;
      width: 100%;
    }

    canvas {
      max-width: 100%;
      height: 100%;
    }
  `]
})
export class HealthScoreChartComponent implements AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  chartData = input.required<ChartData>();
  trend = input.required<string>();

  maxScore = computed(() => Math.max(...this.chartData().scores, 100));
  minScore = computed(() => Math.min(...this.chartData().scores, 0));

  ngAfterViewInit() {
    this.drawChart();
  }

  private drawChart() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = this.chartData();
    const trend = this.trend();

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.1)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.02)');

    // Draw area under line
    const points = this.calculatePoints(data.scores, chartWidth, chartHeight, padding);
    
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    points.forEach((point, i) => {
      if (i === 0) {
        ctx.lineTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    points.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.strokeStyle = trend === 'increasing' ? '#10b981' : 
                      trend === 'decreasing' ? '#ef4444' : '#3b82f6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Draw points
    points.forEach((point, i) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.strokeStyle = trend === 'increasing' ? '#10b981' : 
                        trend === 'decreasing' ? '#ef4444' : '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw axes
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';

    // X-axis labels (dates)
    const labelInterval = Math.ceil(data.dates.length / 5);
    data.dates.forEach((date, i) => {
      if (i % labelInterval === 0 || i === data.dates.length - 1) {
        const x = padding + (i / (data.dates.length - 1)) * chartWidth;
        const formattedDate = this.formatDate(date);
        ctx.fillText(formattedDate, x, height - padding + 20);
      }
    });

    // Y-axis labels
    ctx.textAlign = 'right';
    const maxVal = Math.max(...data.scores);
    const minVal = Math.min(...data.scores);
    const range = maxVal - minVal;
    const step = range / 4;

    for (let i = 0; i <= 4; i++) {
      const value = Math.round(minVal + step * i);
      const y = height - padding - (i / 4) * chartHeight;
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }
  }

  private calculatePoints(scores: number[], chartWidth: number, chartHeight: number, padding: number) {
    const maxVal = Math.max(...scores);
    const minVal = Math.min(...scores);
    const range = maxVal - minVal || 1;

    return scores.map((score, i) => ({
      x: padding + (i / (scores.length - 1)) * chartWidth,
      y: padding + chartHeight - ((score - minVal) / range) * chartHeight
    }));
  }

  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  }
}