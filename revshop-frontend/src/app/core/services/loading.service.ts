import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  // Signal to track if a page transition is happening
  loading = signal(false);

  setLoading(value: boolean) {
    this.loading.set(value);
  }
}