import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalPreferences } from '../../models/goals.model';

@Component({
  selector: 'app-goal-config',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './goal-config.component.html',
  styleUrls: ['./goal-config.component.css'],
})
export class GoalConfigComponent {
  selectedGoals = signal<Set<string>>(
    new Set(['activity', 'sleep', 'hydration', 'stress', 'cardiovascular'])
  );
  timeframeDays = signal(14);
  difficulty = signal<'easy' | 'moderate' | 'challenging'>('moderate');

  configChanged = output<GoalPreferences>();

  goalOptions = [
    { id: 'activity', icon: '🚶', label: 'Activité' },
    { id: 'sleep', icon: '😴', label: 'Sommeil' },
    { id: 'hydration', icon: '💧', label: 'Hydratation' },
    { id: 'stress', icon: '🧠', label: 'Stress' },
    { id: 'cardiovascular', icon: '❤️', label: 'Cardio' },
  ];

  difficultyOptions: {
    value: 'easy' | 'moderate' | 'challenging';
    icon: string;
    label: string;
    color: string;
  }[] = [
    { value: 'easy', icon: '😊', label: 'Facile (+10%)', color: '#e8d5ff' },
    { value: 'moderate', icon: '💪', label: 'Modéré (+25%)', color: '#7c3aed' },
    { value: 'challenging', icon: '🔥', label: 'Difficile (+50%)', color: '#dc2626' },
  ];

  toggleGoal(goalId: string) {
    const current = new Set(this.selectedGoals());
    if (current.has(goalId)) {
      current.delete(goalId);
    } else {
      current.add(goalId);
    }
    this.selectedGoals.set(current);
  }

  setDifficulty(difficulty: 'easy' | 'moderate' | 'challenging') {
    this.difficulty.set(difficulty);
  }

  updateTimeframe(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.timeframeDays.set(parseInt(value));
  }

  generateGoals() {
    const preferences: GoalPreferences = {
      preferred_goals: Array.from(this.selectedGoals()),
      timeframe_days: this.timeframeDays(),
      difficulty: this.difficulty(),
    };
    this.configChanged.emit(preferences);
  }
}
