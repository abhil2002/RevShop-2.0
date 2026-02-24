import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/reviews';

  getReviewsByProduct(productId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${productId}`);
  }

  submitReview(reviewData: { productId: number; rating: number; comment: string }): Observable<any> {
    return this.http.post(this.apiUrl, reviewData);
  }
}