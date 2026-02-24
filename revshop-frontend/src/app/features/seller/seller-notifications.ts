import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs'; // Added for segregation

@Component({
  standalone: true,
  selector: 'app-seller-notifications',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTabsModule],
  template: `
    <div class="notif-page">
      <header class="page-header">
        <h1>Recent <span>Notifications</span></h1>
        <p>Stay updated with your store and inventory activity</p>
      </header>

      <mat-tab-group dynamicHeight class="custom-tabs">
        
        <mat-tab label="All">
          <ng-template matTabContent>
            <div class="notif-list">
              @for (n of notifService.notifications(); track n.id) {
                <ng-container *ngTemplateOutlet="notifCard; context: { $implicit: n }"></ng-container>
              } @empty { <ng-container *ngTemplateOutlet="emptyState"></ng-container> }
            </div>
          </ng-template>
        </mat-tab>

        <mat-tab label="Orders">
          <ng-template matTabContent>
            <div class="notif-list">
              @for (n of orderNotifications(); track n.id) {
                <ng-container *ngTemplateOutlet="notifCard; context: { $implicit: n }"></ng-container>
              } @empty { <ng-container *ngTemplateOutlet="emptyState"></ng-container> }
            </div>
          </ng-template>
        </mat-tab>

        <mat-tab label="Stock Alerts">
          <ng-template matTabContent>
            <div class="notif-list">
              @for (n of stockNotifications(); track n.id) {
                <ng-container *ngTemplateOutlet="notifCard; context: { $implicit: n }"></ng-container>
              } @empty { <ng-container *ngTemplateOutlet="emptyState"></ng-container> }
            </div>
          </ng-template>
        </mat-tab>
      </mat-tab-group>

      <ng-template #notifCard let-n>
        <div class="notif-card" [class.unread]="!n.read" [class.stock-alert]="isStockAlert(n.message)">
          <div class="icon-box">
            <mat-icon>{{ isStockAlert(n.message) ? 'warning' : 'shopping_bag' }}</mat-icon>
          </div>
          <div class="content">
            <p class="message">{{ n.message }}</p>
            <span class="time">{{ n.createdAt | date:'medium' }}</span>
          </div>
          <div class="actions" *ngIf="!n.read">
            <button mat-flat-button class="mark-btn" (click)="onMarkRead(n.id)">
              Mark Read
            </button>
          </div>
        </div>
      </ng-template>

      <ng-template #emptyState>
        <div class="empty-state">
          <mat-icon>notifications_off</mat-icon>
          <p>No notifications found in this category.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .notif-page { color: white; padding: 20px; }
    .page-header { margin-bottom: 20px; h1 span { color: #6366f1; } }

    /* Custom Tabs Styling */
    ::ng-deep .custom-tabs .mat-mdc-tab-labels { margin-bottom: 20px; }
    ::ng-deep .custom-tabs .mdc-tab__text-label { color: #94a3b8 !important; }
    ::ng-deep .custom-tabs .mat-mdc-tab.mdc-tab--active .mdc-tab__text-label { color: #6366f1 !important; }
    ::ng-deep .custom-tabs .mat-mdc-tab-group-indicator { background-color: #6366f1 !important; }

    .notif-list { display: flex; flex-direction: column; gap: 12px; margin-top: 20px; }
    
    .notif-card { 
      background: #060b18; border: 1px solid #1e293b; padding: 16px; border-radius: 12px;
      display: flex; align-items: center; gap: 15px; transition: 0.2s;
      &.unread { border-left: 4px solid #db2777; background: rgba(219, 39, 119, 0.03); }
      &.stock-alert.unread { border-left-color: #f59e0b; background: rgba(245, 158, 11, 0.03); }
    }
    
    .icon-box mat-icon { color: #6366f1; font-size: 24px; width: 24px; height: 24px; }
    .stock-alert .icon-box mat-icon { color: #f59e0b; }
    
    .content { flex: 1; .message { margin: 0; font-size: 0.95rem; font-weight: 500; } .time { color: #64748b; font-size: 0.8rem; } }
    
    .mark-btn { background: #1e293b; color: #fff; font-size: 0.75rem; border-radius: 8px; }
    .empty-state { text-align: center; padding: 80px; color: #64748b; mat-icon { font-size: 50px; width: 50px; height: 50px; } }
  `]
})
export class SellerNotifications implements OnInit {
  public notifService = inject(NotificationService);

  // Computed signals for segregated views
  orderNotifications = computed(() => 
    this.notifService.notifications().filter(n => !this.isStockAlert(n.message))
  );

  stockNotifications = computed(() => 
    this.notifService.notifications().filter(n => this.isStockAlert(n.message))
  );

  ngOnInit() {
    this.notifService.getNotifications().subscribe();
  }

  isStockAlert(message: string): boolean {
    const msg = message.toLowerCase();
    return msg.includes('stock') || msg.includes('threshold') || msg.includes('quantity');
  }

  onMarkRead(id: number) {
    this.notifService.markAsRead(id).subscribe(() => {
      this.notifService.unreadCount.update(c => Math.max(0, c - 1));
    });
  }
}