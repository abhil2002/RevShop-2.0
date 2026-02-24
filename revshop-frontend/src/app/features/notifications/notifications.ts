import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="notif-container">
      <header class="page-header">
        <div class="title-wrap">
          <h1>My <span>Activity</span></h1>
          <p>Stay updated with your orders and account alerts</p>
        </div>
        @if (notifications().length > 0) {
          <button mat-stroked-button color="primary" (click)="markAllAsRead()">
            Mark all as read
          </button>
        }
      </header>

      @if (isLoading()) {
        <div class="loader-box">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Syncing alerts...</p>
        </div>
      } @else if (notifications().length > 0) {
        <div class="notif-feed">
          @for (n of notifications(); track n.id) {
            <div class="notif-item" [class.unread]="!n.read">
              <div class="status-indicator"></div>
              
              <div class="icon-box" [attr.data-type]="n.type || 'info'">
                <mat-icon>{{ getIcon(n.type) }}</mat-icon>
              </div>

              <div class="content-box">
                <p class="message">{{ n.message }}</p>
                <span class="timestamp">
                   <mat-icon>schedule</mat-icon>
                   {{ n.createdAt | date:'medium' }}
                </span>
              </div>

              @if (!n.read) {
                <div class="action-box">
                  <button mat-icon-button color="primary" 
                          matTooltip="Mark as read"
                          (click)="markAsRead(n.id)">
                    <mat-icon>done_all</mat-icon>
                  </button>
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div class="empty-state">
          <div class="icon-circle">
            <mat-icon>notifications_off</mat-icon>
          </div>
          <h2>All caught up!</h2>
          <p>No new notifications at the moment. We'll alert you when something important happens.</p>
          <button mat-flat-button color="primary" routerLink="/">Go Shopping</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .notif-container { padding: 40px 5%; max-width: 800px; margin: 0 auto; min-height: 80vh; }
    
    .page-header { 
      display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px;
      h1 { font-size: 2.2rem; font-weight: 800; margin: 0; span { color: #6366f1; } }
      p { color: #64748b; margin-top: 5px; }
    }

    .notif-feed { display: flex; flex-direction: column; gap: 16px; }

    .notif-item {
      background: white; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0;
      display: flex; align-items: center; gap: 20px; position: relative;
      transition: all 0.2s ease;

      &.unread {
        background: #fcfdff; border-color: #6366f1;
        .status-indicator { background: #6366f1; }
      }

      &:hover { transform: translateX(5px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    }

    .status-indicator {
      position: absolute; left: 0; top: 0; bottom: 0; width: 4px; 
      background: transparent; border-radius: 4px 0 0 4px;
    }

    .icon-box {
      width: 48px; height: 48px; border-radius: 12px; display: flex; 
      align-items: center; justify-content: center; background: #f1f5f9;
      mat-icon { color: #64748b; }
      
      &[data-type="ORDER"] { background: #e0e7ff; mat-icon { color: #6366f1; } }
      &[data-type="PROMO"] { background: #fef3c7; mat-icon { color: #d97706; } }
      &[data-type="ALERT"] { background: #fee2e2; mat-icon { color: #ef4444; } }
    }

    .content-box {
      flex-grow: 1;
      .message { margin: 0; font-size: 0.95rem; font-weight: 500; color: #1e293b; line-height: 1.4; }
      .timestamp { 
        display: flex; align-items: center; gap: 4px; font-size: 0.8rem; 
        color: #94a3b8; margin-top: 6px;
        mat-icon { font-size: 14px; width: 14px; height: 14px; }
      }
    }

    .empty-state {
      text-align: center; padding: 80px 0;
      .icon-circle { 
        width: 80px; height: 80px; background: #f8fafc; border-radius: 50%; 
        display: flex; align-items: center; justify-content: center; 
        margin: 0 auto 24px; mat-icon { font-size: 40px; width: 40px; height: 40px; color: #cbd5e1; } 
      }
      h2 { font-weight: 800; color: #1e293b; }
      p { color: #64748b; max-width: 320px; margin: 0 auto 30px; line-height: 1.6; }
    }

    .loader-box { text-align: center; padding: 100px 0; display: flex; flex-direction: column; align-items: center; gap: 15px; color: #64748b; }
  `]
})
export class NotificationsComponent implements OnInit {
  notificationService = inject(NotificationService);

  notifications = signal<any[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
    this.isLoading.set(true);
    this.notificationService.getNotifications().subscribe({
      next: (res: any) => {
        this.notifications.set(res?.data ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  markAsRead(id: number) {
    this.notificationService.markAsRead(id).subscribe(() => {
      // Optimistic Update
      this.notifications.update(items => 
        items.map(n => n.id === id ? { ...n, read: true } : n)
      );
    });
  }

  markAllAsRead() {
    // Implement bulk read in service if available
    this.notifications().forEach(n => {
      if (!n.read) this.markAsRead(n.id);
    });
  }

  getIcon(type: string): string {
    switch (type) {
      case 'ORDER': return 'local_shipping';
      case 'PROMO': return 'sell';
      case 'ALERT': return 'error_outline';
      default: return 'notifications';
    }
  }
}