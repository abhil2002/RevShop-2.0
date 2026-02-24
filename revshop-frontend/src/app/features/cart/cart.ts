import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSnackBarModule
  ],
  template: `
    <div class="cart-container">
      <header class="cart-header">
        <h1>Shopping <span>Bag</span></h1>
        <p>{{ cartItems().length }} items in your cart</p>
      </header>

      @if (isLoading()) {
        <div class="loader-box">Loading your items...</div>
      } @else if (cartItems().length > 0) {
        <div class="cart-layout">
          <div class="items-section">
            @for (item of cartItems(); track item.productId) {
              <div class="cart-item-card">
                <div class="item-img">
                  <mat-icon>inventory_2</mat-icon>
                </div>
                
                <div class="item-details">
                  <h3>{{ item.productName }}</h3>
                  <p class="unit-price">₹{{ item.price }} / unit</p>
                  
                  <div class="item-controls">
                    <div class="qty-picker">
                      <button (click)="updateQuantity(item.productId, item.quantity - 1)">-</button>
                      <span>{{ item.quantity }}</span>
                      <button (click)="updateQuantity(item.productId, item.quantity + 1)">+</button>
                    </div>
                    <button class="remove-link" (click)="removeItem(item.productId)">
                      <mat-icon>delete_outline</mat-icon> Remove
                    </button>
                  </div>
                </div>

                <div class="item-total">
                  ₹{{ item.price * item.quantity }}
                </div>
              </div>
            }
          </div>

          <aside class="summary-section">
            <div class="summary-card">
              <h2>Order Summary</h2>
              <div class="summary-row">
                <span>Subtotal</span>
                <span>₹{{ totalAmount() }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <span class="free">FREE</span>
              </div>
              <hr>
              <div class="summary-row total">
                <span>Total</span>
                <span>₹{{ totalAmount() }}</span>
              </div>
              
              <button class="checkout-btn" (click)="goToCheckout()">
                Proceed to Checkout
              </button>
              
              <a routerLink="/" class="continue-shopping">
                <mat-icon>arrow_back</mat-icon> Continue Shopping
              </a>
            </div>
          </aside>
        </div>
      } @else {
        <div class="empty-cart">
          <mat-icon>shopping_basket</mat-icon>
          <h2>Your bag is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <button mat-flat-button color="primary" routerLink="/">Start Shopping</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-container { padding: 40px 5%; max-width: 1400px; margin: 0 auto; }
    .cart-header { margin-bottom: 30px; h1 { font-size: 2.2rem; font-weight: 800; margin: 0; span { color: #6366f1; } } p { color: #64748b; margin: 5px 0 0; } }
    .cart-layout { display: grid; grid-template-columns: 1fr 350px; gap: 40px; align-items: start; }
    
    .cart-item-card {
      background: white; border: 1px solid #f1f5f9; border-radius: 16px; padding: 20px;
      margin-bottom: 20px; display: flex; align-items: center; gap: 20px; transition: 0.3s;
      &:hover { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
    }

    .item-img { width: 100px; height: 100px; background: #f8fafc; border-radius: 12px; display: flex; align-items: center; justify-content: center; mat-icon { font-size: 40px; color: #cbd5e1; } }
    .item-details { flex: 1; h3 { margin: 0; font-size: 1.1rem; font-weight: 700; color: #1e293b; } .unit-price { color: #94a3b8; font-size: 0.9rem; margin: 4px 0 12px; } }
    .item-controls { display: flex; align-items: center; gap: 24px; }

    .qty-picker {
      display: flex; align-items: center; background: #f1f5f9; border-radius: 8px; padding: 4px;
      button { border: none; background: white; border-radius: 6px; width: 28px; height: 28px; cursor: pointer; font-weight: bold; &:hover { background: #6366f1; color: white; } }
      span { padding: 0 15px; font-weight: 700; min-width: 20px; text-align: center; }
    }

    .remove-link { background: none; border: none; color: #ef4444; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 0.85rem; font-weight: 600; mat-icon { font-size: 18px; } }
    .item-total { font-size: 1.2rem; font-weight: 800; color: #1e293b; }

    .summary-card { background: white; padding: 24px; border-radius: 20px; border: 1px solid #f1f5f9; position: sticky; top: 100px; h2 { font-size: 1.25rem; font-weight: 800; margin-bottom: 20px; } }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 12px; color: #64748b; .free { color: #10b981; font-weight: 700; } &.total { color: #1e293b; font-size: 1.2rem; font-weight: 800; margin-top: 15px; } }
    
    .checkout-btn { width: 100%; padding: 16px; background: #6366f1; color: white; border: none; border-radius: 12px; font-weight: 700; margin: 20px 0; cursor: pointer; transition: 0.2s; &:hover { background: #4f46e5; transform: translateY(-2px); } }
    .continue-shopping { display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; color: #94a3b8; font-size: 0.9rem; font-weight: 600; &:hover { color: #6366f1; } mat-icon { font-size: 18px; } }

    .empty-cart { text-align: center; padding: 100px 0; mat-icon { font-size: 80px; width: 80px; height: 80px; color: #e2e8f0; margin-bottom: 20px; } h2 { font-weight: 800; color: #1e293b; } p { color: #94a3b8; margin-bottom: 30px; } }
    
    @media (max-width: 992px) { .cart-layout { grid-template-columns: 1fr; } .summary-card { position: static; margin-top: 20px; } }
  `]
})
export class Cart implements OnInit {
  cartItems = signal<any[]>([]);
  isLoading = signal(true);

  totalAmount = computed(() => 
    this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  constructor(
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.isLoading.set(true);
    this.cartService.loadCart().subscribe({
      next: (res: any) => {
        this.cartItems.set(res?.data ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  updateQuantity(productId: number, newQty: number) {
    if (newQty < 1) return;
    this.cartService.updateQuantity(productId, newQty).subscribe(() => {
      this.cartItems.update(items => 
        items.map(item => item.productId === productId ? { ...item, quantity: newQty } : item)
      );
      this.snackBar.open('Quantity updated', 'OK', { duration: 2000 });
    });
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId).subscribe(() => {
      this.cartItems.update(items => items.filter(i => i.productId !== productId));
      this.snackBar.open('Item removed', 'OK', { duration: 2000 });
    });
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}