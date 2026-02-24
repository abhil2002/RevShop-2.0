import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  template: `
    <div class="details-wrapper">
      @if (order()) {
        <header class="checkout-header">
          <button mat-icon-button routerLink="/orders" class="back-btn">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1>Order <span>#{{ order().orderId }}</span></h1>
        </header>

        <div class="checkout-layout">
          <div class="details-column">
            <div class="glass-section">
              <h3><mat-icon>info</mat-icon> Order Information</h3>
              <div class="info-grid">
                <div class="info-item"><label>Date:</label> <span>{{ order().orderDate | date:'medium' }}</span></div>
                <div class="info-item"><label>Status:</label> <span class="badge">{{ order().status }}</span></div>
                <div class="info-item"><label>Payment:</label> <span>{{ order().paymentStatus }}</span></div>
              </div>
            </div>

            <div class="glass-section">
              <h3><mat-icon>inventory_2</mat-icon> Items Purchased</h3>
              <div class="items-table">
                @for (item of order().items; track item.productName) {
                  <div class="item-row">
                    <div class="prod-meta">
                      <span class="name">{{ item.productName }}</span>
                      <span class="qty">Qty: {{ item.quantity }}</span>
                    </div>
                    <span class="price">₹{{ item.price }}</span>
                  </div>
                }
              </div>
            </div>
          </div>

          <aside class="summary-column">
            <div class="summary-card">
              <h2>Billing Summary</h2>
              <div class="total-row grand-total">
                <span>Total Amount Paid</span>
                <span>₹{{ order().totalAmount }}</span>
              </div>
              <button class="place-order-btn" style="background: #10b981;">
                Download Invoice
              </button>
            </div>
          </aside>
        </div>
      } @else {
        <div class="loader">Loading order #{{ currentId }}...</div>
      }
    </div>
  `,
  styles: [`
    .details-wrapper { padding: 100px 5% 40px; max-width: 1300px; margin: 0 auto; color: #e2e8f0; background: #0f172a; min-height: 100vh; }
    .checkout-header { display: flex; align-items: center; gap: 15px; margin-bottom: 40px; 
      h1 { margin: 0; font-size: 2.2rem; font-weight: 800; color: #f8fafc; span { color: #818cf8; } }
      .back-btn { color: #94a3b8; }
    }
    .checkout-layout { display: grid; grid-template-columns: 1fr 400px; gap: 40px; }
    .glass-section { background: #1e293b; border: 1px solid #334155; padding: 35px; border-radius: 20px; margin-bottom: 24px;
      h3 { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; color: #818cf8; font-weight: 700; }
    }
    .info-grid { display: grid; gap: 10px; .info-item { display: flex; justify-content: space-between; label { color: #94a3b8; } .badge { background: #312e81; padding: 2px 10px; border-radius: 4px; font-size: 0.8rem; } } }
    .items-table { .item-row { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #334155; 
      .prod-meta { display: flex; flex-direction: column; .qty { font-size: 0.8rem; color: #94a3b8; } }
      .price { font-weight: 700; }
    } }
    .summary-card { background: #1e293b; padding: 30px; border-radius: 24px; border: 1px solid #334155; position: sticky; top: 120px; h2 { color: #f8fafc; margin-top: 0; } }
    .grand-total { font-size: 1.4rem; font-weight: 900; color: #ffffff; display: flex; justify-content: space-between; margin: 20px 0; }
    .place-order-btn { width: 100%; padding: 15px; border: none; border-radius: 12px; color: white; font-weight: 700; cursor: pointer; }
    .loader { text-align: center; margin-top: 50px; color: #94a3b8; }
  `]
})
export class OrderDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  
  order = signal<any>(null);
  currentId: string | null = null;

  ngOnInit() {
    this.currentId = this.route.snapshot.paramMap.get('id');
    const id = Number(this.currentId);
    
    this.orderService.getOrderHistory().subscribe((res: any) => {
      // We filter the history list to find this specific order ID
      const foundOrder = res?.data?.find((o: any) => o.orderId === id);
      this.order.set(foundOrder);
    });
  }
}