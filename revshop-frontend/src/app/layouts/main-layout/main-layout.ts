import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { TokenService } from '../../core/services/token.service';
import { NotificationService } from '../../core/services/notification.service';
import { FavoriteService } from '../../core/services/favorite.service';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatBadgeModule
  ],
  template: `
    <mat-toolbar color="primary">

      <span style="cursor:pointer;font-weight:bold;" routerLink="/">
        RevShop
      </span>

      <span style="flex:1 1 auto;"></span>

      <button mat-button routerLink="/">Products</button>
      <button mat-button routerLink="/cart">Cart</button>
      <button mat-button routerLink="/orders">Orders</button>

      <!-- ❤️ FAVORITES -->
      <button mat-button
              routerLink="/favorites"
              [matBadge]="favoriteCount"
              matBadgeColor="accent"
              [matBadgeHidden]="favoriteCount === 0">
        ❤️ Favorites
      </button>

      <!-- 🔔 NOTIFICATIONS -->
      <button mat-icon-button
              routerLink="/notifications"
              [matBadge]="unreadCount"
              matBadgeColor="warn"
              [matBadgeHidden]="unreadCount === 0">
        🔔
      </button>

      <button mat-button (click)="logout()">Logout</button>

    </mat-toolbar>

    <div style="padding:20px;">
      <router-outlet></router-outlet>
    </div>
  `
})
export class MainLayout implements OnInit {

  unreadCount = 0;
  favoriteCount = 0;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private notificationService: NotificationService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.loadFavorites();
  }

  loadNotifications() {
    this.notificationService.getNotifications()
      .subscribe((res: any) => {
        const notifications = res?.data ?? [];
        this.unreadCount = notifications.filter((n: any) => !n.read).length;
      });
  }

  loadFavorites() {
    this.favoriteService.getFavorites()
      .subscribe((res: any) => {
        const favorites = res?.data ?? [];
        this.favoriteCount = favorites.length;
      });
  }

  logout() {
    this.tokenService.clear();
    this.router.navigate(['/login']);
  }
}