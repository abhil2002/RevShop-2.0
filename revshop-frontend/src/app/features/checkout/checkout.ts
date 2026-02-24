import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { CartService } from '../../core/services/cart.service';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatIconModule, 
    MatSnackBarModule
  ],
  template: `
    <div class="checkout-wrapper">
      <header class="checkout-header">
        <button mat-icon-button routerLink="/cart" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Finalize <span>Order</span></h1>
      </header>

      <div class="checkout-layout">
        <div class="details-column">
          <form [formGroup]="checkoutForm">
            
            <div class="glass-section">
              <h3><mat-icon>local_shipping</mat-icon> Shipping Details</h3>
              <mat-form-field appearance="outline">
                <mat-label>Full Shipping Address</mat-label>
                <textarea matInput formControlName="shippingAddress" rows="3" placeholder="Enter your full delivery address..."></textarea>
                @if (checkoutForm.get('shippingAddress')?.invalid && checkoutForm.get('shippingAddress')?.touched) {
                  <mat-error>Shipping address is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Contact Phone</mat-label>
                <input matInput formControlName="contactPhone" placeholder="10-digit mobile number">
                @if (checkoutForm.get('contactPhone')?.invalid && checkoutForm.get('contactPhone')?.touched) {
                  <mat-error>Please enter a valid 10-digit phone number</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="glass-section">
              <h3><mat-icon>receipt</mat-icon> Billing Details</h3>
              <mat-form-field appearance="outline">
                <mat-label>Billing Address</mat-label>
                <input matInput formControlName="billingAddress" placeholder="Enter billing address">
                @if (checkoutForm.get('billingAddress')?.invalid && checkoutForm.get('billingAddress')?.touched) {
                  <mat-error>Billing address is required</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="glass-section">
              <h3><mat-icon>payment</mat-icon> Payment Method</h3>
              <mat-form-field appearance="outline">
                <mat-label>Select Payment</mat-label>
                <mat-select formControlName="paymentMethod">
                  <mat-option value="COD">Cash on Delivery (COD)</mat-option>
                  <mat-option value="UPI">UPI / QR Scan</mat-option>
                  <mat-option value="CARD">Credit / Debit Card</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </form>
        </div>

        <aside class="summary-column">
          <div class="summary-card">
            <h2>Order Summary</h2>
            
            <div class="mini-items-list">
              @for (item of cartItems(); track item.productId) {
                <div class="summary-item">
                  <span class="item-name">{{ item.productName }} <small>x{{ item.quantity }}</small></span>
                  <span class="item-price">₹{{ item.price * item.quantity }}</span>
                </div>
              }
            </div>

            <hr class="summary-divider">

            <div class="totals-area">
              <div class="total-row">
                <span>Subtotal</span>
                <span>₹{{ totalAmount() }}</span>
              </div>
              <div class="total-row">
                <span>Shipping</span>
                <span class="free-text">FREE</span>
              </div>
              <div class="total-row grand-total">
                <span>Total</span>
                <span>₹{{ totalAmount() }}</span>
              </div>
            </div>

            <button class="place-order-btn" 
                    [disabled]="checkoutForm.invalid || isLoading()" 
                    (click)="placeOrder()">
              {{ isLoading() ? 'Processing...' : 'Place Order Now' }}
            </button>

            <p class="secure-checkout">
              <mat-icon>verified_user</mat-icon> 
              Secure SSL Encrypted Transaction
            </p>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    /* Page Container */
    .checkout-wrapper { 
      padding: 100px 5% 40px; 
      max-width: 1300px; 
      margin: 0 auto; 
      color: #ffffff; 
      background: #0a0a0a; 
      min-height: 100vh;
    }

    /* Header Visibility Fix */
    .checkout-header { 
      display: flex; 
      align-items: center; 
      gap: 15px; 
      margin-bottom: 40px;
      h1 { 
        margin: 0; font-size: 2.2rem; font-weight: 800; color: #ffffff;
        span { color: #6366f1; } 
      }
      .back-btn { color: #ffffff; background: rgba(255,255,255,0.1); }
    }

    /* Grid Layout */
    .checkout-layout { 
      display: grid; 
      grid-template-columns: 1fr 400px; 
      gap: 40px; 
      align-items: start; 
    }

    /* Glassmorphism Section */
    .glass-section {
      background: #111827; 
      border: 1px solid #374151; 
      padding: 35px; 
      border-radius: 20px; 
      margin-bottom: 24px;
      h3 { display: flex; align-items: center; gap: 10px; margin-bottom: 30px; color: #6366f1; font-weight: 700; }
    }

    /* Material Overlap Fixes */
    ::ng-deep {
      .mat-mdc-form-field { width: 100%; margin-bottom: 10px; }
      
      /* Force label to float higher and not overlap placeholder */
      .mat-mdc-form-field-can-float.mat-form-field-should-float .mat-mdc-form-field-label {
        transform: translateY(-1.4rem) scale(0.85) !important;
        background: #111827 !important;
        padding: 0 10px !important;
        color: #6366f1 !important;
      }

      .mat-mdc-text-field-wrapper { background-color: rgba(255,255,255,0.03) !important; }
      .mat-mdc-input-element { color: #ffffff !important; }
      .mdc-notched-outline__leading, .mdc-notched-outline__notch, .mdc-notched-outline__trailing { border-color: #374151 !important; }
    }

    /* Sticky Summary Card */
    .summary-card {
      background: #1f2937; 
      padding: 30px; 
      border-radius: 24px; 
      border: 1px solid #374151;
      position: sticky; 
      top: 120px;
      h2 { color: #ffffff; margin-top: 0; font-weight: 800; }
    }

    .mini-items-list {
      max-height: 200px; overflow-y: auto; margin-bottom: 20px;
      .summary-item { 
        display: flex; justify-content: space-between; margin-bottom: 12px; color: #94a3b8; 
        small { color: #6366f1; font-weight: bold; margin-left: 5px; }
      }
    }

    .summary-divider { border: 0; border-top: 1px solid #374151; margin: 20px 0; }
    
    .total-row { 
      display: flex; justify-content: space-between; margin-bottom: 12px; color: #94a3b8; 
      &.grand-total { font-size: 1.6rem; font-weight: 900; color: #ffffff; margin-top: 20px; }
      .free-text { color: #10b981; font-weight: 800; }
    }

    /* Action Button */
    .place-order-btn {
      width: 100%; padding: 20px; background: #6366f1; color: white; border: none;
      border-radius: 16px; font-weight: 800; font-size: 1.1rem; margin-top: 25px;
      cursor: pointer; transition: 0.3s;
      &:disabled { background: #374151; color: #64748b; cursor: not-allowed; }
      &:hover:not(:disabled) { background: #4f46e5; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3); }
    }

    .secure-checkout { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 0.8rem; color: #64748b; margin-top: 20px; mat-icon { font-size: 16px; width: 16px; height: 16px; } }

    /* Responsive */
    @media (max-width: 1024px) { .checkout-layout { grid-template-columns: 1fr; } .summary-column { order: -1; } }
  `]
})
export class Checkout implements OnInit {
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  checkoutForm: FormGroup;
  isLoading = signal(false);
  cartItems = signal<any[]>([]);

  // Derived total using Signals
  totalAmount = computed(() => 
    this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  constructor() {
    this.checkoutForm = this.fb.group({
      shippingAddress: ['', Validators.required],
      billingAddress: ['', Validators.required],
      contactPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      paymentMethod: ['COD', Validators.required]
    });
  }

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.cartService.loadCart().subscribe({
      next: (res: any) => {
        this.cartItems.set(res?.data ?? []);
        // Redirect if cart is accessed via URL but empty
        if (this.cartItems().length === 0) {
          this.router.navigate(['/cart']);
        }
      },
      error: () => this.snackBar.open('Error loading cart data', 'Close', { duration: 3000 })
    });
  }

  placeOrder() {
    if (this.checkoutForm.invalid) return;

    this.isLoading.set(true);
    this.orderService.checkout(this.checkoutForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.snackBar.open('Success! Order placed successfully.', 'View Orders', { duration: 5000 })
          .onAction().subscribe(() => this.router.navigate(['/orders']));
        
        // Clear local cart if necessary and redirect
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to place order. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
}