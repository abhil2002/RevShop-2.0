import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, interval, startWith, switchMap, catchError, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  
  private baseUrl = `${environment.apiBaseUrl}/notifications`;

  notifications = signal<any[]>([]);
  unreadCount = signal<number>(0);

  getNotifications(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  markAsRead(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/read`, {});
  }

  startMonitoring() {
    interval(30000)
      .pipe(
        startWith(0),
        switchMap(() => this.getNotifications().pipe(
          catchError(() => of([]))
        ))
      )
      .subscribe((res: any) => {
        const data = Array.isArray(res) ? res : res?.data || [];
        const unreadOnly = data.filter((n: any) => !n.read);
        
        if (unreadOnly.length > this.unreadCount()) {
          // Pass the newest unread notification to the categorized handler
          this.handleIncomingNotification(unreadOnly[0]);
        }

        this.notifications.set(data);
        this.unreadCount.set(unreadOnly.length);
      });
  }

  /**
   * 🔥 SEPARATION LOGIC: 
   * Detects if the message is an Order or Low Stock alert
   */
  private handleIncomingNotification(notif: any) {
    const message = notif.message.toLowerCase();
    
    // Determine type based on keywords
    const isLowStock = message.includes('stock') || message.includes('threshold') || message.includes('quantity');

    if (isLowStock) {
      this.showLowStockToast(notif);
    } else {
      this.showOrderToast(notif);
    }
  }

  private showOrderToast(notif: any) {
    this.snackBar.open(`📦 Order Received: ${notif.message}`, 'VIEW', {
      duration: 6000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['order-success-toast'] // Unique CSS class
    }).onAction().subscribe(() => {
      this.router.navigate(['/seller/orders']);
    });
  }

  private showLowStockToast(notif: any) {
    this.snackBar.open(`⚠️ Low Stock Alert: ${notif.message}`, 'INVENTORY', {
      duration: 10000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['stock-warning-toast'] // Unique CSS class
    }).onAction().subscribe(() => {
      this.router.navigate(['/seller']);
    });
  }

  resetSellerBadge() {
    this.unreadCount.set(0);
  }
}