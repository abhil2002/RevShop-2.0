import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSnackBarModule, 
    RouterModule
  ],
  template: `
    <div class="form-wrapper">
      <header>
        <button mat-icon-button routerLink="/seller"><mat-icon>arrow_back</mat-icon></button>
        <h1>{{ isEdit ? 'Update' : 'List New' }} <span>Product</span></h1>
      </header>

      <div class="glass-card">
        <form [formGroup]="pForm" (ngSubmit)="save()">
          <div class="form-grid">
            <mat-form-field appearance="outline"><mat-label>Product Name</mat-label><input matInput formControlName="name"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Category</mat-label><input matInput formControlName="category"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>MRP (Original Price)</mat-label><input matInput type="number" formControlName="mrp"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Discounted Price</mat-label><input matInput type="number" formControlName="discountedPrice"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Initial Stock Quantity</mat-label><input matInput type="number" formControlName="quantity"></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Low Stock Alert Level</mat-label><input matInput type="number" formControlName="stockThreshold"></mat-form-field>
            <mat-form-field appearance="outline" class="full-width"><mat-label>Description</mat-label><textarea matInput formControlName="description" rows="4"></textarea></mat-form-field>
          </div>
          <button mat-flat-button color="primary" class="save-btn" type="submit" [disabled]="pForm.invalid">
            {{ isEdit ? 'Update Listing' : 'Publish Product' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-wrapper { padding: 40px; max-width: 900px; margin: auto; }
    header { display: flex; align-items: center; gap: 15px; margin-bottom: 30px; h1 { margin: 0; font-weight: 800; span { color: #6366f1; } } }
    .glass-card { background: white; padding: 40px; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .full-width { grid-column: 1 / span 2; }
    .save-btn { width: 100%; padding: 25px; border-radius: 12px; margin-top: 20px; font-weight: 800; font-size: 1.1rem; }
  `]
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  pForm: FormGroup;
  isEdit = false;
  id: number | null = null;

  constructor() {
    this.pForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      mrp: [0, [Validators.required, Validators.min(1)]],
      discountedPrice: [0, [Validators.required, Validators.min(1)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      stockThreshold: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required]
    });
  }

  ngOnInit() {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.isEdit = true;
      this.id = +paramId;
      // Hits GET /api/products/{id}
      this.productService.getProductById(this.id).subscribe(res => {
        if (res?.data) this.pForm.patchValue(res.data);
      });
    }
  }

  save() {
    if (this.pForm.invalid) return;

    // decides between POST /api/products or PUT /api/products/{id}
    const request = this.isEdit 
      ? this.productService.updateProduct(this.id!, this.pForm.value) 
      : this.productService.addProduct(this.pForm.value);

    request.subscribe({
      next: () => {
        this.snackBar.open(this.isEdit ? 'Product updated!' : 'Product listed!', 'OK', { duration: 2000 });
        this.router.navigate(['/seller']);
      },
      error: () => this.snackBar.open('Error saving product', 'Close', { duration: 3000 })
    });
  }
}