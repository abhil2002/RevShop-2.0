import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { SellerService } from '../../core/services/seller.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'app-seller-orders',
  imports: [
    CommonModule, 
    MatTableModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTooltipModule
  ],
  providers: [DatePipe, DecimalPipe],
  template: `
    <div class="orders-shell">
      <header class="page-header">
        <div class="title-group">
          <h1>Incoming <span>Orders</span></h1>
          <p>You have {{ orders().length }} total orders in your history</p>
        </div>
      </header>

      <div class="table-card mat-elevation-z8">
        <table mat-table [dataSource]="orders()" *ngIf="orders().length > 0; else emptyState">
          
          <ng-container matColumnDef="orderId">
            <th mat-header-cell *matHeaderCellDef> Order Ref </th>
            <td mat-cell *matCellDef="let o"> 
              <div class="order-ref">
                <span class="id">#{{ o.orderId }}</span>
                <span class="date">{{ o.orderDate | date:'mediumDate' }}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="customer">
            <th mat-header-cell *matHeaderCellDef> Buyer </th>
            <td mat-cell *matCellDef="let o"> {{ o.buyerEmail }} </td>
          </ng-container>

          <ng-container matColumnDef="products">
            <th mat-header-cell *matHeaderCellDef> Items </th>
            <td mat-cell *matCellDef="let o">
              <div class="items-list">
                @for (item of o.items; track item.productName) {
                  <div class="item-row">
                    <strong>{{ item.productName }}</strong> 
                    <span class="qty">x{{ item.quantity }}</span>
                  </div>
                }
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef> Total Amount </th>
            <td mat-cell *matCellDef="let o"> 
              <span class="price">₹{{ o.totalAmount | number:'1.2-2' }}</span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>

        <ng-template #emptyState>
          <div class="empty-placeholder">
            <mat-icon>receipt_long</mat-icon>
            <h3>No Orders Found</h3>
            <p>Customer orders will appear here once purchases are made.</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .orders-shell { padding: 20px; color: white; }
    .page-header { margin-bottom: 30px; 
      h1 { margin: 0; font-weight: 800; span { color: #6366f1; } }
      p { color: #94a3b8; font-size: 0.9rem; }
    }

    .table-card { background: #060b18; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; }
    table { width: 100%; background: transparent; }
    th { color: #94a3b8; padding: 20px; background: rgba(255,255,255,0.02); border-bottom: 2px solid #1e293b; }
    td { color: #e2e8f0; padding: 20px; border-bottom: 1px solid #1e293b; }

    .order-ref { display: flex; flex-direction: column; 
      .id { font-weight: bold; color: #fff; } 
      .date { font-size: 0.75rem; color: #64748b; }
    }

    .items-list { display: flex; flex-direction: column; gap: 4px;
      .item-row { font-size: 0.9rem; .qty { color: #6366f1; margin-left: 5px; font-weight: bold; } }
    }

    .price { font-weight: 700; color: #22c55e; font-size: 1.1rem; }

    .empty-placeholder { padding: 100px; text-align: center; color: #64748b;
      mat-icon { font-size: 60px; width: 60px; height: 60px; margin-bottom: 15px; }
      h3 { color: white; margin-bottom: 10px; }
    }
  `]
})
export class SellerOrders implements OnInit {
  private sellerService = inject(SellerService);
  
  orders = signal<any[]>([]);
  cols = ['orderId', 'customer', 'products', 'amount'];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.sellerService.getIncomingOrders().subscribe({
      next: (res: any) => {
        // Senior Dev Fix: The backend returns the array DIRECTLY
        if (Array.isArray(res)) {
          this.orders.set(res);
        } else if (res?.data && Array.isArray(res.data)) {
          this.orders.set(res.data);
        }
      },
      error: (err) => {
        console.error('Order Fetch Error:', err);
      }
    });
  }
}