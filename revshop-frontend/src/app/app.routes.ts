import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  // --- AUTHENTICATION ---
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register')
        .then(m => m.Register)
  },

  // --- BUYER SECTION ---
  {
    path: '',
    canActivate: [authGuard, roleGuard],
    runGuardsAndResolvers: 'always',
    data: { role: 'BUYER' },
    loadComponent: () =>
      import('./layouts/main-layout/main-layout')
        .then(m => m.MainLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./layouts/buyer-layout/buyer-layout')
            .then(m => m.BuyerLayout)
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./features/cart/cart')
            .then(m => m.Cart)
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./features/checkout/checkout')
            .then(m => m.Checkout)
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/orders')
            .then(m => m.Orders)
      },
      {
        path: 'order-details/:id',
        loadComponent: () =>
          import('./features/order-details/order-details')
            .then(m => m.OrderDetails)
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./features/favorites/favorites.component')
            .then(m => m.Favorites)
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./features/product-details/product-details')
            .then(m => m.ProductDetailsComponent)
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notifications/notifications')
            .then(m => m.NotificationsComponent)
      }
    ]
  },

  // --- SELLER SECTION ---
  {
    path: 'seller',
    canActivate: [authGuard, roleGuard],
    data: { role: 'SELLER' },
    loadComponent: () => 
      import('./layouts/seller-layout/seller-layout')
        .then(m => m.SellerLayout),
    children: [
      {
        path: '', // Default: Inventory Dashboard
        loadComponent: () => 
          import('./features/seller/seller-dashboard')
            .then(m => m.SellerDashboard)
      },
      {
        path: 'add-product',
        loadComponent: () => 
          import('./features/seller/product-form')
            .then(m => m.ProductForm)
      },
      {
        path: 'edit/:id',
        loadComponent: () => 
          import('./features/seller/product-form')
            .then(m => m.ProductForm)
      },
      {
        path: 'orders',
        loadComponent: () => 
          import('./features/seller/orders')
            .then(m => m.SellerOrders)
      },
      // 🔥 NEW: Seller-specific Notifications View
      {
        path: 'notifications',
        loadComponent: () => 
          import('./features/seller/seller-notifications')
            .then(m => m.SellerNotifications)
      }
    ]
  },

  // --- FALLBACK ---
  {
    path: '**',
    redirectTo: 'login'
  }
];