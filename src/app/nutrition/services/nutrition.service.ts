import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const BASE_URL = `${environment.BASE_URL}/nutrition-service/api/v1/nutrition`;

export interface DetectedFood {
  food_name: string;
  class_id: string;
  confidence: number;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  fiber: number;
  sugars: number;
  sodium: number;
}

export interface TotalNutrition {
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
  fiber: number;
  sugars: number;
  sodium: number;
}

export interface Alternative {
  name: string;
  class_id: string;
  confidence: number;
}

export interface AnalysisResponse {
  success: boolean;
  message: string;
  data: {
    analysis_id: string;
    image_url: string;
    detected_foods: DetectedFood[];
    portion_size: string;
    total_nutrition: TotalNutrition;
    recommendations: {
      tdee: number;
      meal_percentage: number;
      recommendations: string[];
      warnings: string[];
      health_score: number;
    };
    method: string;
    alternatives?: Alternative[];
  };
}

export interface HistoryItem {
  analysis_id: string;
  user_id: string;
  image_url: string;
  detected_foods: DetectedFood[];
  total_nutrition: TotalNutrition;
  recommendations: any;
  created_at: string;
  updated_at: string;
}

export interface HistoryResponse {
  success: boolean;
  message: string;
  data: {
    analyses: HistoryItem[];
    count: number;
  };
}

export interface StatisticsResponse {
  success: boolean;
  message: string;
  data: {
    total_analyses: number;
    average_per_meal: TotalNutrition;
    total_calories_tracked: number;
  };
}

export interface ModelStatusResponse {
  success: boolean;
  data: {
    status: string;
    model_info: {
      model_loaded: boolean;
      model_path: string;
      scaler_loaded: boolean;
      scaler_path: string | null;
      num_classes: number;
      input_shape: number[];
      output_shapes: {
        classification: number[];
        nutrition: number[];
      };
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class NutritionService {
  private http = inject(HttpClient);

  /**
   * Analyser une image de repas
   */
  analyzeFood(imageFile: File, useAi: boolean = true): Observable<AnalysisResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('use_ai', useAi.toString());

    return this.http.post<AnalysisResponse>(`${BASE_URL}/analyze`, formData);
  }

  /**
   * Récupérer l'historique des analyses
   */
  getHistory(limit: number = 50, skip: number = 0): Observable<HistoryResponse> {
    return this.http.get<HistoryResponse>(`${BASE_URL}/history?limit=${limit}&skip=${skip}`);
  }

  /**
   * Récupérer une analyse spécifique
   */
  getAnalysisById(analysisId: string): Observable<any> {
    return this.http.get(`${BASE_URL}/history/${analysisId}`);
  }

  /**
   * Récupérer les statistiques
   */
  getStatistics(): Observable<StatisticsResponse> {
    return this.http.get<StatisticsResponse>(`${BASE_URL}/statistics`);
  }

  /**
   * Supprimer une analyse
   */
  deleteAnalysis(analysisId: string): Observable<any> {
    return this.http.delete(`${BASE_URL}/history/${analysisId}`);
  }

  /**
   * Statut du modèle AI
   */
  getModelStatus(): Observable<ModelStatusResponse> {
    return this.http.get<ModelStatusResponse>(`${BASE_URL}/model/status`);
  }
}