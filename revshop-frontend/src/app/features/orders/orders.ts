import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { RouterModule } from '@angular/router';

// Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatIconModule, 
    MatButtonModule, 
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="orders-container">
      <header class="page-header">
        <div class="title-wrap">
          <h1>My <span>Orders</span></h1>
          <p>Track and manage your recent purchases</p>
        </div>
      </header>

      @if (isLoading()) {
        <div class="loader-box">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Fetching your history...</p>
        </div>
      } @else if (orders().length > 0) {
        <div class="orders-list">
          @for (order of orders(); track order.orderId) {
            <div class="order-card">
              <div class="order-header">
                <div class="meta">
                  <span class="order-id">#{{ order.orderId }}</span>
                  <span class="order-date">{{ order.orderDate | date:'dd MMM, yyyy' }}</span>
                </div>
                <div class="status-badges">
                  <span class="badge status" [attr.data-status]="order.status">
                    {{ order.status }}
                  </span>
                  <span class="badge payment" [class.success]="order.paymentStatus === 'SUCCESS'">
                    {{ order.paymentStatus }}
                  </span>
                </div>
              </div>

              <div class="order-items">
                @for (item of order.items; track item.productName) {
                  <div class="product-row">
                    <div class="prod-info">
                      <mat-icon>package_2</mat-icon>
                      <div class="text">
                        <span class="name">{{ item.productName }}</span>
                        <span class="qty">Qty: {{ item.quantity }}</span>
                      </div>
                    </div>
                    <span class="item-price">₹{{ item.price | number:'1.0-0' }}</span>
                  </div>
                }
              </div>

              <div class="order-footer">
                <div class="total-section">
                  <span class="label">Total Amount</span>
                  <span class="amount">₹{{ order.totalAmount | number:'1.0-0' }}</span>
                </div>
                <div class="action-section">
                  <button mat-stroked-button color="primary" [routerLink]="['/orders', order.orderId]">
                    View Details
                  </button>
                  <button mat-button class="track-btn">Track Order</button>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="empty-state">
          <div class="icon-circle">
            <mat-icon>receipt_long</mat-icon>
          </div>
          <h2>No orders yet</h2>
          <p>Looks like you haven't placed any orders yet. Start exploring our marketplace!</p>
          <button mat-flat-button color="primary" routerLink="/">Shop Now</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .orders-container { padding: 40px 5%; max-width: 1000px; margin: 0 auto; }
    .page-header { margin-bottom: 40px; h1 { font-size: 2.2rem; font-weight: 800; margin: 0; span { color: #6366f1; } } p { color: #64748b; margin-top: 5px; } }

    .orders-list { display: flex; flex-direction: column; gap: 24px; }

    .order-card {
      background: white; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden;
      transition: 0.3s ease; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      &:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); transform: translateY(-2px); }
    }

    .order-header {
      padding: 20px 24px; background: #f8fafc; display: flex; justify-content: space-between; align-items: center;
      .meta { display: flex; flex-direction: column; .order-id { font-weight: 800; color: #1e293b; } .order-date { font-size: 0.85rem; color: #64748b; } }
    }

    .status-badges { display: flex; gap: 10px; }
    .badge {
      padding: 6px 12px; border-radius: 50px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
      &.status { background: #e0e7ff; color: #4338ca; &[data-status="DELIVERED"] { background: #dcfce7; color: #15803d; } }
      &.payment { background: #fee2e2; color: #b91c1c; &.success { background: #dcfce7; color: #15803d; } }
    }

    .order-items { padding: 20px 24px; .product-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; &:last-child { margin-bottom: 0; } } }
    .prod-info { display: flex; align-items: center; gap: 12px; mat-icon { color: #cbd5e1; } .text { display: flex; flex-direction: column; .name { font-weight: 600; color: #334155; } .qty { font-size: 0.8rem; color: #94a3b8; } } }
    .item-price { font-weight: 600; color: #1e293b; }

    .order-footer {
      padding: 20px 24px; border-top: 1px dashed #e2e8f0; display: flex; justify-content: space-between; align-items: center;
      .total-section { display: flex; flex-direction: column; .label { font-size: 0.8rem; color: #64748b; } .amount { font-size: 1.25rem; font-weight: 800; color: #6366f1; } }
      .action-section { display: flex; gap: 12px; }
    }

    .empty-state {
      text-align: center; padding: 80px 0;
      .icon-circle { width: 80px; height: 80px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; mat-icon { font-size: 40px; width: 40px; height: 40px; color: #94a3b8; } }
      h2 { font-weight: 800; color: #1e293b; } p { color: #64748b; margin-bottom: 30px; max-width: 300px; margin-left: auto; margin-right: auto; }
    }

    .loader-box { text-align: center; padding: 100px 0; display: flex; flex-direction: column; align-items: center; gap: 15px; color: #64748b; }
  `]
})
export class Orders implements OnInit {
  orderService = inject(OrderService);
  
  orders = signal<any[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.isLoading.set(true);
    this.orderService.getOrderHistory().subscribe({
      next: (res: any) => {
        this.orders.set(res?.data ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}