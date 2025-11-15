import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = "http://localhost:8082/api/v1/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private http: HttpClient) {}

  login(data: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Observable<any> {
    return this.http.post(`${API_URL}/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${API_URL}/register`, data);
  }
}
