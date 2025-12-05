import { Component, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GoalsService } from '../../services/goals.service';
import { GoalConfigComponent } from '../goal-config/goal-config.component';
import { GoalCardComponent } from '../goal-card/goal-card.component';
import { PersonalizedGoalsResponse, GoalPreferences } from '../../models/goals.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, GoalConfigComponent, GoalCardComponent,NavbarComponent],
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css']
})
export class GoalsComponent {
  private goalsService = inject(GoalsService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);
  goalsData = signal<PersonalizedGoalsResponse | null>(null);
  showConfig = signal(true);

  // Computed values
  hasGoals = computed(() => this.goalsData() !== null);
  totalGoals = computed(() => this.goalsData()?.total_goals ?? 0);
  highPriorityCount = computed(() => this.goalsData()?.high_priority_count ?? 0);

  constructor() {
    // Effect pour logger les changements
    effect(() => {
      if (this.goalsData()) {
        console.log('Goals updated:', this.goalsData());
      }
    });
  }

  onConfigChanged(preferences: GoalPreferences) {
    this.loading.set(true);
    this.error.set(null);

    this.goalsService.getPersonalizedGoals(preferences).subscribe({
      next: (response) => {
        this.goalsData.set(response);
        this.showConfig.set(false);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading goals:', err);
        this.error.set('Impossible de charger les objectifs. Veuillez réessayer.');
        this.loading.set(false);
      }
    });
  }

  regenerateGoals() {
    this.showConfig.set(true);
    this.goalsData.set(null);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
