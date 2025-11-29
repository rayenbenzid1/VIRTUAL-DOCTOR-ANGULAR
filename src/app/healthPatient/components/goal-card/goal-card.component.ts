import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Goal } from '../../models/goals.model';

@Component({
  selector: 'app-goal-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './goal-card.component.html',
  styleUrls: ['./goal-card.component.css']
})
export class GoalCardComponent {
  goal = input.required<Goal>();

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'activity': '🚶',
      'sleep': '😴',
      'hydration': '💧',
      'stress': '🧠',
      'cardiovascular': '❤️'
    };
    return icons[category] || '🎯';
  }

  getPriorityClass(priority: string): string {
    const classes: Record<string, string> = {
      'high': 'priority-high',
      'medium': 'priority-medium',
      'low': 'priority-low'
    };
    return classes[priority] || 'priority-medium';
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      'high': '⚠️ HAUTE',
      'medium': '📊 MOYENNE',
      'low': '✅ BASSE'
    };
    return labels[priority] || 'MOYENNE';
  }

  getProgress(): number {
    const current = this.goal().current;
    const target = this.goal().target;
    return Math.min(100, (current / target) * 100);
  }
}