import { Injectable, inject } from '@angular/core'; // Added inject
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; // Added Router

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  token: string;
  role: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient); // Modern way to inject
  private router = inject(Router);
  private baseUrl = `${environment.apiBaseUrl}/auth`;

  login(email: string, password: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.baseUrl}/login`,
      { email, password }
    );
  }

  register(data: any): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.baseUrl}/register`,
      data
    );
  }

  // 🔥 ADD THIS METHOD
  logout(): void {
    // Clear all session data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    
    // Optional: if you store the whole user object
    localStorage.removeItem('user'); 

    // Redirect to login page
    this.router.navigate(['/login']);
  }

  // Helper to check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}