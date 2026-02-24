import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-seller-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatIconModule, 
    MatBadgeModule, 
    MatButtonModule, 
    MatMenuModule,
    MatTooltipModule
  ],
  template: `
    <div class="seller-shell">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo">Rev<span>Shop</span></div>
          <small>Seller Portal</small>
        </div>
        
        <nav class="nav-links">
          <a routerLink="/seller" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <mat-icon>inventory_2</mat-icon>
            <span>Inventory</span>
          </a>
          <a routerLink="/seller/orders" routerLinkActive="active">
            <mat-icon>shopping_cart</mat-icon>
            <span>Orders</span>
          </a>

          <a routerLink="/seller/notifications" routerLinkActive="active">
            <mat-icon [matBadge]="notifService.unreadCount()" 
                      matBadgeColor="warn" 
                      [matBadgeHidden]="notifService.unreadCount() === 0">
              notifications
            </mat-icon>
            <span>Notifications</span>
          </a>
        </nav>
      </aside>

      <div class="main-container">
        <header class="top-navbar">
          <div class="navbar-content">
            <div class="page-context">
              <span>Logged in as: <strong>Seller</strong></span>
            </div>
            
            <div class="navbar-actions">
              <button mat-icon-button [matMenuTriggerFor]="notifMenu" class="action-btn" matTooltip="Notifications">
                <mat-icon [matBadge]="notifService.unreadCount()" 
                          matBadgeColor="warn" 
                          [matBadgeHidden]="notifService.unreadCount() === 0">
                  notifications
                </mat-icon>
              </button>

              <button mat-icon-button (click)="onLogout()" class="action-btn logout-trigger" matTooltip="Sign Out">
                <mat-icon>logout</mat-icon>
              </button>
              
              <mat-menu #notifMenu="matMenu" class="notification-panel">
                <div class="notif-header">Notifications</div>
                <div class="notif-scroll">
                  @for (n of notifService.notifications(); track n.id) {
                    <div class="notif-item" [class.unread]="!n.read" (click)="markRead(n)">
                      <mat-icon class="notif-icon">info</mat-icon>
                      <div class="notif-text">
                        <p>{{ n.message }}</p>
                        <small>{{ n.createdAt | date:'shortTime' }}</small>
                      </div>
                    </div>
                  } @empty {
                    <div class="no-notif">No new notifications</div>
                  }
                </div>
              </mat-menu>
            </div>
          </div>
        </header>

        <main class="main-content">
          <div class="content-wrapper">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .seller-shell { display: flex; min-height: 100vh; background: #0f1115; }

    .sidebar { 
      width: 260px; background: #060b18; height: 100vh; position: fixed;
      display: flex; flex-direction: column; padding: 30px 20px; border-right: 1px solid #1e293b;
    }
    .sidebar-header { margin-bottom: 40px; 
      .logo { font-size: 1.8rem; font-weight: 800; color: #fff; span { color: #6366f1; } }
      small { color: #64748b; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 1px; }
    }
    .nav-links { display: flex; flex-direction: column; gap: 8px; }
    .nav-links a { 
      display: flex; align-items: center; gap: 15px; padding: 12px 18px;
      color: #94a3b8; text-decoration: none; border-radius: 12px; transition: 0.2s;
    }
    /* Active color matches your screenshot exactly */
    .nav-links a.active { background: #0000a3; color: white; box-shadow: 0 4px 15px rgba(0, 0, 163, 0.3); }

    .main-container { margin-left: 260px; flex: 1; display: flex; flex-direction: column; }
    
    .top-navbar { 
      height: 70px; background: #0f1115; border-bottom: 1px solid #1e293b;
      padding: 0 40px; display: flex; align-items: center; position: sticky; top: 0; z-index: 100;
    }
    .navbar-content { width: 100%; display: flex; justify-content: space-between; align-items: center; }
    .page-context { color: #94a3b8; font-size: 0.9rem; }
    
    .navbar-actions { display: flex; align-items: center; gap: 10px; }
    .action-btn { color: #94a3b8; transition: 0.2s; &:hover { color: white; background: rgba(255,255,255,0.05); } }
    .logout-trigger { color: #f87171; }

    ::ng-deep .notification-panel { background: #1e293b !important; color: white !important; border: 1px solid #334155; width: 320px; border-radius: 12px !important; }
    .notif-header { padding: 15px; font-weight: bold; border-bottom: 1px solid #334155; }
    .notif-item { 
      padding: 12px; display: flex; gap: 12px; cursor: pointer; border-bottom: 1px solid #334155; transition: 0.2s;
      &.unread { background: rgba(99, 102, 241, 0.1); }
      &:hover { background: rgba(255,255,255,0.05); }
      .notif-icon { color: #6366f1; font-size: 20px; }
      p { margin: 0; font-size: 0.85rem; line-height: 1.4; }
      small { color: #64748b; margin-top: 4px; display: block; }
    }
    .no-notif { padding: 30px; text-align: center; color: #64748b; }
    
    .main-content { padding: 40px; flex: 1; }
    .content-wrapper { max-width: 1400px; margin: 0 auto; }
  `]
})
export class SellerLayout implements OnInit {
  public notifService = inject(NotificationService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.notifService.startMonitoring();
  }

  markRead(notif: any) {
    if (!notif.read) {
      this.notifService.markAsRead(notif.id).subscribe();
    }
  }

  onLogout() {
    if (confirm('Are you sure you want to log out?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}