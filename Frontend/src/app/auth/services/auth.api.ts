import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


const API_URL = `${environment.BASE_URL}/auth-service/api/v1/auth`;

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private http: HttpClient) { }

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
