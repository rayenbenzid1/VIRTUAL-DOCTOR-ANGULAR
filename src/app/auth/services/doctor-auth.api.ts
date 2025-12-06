import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


const API_URL = `${environment.BASE_URL}/doctor-activation-service/api/doctors`;

@Injectable({
    providedIn: 'root'
})
export class DoctorAuthApiService {

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
