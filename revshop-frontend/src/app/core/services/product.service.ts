import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

// Standardized API Response wrapper used by your backend
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  mrp: number;
  discountedPrice: number;
  quantity: number;
  category: string;
  sellerEmail: string;
  stockThreshold?: number; // Added for low stock logic
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient); // Modern injection
  private baseUrl = `${environment.apiBaseUrl}/products`;

  // ======================================================
  // BUYER SIDE (PAGINATED)
  // ======================================================

  getProducts(page: number = 0, size: number = 10): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  getProductById(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.baseUrl}/${id}`);
  }

  searchProducts(keyword: string, page: number = 0, size: number = 10): Observable<ApiResponse<any>> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/search`, { params });
  }

  getProductsByCategory(category: string, page: number = 0, size: number = 10): Observable<ApiResponse<any>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/category/${category}`, { params });
  }

  // ======================================================
  // SELLER SIDE (PROTECTED ROUTES)
  // ======================================================

  /**
   * Fetches products owned by the authenticated seller
   * Requires authInterceptor to be active in app.config.ts
   */
  getSellerProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.baseUrl}/seller`);
  }

  addProduct(data: Partial<Product>): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${this.baseUrl}`, data);
  }

  updateProduct(id: number, data: Partial<Product>): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.baseUrl}/${id}`, data);
  }

  deleteProduct(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}