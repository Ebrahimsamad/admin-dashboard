import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasty: any;

  constructor() {
    // Check if Toasty is available
    if (typeof (window as any).Toasty === 'function') {
      // Initialize Toasty with custom options
      this.toasty = new (window as any).Toasty({
        position: 'top-right', // Position of the toast: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
        duration: 5000, // Duration in milliseconds (5000ms = 5 seconds)
      });
    } else {
      console.error('Toasty is not available');
    }
  }

  showToast(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    if (this.toasty) {
      this.toasty[type](message); // Show toast message based on type
    } else {
      console.error('Toasty instance is not available');
    }
  }
}
