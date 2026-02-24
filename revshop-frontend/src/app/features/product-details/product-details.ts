import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { ReviewService } from '../../core/services/review.service'; // Added
import { FormsModule } from '@angular/forms'; // Added

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field'; // Added
import { MatInputModule } from '@angular/material/input'; // Added

@Component({
  standalone: true,
  selector: 'app-product-details',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="details-wrapper">
      <nav class="breadcrumb">
        <button mat-icon-button routerLink="/"><mat-icon>arrow_back</mat-icon></button>
        <span>Back to Marketplace</span>
      </nav>

      @if (isLoading()) {
        <div class="loader-container">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Loading Product Excellence...</p>
        </div>
      } @else if (product()) {
        <div class="product-grid">
          
          <div class="visual-section">
            <div class="image-placeholder">
              <mat-icon>shopping_bag</mat-icon>
              @if (product().quantity < 5) {
                <span class="stock-tag low">Only {{ product().quantity }} Left</span>
              } @else {
                <span class="stock-tag">In Stock</span>
              }
            </div>
          </div>

          <div class="info-section">
            <header>
              <mat-chip-listbox>
                <mat-chip class="category-chip">{{ product().category }}</mat-chip>
              </mat-chip-listbox>
              <h1>{{ product().name }}</h1>
              <p class="description">{{ product().description }}</p>
            </header>

            <div class="pricing-card">
              <div class="price-row">
                <span class="current-price">₹{{ product().discountedPrice }}</span>
                @if (product().mrp > product().discountedPrice) {
                  <span class="original-mrp">₹{{ product().mrp }}</span>
                  <span class="discount-percent">{{ discountPercent() }}% OFF</span>
                }
              </div>
              <p class="tax-info">Inclusive of all taxes</p>
            </div>

            <div class="action-grid">
              <button mat-flat-button color="primary" class="cart-btn" (click)="addToBag()">
                <mat-icon>shopping_cart</mat-icon>
                Add to Bag
              </button>
              
              <button mat-stroked-button class="wishlist-btn" (click)="toggleWishlist()">
                <mat-icon>{{ isWishlisted() ? 'favorite' : 'favorite_border' }}</mat-icon>
                {{ isWishlisted() ? 'Saved' : 'Wishlist' }}
              </button>
            </div>

            <div class="features-list">
              <div class="feature"><mat-icon>verified</mat-icon> Authentic Product</div>
              <div class="feature"><mat-icon>local_shipping</mat-icon> Fast Delivery</div>
              <div class="feature"><mat-icon>assignment_return</mat-icon> 7-Day Return Policy</div>
            </div>
          </div>
        </div>

        <section class="reviews-section">
          <div class="section-header">
            <h2>Customer <span>Reviews</span></h2>
            <p>Authentication and quality insights from other buyers</p>
          </div>

          <div class="review-layout">
            <div class="add-review-card">
              <h3>Share Your Experience</h3>
              <div class="rating-selector">
                @for (star of [1,2,3,4,5]; track star) {
                  <mat-icon (click)="newRating.set(star)" 
                            [class.active]="star <= newRating()">
                    {{ star <= newRating() ? 'star' : 'star_border' }}
                  </mat-icon>
                }
              </div>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Your Feedback</mat-label>
                <textarea matInput [(ngModel)]="newComment" placeholder="What did you like or dislike?"></textarea>
              </mat-form-field>
              <button mat-flat-button color="primary" class="submit-rev" (click)="submitReview()" [disabled]="!newComment()">
                Post Review
              </button>
            </div>

            <div class="reviews-feed">
              @for (rev of reviews(); track rev.id) {
                <div class="review-card">
                  <div class="rev-header">
                    <div class="rev-stars">
                      @for (s of [1,2,3,4,5]; track s) {
                        <mat-icon>{{ s <= rev.rating ? 'star' : 'star_border' }}</mat-icon>
                      }
                    </div>
                    <span class="rev-date">{{ rev.createdAt | date:'mediumDate' }}</span>
                  </div>
                  <p class="rev-comment">{{ rev.comment }}</p>
                </div>
              } @empty {
                <div class="empty-reviews">
                  <mat-icon>rate_review</mat-icon>
                  <p>No reviews yet. Be the first to share your thoughts!</p>
                </div>
              }
            </div>
          </div>
        </section>

      } @else {
        <div class="error-state">
          <mat-icon>error_outline</mat-icon>
          <h2>Product Not Found</h2>
          <button mat-flat-button color="primary" routerLink="/">Return Home</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .details-wrapper { padding: 100px 5% 40px; max-width: 1200px; margin: 0 auto; color: #f8fafc; background: #0f172a; min-height: 100vh; }
    .breadcrumb { display: flex; align-items: center; gap: 10px; margin-bottom: 30px; color: #94a3b8; button { color: #94a3b8; } }
    .product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; margin-bottom: 80px; }

    /* Visual Side */
    .visual-section { position: sticky; top: 120px; }
    .image-placeholder { 
      background: #1e293b; border-radius: 24px; height: 500px; border: 1px solid #334155;
      display: flex; align-items: center; justify-content: center; position: relative;
      mat-icon { font-size: 100px; width: 100px; height: 100px; color: #334155; }
    }
    .stock-tag { 
      position: absolute; top: 20px; left: 20px; background: #10b981; color: white; 
      padding: 6px 14px; border-radius: 50px; font-size: 0.8rem; font-weight: 700;
      &.low { background: #ef4444; }
    }

    /* Info Side */
    .info-section {
      h1 { font-size: 3rem; font-weight: 800; margin: 15px 0; color: #ffffff; }
      .category-chip { background: #312e81 !important; color: #c7d2fe !important; font-weight: 700; }
      .description { font-size: 1.1rem; line-height: 1.6; color: #94a3b8; margin-bottom: 30px; }
    }

    .pricing-card {
      background: rgba(255,255,255,0.03); padding: 25px; border-radius: 20px; 
      border-left: 4px solid #6366f1; margin-bottom: 40px;
      .price-row { display: flex; align-items: center; gap: 15px; }
      .current-price { font-size: 2.5rem; font-weight: 900; color: #ffffff; }
      .original-mrp { font-size: 1.2rem; text-decoration: line-through; color: #64748b; }
      .discount-percent { color: #10b981; font-weight: 800; font-size: 1rem; }
    }

    .action-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 15px; margin-bottom: 40px; }
    .cart-btn { padding: 28px; border-radius: 14px; font-weight: 800; font-size: 1.1rem; background: #6366f1; }
    .wishlist-btn { border-radius: 14px; color: #ffffff; border-color: #334155; }

    /* Reviews Section */
    .reviews-section { border-top: 1px solid #334155; padding-top: 60px; }
    .section-header { margin-bottom: 40px; h2 { font-size: 2rem; font-weight: 800; span { color: #6366f1; } } p { color: #94a3b8; } }
    
    .review-layout { display: grid; grid-template-columns: 350px 1fr; gap: 40px; align-items: start; }
    
    .add-review-card { 
      background: #1e293b; padding: 30px; border-radius: 20px; border: 1px solid #334155;
      h3 { margin-bottom: 20px; font-weight: 700; }
    }
    .rating-selector { display: flex; gap: 5px; margin-bottom: 20px; 
      mat-icon { color: #475569; cursor: pointer; &.active { color: #fbbf24; } }
    }
    .full-width { width: 100%; }
    ::ng-deep .mat-mdc-text-field-wrapper { background-color: rgba(15, 23, 42, 0.5) !important; }
    .submit-rev { width: 100%; padding: 20px; border-radius: 12px; font-weight: 700; }

    .review-card { 
      background: rgba(255,255,255,0.02); padding: 25px; border-radius: 16px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.05);
      .rev-header { display: flex; justify-content: space-between; margin-bottom: 12px; .rev-stars mat-icon { font-size: 18px; color: #fbbf24; } .rev-date { color: #64748b; font-size: 0.85rem; } }
      .rev-comment { line-height: 1.6; color: #cbd5e1; }
    }

    .empty-reviews { text-align: center; padding: 40px; color: #64748b; mat-icon { font-size: 40px; } }

    .loader-container, .error-state { text-align: center; padding: 100px 0; color: #94a3b8; mat-icon { font-size: 48px; } }

    @media (max-width: 900px) { .product-grid, .review-layout { grid-template-columns: 1fr; } .visual-section { position: static; } }
  `]
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private favoriteService = inject(FavoriteService);
  private reviewService = inject(ReviewService); // Added
  private snackBar = inject(MatSnackBar);

  product = signal<any>(null);
  isLoading = signal(true);
  isWishlisted = signal(false);
  
  // Review Signals
  reviews = signal<any[]>([]);
  newRating = signal(5);
  newComment = signal('');

  discountPercent = computed(() => {
    const p = this.product();
    if (!p || !p.mrp) return 0;
    return Math.round(((p.mrp - p.discountedPrice) / p.mrp) * 100);
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (id) {
        this.loadProduct(id);
        this.loadReviews(id); // Fetch reviews on init
      }
    });
  }

  loadProduct(id: number) {
    this.isLoading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (res: any) => {
        this.product.set(res?.data ?? null);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadReviews(productId: number) {
    this.reviewService.getReviewsByProduct(productId).subscribe({
      next: (res: any) => this.reviews.set(res?.data ?? [])
    });
  }

  submitReview() {
    const data = {
      productId: this.product().id,
      rating: this.newRating(),
      comment: this.newComment()
    };

    this.reviewService.submitReview(data).subscribe({
      next: () => {
        this.snackBar.open('Review posted successfully! ✨', 'OK', { duration: 3000 });
        this.loadReviews(this.product().id); // Refresh feed
        this.newComment.set(''); // Reset form
        this.newRating.set(5);
      },
      error: () => this.snackBar.open('Failed to post review.', 'Close', { duration: 3000 })
    });
  }

  addToBag() {
    this.cartService.addToCart(this.product().id, 1).subscribe(() => {
      this.snackBar.open('Added to your bag! 🛍️', 'View Cart', { duration: 3000 })
        .onAction().subscribe(() => { /* route to cart */ });
    });
  }

  toggleWishlist() {
    this.isWishlisted.update(v => !v);
    const msg = this.isWishlisted() ? 'Added to Wishlist' : 'Removed from Wishlist';
    this.snackBar.open(msg, 'OK', { duration: 2000 });
  }
}