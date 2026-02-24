import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SellerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}`; 

  // ==========================================
  // 📦 INVENTORY MANAGEMENT
  // ==========================================

  /**
   * View all products in inventory with stock levels.
   * Returns paginated data including MRP and Discounted Price.
   */
  getDashboardProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/seller`);
  }

  addProduct(productData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, productData);
  }

  updateProduct(id: number, productData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}`, productData);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }

  // ==========================================
  // 🚚 ORDER MANAGEMENT
  // ==========================================

  /**
   * View all incoming orders for seller's products.
   */
  getIncomingOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/seller/orders`);
  }

  // ==========================================
  // ⭐ REVIEWS & RATINGS
  // ==========================================

  /**
   * 🔥 FIXED: View product reviews and ratings.
   * Uses the specific seller-centric review endpoint.
   */
  getProductReviews(productId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/reviews/seller/${productId}`);
  }

  // ==========================================
  // 🔔 THRESHOLDS & ALERTS
  // ==========================================

  /**
   * Set inventory threshold for low stock alerts.
   */
  updateStockThreshold(productId: number, threshold: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/products/${productId}/threshold`, { threshold });
  }
}