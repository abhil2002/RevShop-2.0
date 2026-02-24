import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SellerService } from '../../core/services/seller.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Added for Reviews
import { ProductReviewsDialog } from './product-reviews-dialog'; // Import your new dialog

@Component({
  standalone: true,
  selector: 'app-seller-dashboard',
  imports: [
    CommonModule, 
    RouterModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule
  ],
  template: `
    <div class="dashboard-container">
      <header class="page-header">
        <div class="header-text">
          <h1>Inventory <span>Management</span></h1>
          <p>Logged in as: {{ sellerEmail() }}</p>
        </div>
        <button mat-flat-button class="pink-btn" routerLink="/seller/add-product">
          <mat-icon>add</mat-icon> Add New Product
        </button>
      </header>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="icon-circle blue"><mat-icon>inventory_2</mat-icon></div>
          <div class="stat-content">
            <span class="label">Total Products</span>
            <span class="value">{{ products().length }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="icon-circle orange"><mat-icon>low_priority</mat-icon></div>
          <div class="stat-content">
            <span class="label">Out of Stock</span>
            <span class="value warning">{{ outOfStockCount() }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="icon-circle green"><mat-icon>account_balance_wallet</mat-icon></div>
          <div class="stat-content">
            <span class="label">Total Value</span>
            <span class="value">₹{{ totalValue().toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <div class="table-wrapper mat-elevation-z8">
        <table mat-table [dataSource]="products()" *ngIf="products().length > 0; else emptyState">
          
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Product Details </th>
            <td mat-cell *matCellDef="let p"> 
              <div class="product-info">
                <span class="p-name">{{p.name}}</span>
                <span class="p-cat">{{p.category}}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef> Price (MRP/Disc) </th>
            <td mat-cell *matCellDef="let p"> 
                <span class="mrp">₹{{p.mrp}}</span> 
                <span class="disc">₹{{p.discountedPrice}}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="stock">
            <th mat-header-cell *matHeaderCellDef> Stock </th>
            <td mat-cell *matCellDef="let p"> 
              <span class="stock-badge" [class.danger]="p.quantity === 0" [class.warning]="p.quantity <= 5">
                {{ p.quantity }} units
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="ratings">
            <th mat-header-cell *matHeaderCellDef> Feedback </th>
            <td mat-cell *matCellDef="let p"> 
               <button mat-icon-button color="accent" (click)="viewReviews(p)" matTooltip="View Reviews">
                 <mat-icon>star_rate</mat-icon>
               </button>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let p">
              <button mat-icon-button color="primary" [routerLink]="['/seller/edit', p.id]" matTooltip="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteProduct(p.id)" matTooltip="Delete">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>

        <ng-template #emptyState>
          <div class="empty-box">
            <mat-icon class="huge-icon">inventory</mat-icon>
            <h3>No Products Found</h3>
            <p>Your inventory is empty. Click "Add New Product" to get started.</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 20px; color: #fff; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; 
      h1 { margin: 0; font-weight: 800; span { color: #6366f1; } }
      p { color: #64748b; margin: 0; }
    }
    .pink-btn { background: #db2777; color: white; border-radius: 10px; padding: 0 20px; }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: #0f172a; border: 1px solid #1e293b; padding: 20px; border-radius: 16px; display: flex; align-items: center; gap: 15px; }
    .icon-circle { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
      &.blue { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
      &.orange { background: rgba(249, 115, 22, 0.1); color: #f97316; }
      &.green { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
    }
    .stat-content { .label { color: #64748b; font-size: 0.8rem; } .value { font-size: 1.5rem; font-weight: 700; } }

    .table-wrapper { background: #060b18; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b; }
    table { width: 100%; background: transparent; }
    th { background: rgba(255,255,255,0.02); color: #94a3b8; font-weight: 700; padding: 20px; }
    td { padding: 15px 20px; color: #e2e8f0; border-bottom: 1px solid #1e293b; }
    
    .product-info { display: flex; flex-direction: column; .p-name { font-weight: 600; } .p-cat { font-size: 0.75rem; color: #64748b; } }
    .mrp { font-size: 0.8rem; text-decoration: line-through; color: #64748b; margin-right: 8px; }
    .disc { color: #22c55e; font-weight: 700; }
    .stock-badge { 
      padding: 4px 10px; border-radius: 6px; background: rgba(255,255,255,0.05); 
      &.danger { color: #f87171; background: rgba(248, 113, 113, 0.1); }
      &.warning { color: #fbbf24; background: rgba(251, 191, 36, 0.1); }
    }

    .empty-box { text-align: center; padding: 80px; color: #64748b; .huge-icon { font-size: 50px; width: 50px; height: 50px; } }
  `]
})
export class SellerDashboard implements OnInit {
  private sellerService = inject(SellerService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog); // Injected for Reviews

  products = signal<any[]>([]);
  sellerEmail = signal(localStorage.getItem('email') || 'Seller');
  
  // Added 'ratings' to columns
  cols = ['name', 'price', 'stock', 'ratings', 'actions'];

  // Derived Stats
  outOfStockCount = computed(() => this.products().filter(p => p.quantity === 0).length);
  totalValue = computed(() => this.products().reduce((acc, p) => acc + (p.discountedPrice * p.quantity), 0));

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.sellerService.getDashboardProducts().subscribe({
      next: (res: any) => {
        // Mapping Spring Data Paginated Response
        if (res && res.data && Array.isArray(res.data.content)) {
          this.products.set(res.data.content);
        } else if (Array.isArray(res)) {
          this.products.set(res);
        }
      },
      error: (err) => {
        this.snack.open('Error loading products', 'Close');
      }
    });
  }

  // 🔥 Open the Feedback Dialog
  viewReviews(product: any) {
    this.dialog.open(ProductReviewsDialog, {
      width: '500px',
      data: { productId: product.id, productName: product.name },
      panelClass: 'dark-dialog'
    });
  }

  deleteProduct(id: number) {
    if (confirm('Delete this product?')) {
      this.sellerService.deleteProduct(id).subscribe(() => {
        this.snack.open('Product deleted', 'OK', { duration: 2000 });
        this.fetchData();
      });
    }
  }
}