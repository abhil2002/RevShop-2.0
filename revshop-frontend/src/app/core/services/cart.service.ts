import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl = `${environment.apiBaseUrl}/cart`;

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Load cart and update count
  loadCart(): Observable<any> {
    return this.http.get<any>(this.baseUrl).pipe(
      tap(res => {
        const items = res?.data ?? [];
        this.cartCountSubject.next(items.length);
      })
    );
  }

  addToCart(productId: number, quantity: number = 1): Observable<any> {
    return this.http.post(this.baseUrl, { productId, quantity }).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  removeFromCart(productId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${productId}`).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  updateQuantity(productId: number, quantity: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${productId}?quantity=${quantity}`,
      {}
    ).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  refreshCartCount() {
    this.loadCart().subscribe();
  }
}