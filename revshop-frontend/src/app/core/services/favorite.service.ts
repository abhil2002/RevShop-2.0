import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private baseUrl = `${environment.apiBaseUrl}/favorites`;

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(this.baseUrl);
  }

 addToFavorites(productId: number) {
  return this.http.post(
    `${this.baseUrl}`,
    { productId }
  );
}

removeFromFavorites(productId: number) {
  return this.http.delete(
    `${this.baseUrl}/${productId}`
  );
}
}