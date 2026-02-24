import { Component, Inject, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SellerService } from '../../core/services/seller.service';

@Component({
  standalone: true,
  selector: 'app-product-reviews-dialog',
  imports: [CommonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="reviews-container">
      <h2 mat-dialog-title>Reviews for {{ data.productName }}</h2>
      
      <mat-dialog-content class="reviews-content">
        @for (review of reviews(); track review.id) {
          <div class="review-card">
            <div class="review-header">
              <span class="buyer-name">{{ review.buyerName || 'Verified Buyer' }}</span>
              <div class="stars">
                @for (star of [1,2,3,4,5]; track star) {
                  <mat-icon [class.filled]="star <= review.rating">star</mat-icon>
                }
              </div>
            </div>
            <p class="comment">"{{ review.comment }}"</p>
            <small class="date">{{ review.createdAt | date:'mediumDate' }}</small>
          </div>
        } @empty {
          <div class="empty-state">
            <mat-icon>rate_review</mat-icon>
            <p>No reviews yet for this product.</p>
          </div>
        }
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close class="close-btn">Close</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .reviews-container { background: #0f172a; color: white; border-radius: 12px; }
    .reviews-content { min-height: 200px; max-height: 400px; }
    .review-card { 
      background: rgba(255,255,255,0.03); 
      padding: 16px; 
      border-radius: 12px; 
      margin-bottom: 12px; 
      border: 1px solid #1e293b;
    }
    .review-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .buyer-name { font-weight: 600; color: #e2e8f0; }
    .stars { color: #475569; .filled { color: #fbbf24; } mat-icon { font-size: 18px; width: 18px; height: 18px; } }
    .comment { margin: 8px 0; color: #94a3b8; font-style: italic; font-size: 0.95rem; }
    .date { color: #64748b; font-size: 0.8rem; }
    .close-btn { color: #db2777; }
    .empty-state { text-align: center; padding: 60px 20px; color: #64748b; mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 10px; } }
  `]
})
export class ProductReviewsDialog implements OnInit {
  private sellerService = inject(SellerService);
  reviews = signal<any[]>([]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { productId: number, productName: string }
  ) {}

  ngOnInit() {
    this.sellerService.getProductReviews(this.data.productId).subscribe({
      next: (res: any) => {
        // Handle direct array or wrapped data structure
        this.reviews.set(Array.isArray(res) ? res : res.data || []);
      }
    });
  }
}