import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppLifecycleService {

  constructor() {
    this.setupUnloadListener();
  }

  private setupUnloadListener() {
    // Vider le localStorage quand la fenêtre/onglet se ferme
    window.addEventListener('beforeunload', () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Ou vider tout le localStorage :
      // localStorage.clear();
    });
  }
}