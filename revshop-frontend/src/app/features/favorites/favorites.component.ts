import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../core/services/favorite.service';
import { CartService } from '../../core/services/cart.service';
import { RouterModule } from '@angular/router';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="wishlist-container">
      <header class="page-header">
        <div class="title-wrap">
          <h1>My <span>Wishlist</span></h1>
          <p>Items you've saved for later</p>
        </div>
        @if (favorites().length > 0) {
          <span class="count-badge">{{ favorites().length }} Items</span>
        }
      </header>

      @if (isLoading()) {
        <div class="loader-box">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Opening your wishlist...</p>
        </div>
      } @else if (favorites().length > 0) {
        <div class="wishlist-grid">
          @for (product of favorites(); track product.id) {
            <div class="wishlist-card">
              <div class="image-box" [routerLink]="['/products', product.id]">
                <mat-icon class="box-icon">favorite</mat-icon>
                <button class="remove-btn" (click)="remove($event, product.id)" title="Remove">
                  <mat-icon>close</mat-icon>
                </button>
              </div>

              <div class="info-box">
                <small class="category">{{ product.category || 'General' }}</small>
                <h3 [routerLink]="['/products', product.id]">{{ product.name }}</h3>
                <p class="desc">{{ product.description }}</p>
                
                <div class="price-row">
                  <span class="price">₹{{ product.discountedPrice }}</span>
                  @if (product.mrp > product.discountedPrice) {
                    <span class="mrp">₹{{ product.mrp }}</span>
                  }
                </div>
              </div>

              <div class="card-actions">
                <button mat-flat-button color="primary" class="add-to-cart" (click)="addToCart(product.id)">
                  <mat-icon>shopping_cart</mat-icon>
                  Move to Bag
                </button>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="empty-wishlist">
          <div class="icon-circle">
            <mat-icon>favorite_border</mat-icon>
          </div>
          <h2>Your wishlist is empty</h2>
          <p>Save items you like in your wishlist to review them later and add to cart.</p>
          <button mat-stroked-button color="primary" routerLink="/">Explore Products</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .wishlist-container { padding: 40px 5%; max-width: 1200px; margin: 0 auto; min-height: 80vh; }
    
    .page-header { 
      display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px;
      h1 { font-size: 2.2rem; font-weight: 800; margin: 0; span { color: #6366f1; } }
      p { color: #64748b; margin-top: 5px; }
      .count-badge { background: #eef2ff; color: #6366f1; padding: 6px 14px; border-radius: 50px; font-weight: 700; font-size: 0.85rem; }
    }

    .wishlist-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); 
      gap: 30px; 
    }

    .wishlist-card {
      background: white; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden;
      display: flex; flex-direction: column; transition: 0.3s ease;
      &:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05); }
    }

    .image-box {
      height: 180px; background: #f1f5f9; display: flex; align-items: center; justify-content: center;
      position: relative; cursor: pointer;
      .box-icon { font-size: 50px; width: 50px; height: 50px; color: #e2e8f0; }
      .remove-btn { 
        position: absolute; top: 12px; right: 12px; background: white; border: none; 
        width: 32px; height: 32px; border-radius: 50%; color: #94a3b8; cursor: pointer;
        display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        &:hover { color: #ef4444; }
        mat-icon { font-size: 18px; width: 18px; height: 18px; }
      }
    }

    .info-box {
      padding: 20px; flex-grow: 1;
      .category { color: #6366f1; font-weight: 700; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.5px; }
      h3 { margin: 8px 0; font-size: 1.1rem; color: #1e293b; font-weight: 700; cursor: pointer; &:hover { color: #6366f1; } }
      .desc { color: #64748b; font-size: 0.85rem; line-height: 1.4; height: 38px; overflow: hidden; margin-bottom: 15px; }
      .price-row { 
        .price { font-size: 1.2rem; font-weight: 800; color: #1e293b; margin-right: 10px; }
        .mrp { color: #94a3b8; text-decoration: line-through; font-size: 0.85rem; }
      }
    }

    .card-actions { 
      padding: 0 20px 20px;
      .add-to-cart { width: 100%; border-radius: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; }
    }

    .empty-wishlist {
      text-align: center; padding: 80px 0;
      .icon-circle { width: 80px; height: 80px; background: #f8fafc; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; mat-icon { font-size: 40px; width: 40px; height: 40px; color: #cbd5e1; } }
      h2 { font-weight: 800; color: #1e293b; }
      p { color: #64748b; max-width: 320px; margin: 0 auto 30px; line-height: 1.6; }
    }

    .loader-box { text-align: center; padding: 100px 0; display: flex; flex-direction: column; align-items: center; gap: 15px; color: #64748b; }
  `]
})
export class Favorites implements OnInit {
  favoriteService = inject(FavoriteService);
  cartService = inject(CartService);
  snackBar = inject(MatSnackBar);

  favorites = signal<any[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites() {
    this.isLoading.set(true);
    this.favoriteService.getFavorites().subscribe({
      next: (res: any) => {
        this.favorites.set(res?.data ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  remove(event: Event, productId: number) {
    event.stopPropagation(); // Prevent navigation to details
    this.favoriteService.removeFromFavorites(productId).subscribe(() => {
      this.favorites.update(items => items.filter(p => p.id !== productId));
      this.snackBar.open('Removed from wishlist', 'Close', { duration: 2000 });
    });
  }

  addToCart(productId: number) {
    this.cartService.addToCart(productId, 1).subscribe({
      next: () => {
        this.snackBar.open('Moved to bag!', 'View Cart', { duration: 3000 })
          .onAction().subscribe(() => { /* route to cart */ });
      },
      error: () => this.snackBar.open('Failed to add to bag', 'Close', { duration: 2000 })
    });
  }
}