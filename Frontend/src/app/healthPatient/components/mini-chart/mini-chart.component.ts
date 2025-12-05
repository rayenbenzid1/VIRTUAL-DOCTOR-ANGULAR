import { Component, input, ElementRef, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mini-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #miniCanvas></canvas>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
  `]
})
export class MiniChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('miniCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  data = input.required<number[]>();
  color = input.required<string>();
  minValue = input.required<number>();
  maxValue = input.required<number>();

  ngAfterViewInit() {
    this.drawChart();
  }

  ngOnChanges() {
    if (this.canvasRef) {
      this.drawChart();
    }
  }

  private drawChart() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = this.data();
    const color = this.color();
    const minVal = this.minValue();
    const maxVal = this.maxValue();

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = 4;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (data.length === 0) return;

    // Calculate points
    const range = maxVal - minVal || 1;
    const points = data.map((value, i) => ({
      x: padding + (i / (data.length - 1)) * (width - padding * 2),
      y: height - padding - ((value - minVal) / range) * (height - padding * 2)
    }));

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(1, color + '08');

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
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Draw last point highlight
    const lastPoint = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}