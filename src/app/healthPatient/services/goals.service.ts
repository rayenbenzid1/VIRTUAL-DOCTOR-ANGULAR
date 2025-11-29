import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PersonalizedGoalsResponse, GoalPreferences } from '../models/goals.model';

@Injectable({
  providedIn: 'root'
})
export class GoalsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.BASE_URL}/model-ai-service/personalized-goals`;

  getPersonalizedGoals(preferences: GoalPreferences): Observable<PersonalizedGoalsResponse> {
    const user = localStorage.getItem('user');
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }
    
    const userData = JSON.parse(user);
    const email = userData.email;

    return this.http.post<PersonalizedGoalsResponse>(
      `${this.baseUrl}/${email}`,
      preferences
    );
  }
}