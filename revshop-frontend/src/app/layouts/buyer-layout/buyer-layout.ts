import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';

import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { FavoriteService } from '../../core/services/favorite.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-buyer-layout',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule, 
    MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSelectModule,MatRadioModule
  ],
  templateUrl: './buyer-layout.html',
  styleUrls: ['./buyer-layout.scss']
})
export class BuyerLayout implements OnInit {
  // Signals for state management
  products = signal<any[]>([]);
  favorites = signal<number[]>([]);
  isLoading = signal(false);
  
  // Filter Signals
  keyword = signal('');
  category = signal('');
  sortOption = signal('default');

  categories = computed(() => {
    const unique = [...new Set(this.products().map(p => p.category))];
    return unique;
  });

  private searchSubject = new Subject<string>();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private favoriteService: FavoriteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(400)).subscribe(val => {
      this.keyword.set(val);
      this.fetchProducts();
    });
    this.fetchProducts();
    this.loadFavorites();
  }

  fetchProducts() {
    this.isLoading.set(true);
    const kw = this.keyword();
    const cat = this.category();

    const observer = {
      next: (res: any) => {
        let list = res?.data?.content ?? [];
        this.products.set(this.sortProducts(list));
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.showMessage('Error loading products');
      }
    };

    if (kw.trim()) {
      this.productService.searchProducts(kw, 0, 20).subscribe(observer);
    } else if (cat) {
      this.productService.getProductsByCategory(cat, 0, 20).subscribe(observer);
    } else {
      this.productService.getProducts(0, 20).subscribe(observer);
    }
  }

  sortProducts(list: any[]) {
    const sort = this.sortOption();
    if (sort === 'priceAsc') return [...list].sort((a, b) => a.discountedPrice - b.discountedPrice);
    if (sort === 'priceDesc') return [...list].sort((a, b) => b.discountedPrice - a.discountedPrice);
    return list;
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  loadFavorites() {
    this.favoriteService.getFavorites().subscribe((res: any) => {
      this.favorites.set((res?.data ?? []).map((p: any) => p.id));
    });
  }

  toggleFavorite(productId: number) {
    const isFav = this.favorites().includes(productId);
    const action = isFav 
      ? this.favoriteService.removeFromFavorites(productId) 
      : this.favoriteService.addToFavorites(productId);

    action.subscribe(() => {
      this.loadFavorites();
      this.showMessage(isFav ? 'Removed from favorites' : 'Added to favorites');
    });
  }

  addToCart(productId: number) {
    this.cartService.addToCart(productId, 1).subscribe({
      next: () => this.showMessage('Added to cart'),
      error: () => this.showMessage('Failed to add to cart')
    });
  }

  private showMessage(msg: string) {
    this.snackBar.open(msg, 'OK', { duration: 3000, panelClass: ['snack-custom'] });
  }
}