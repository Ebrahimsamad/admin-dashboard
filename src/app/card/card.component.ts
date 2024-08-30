import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { DiscountPipe } from '../pipe/discount.pipe';
import { DiscountBadgePipe } from '../pipe/discount-badge.pipe';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgClass, NgStyle, DiscountPipe,DiscountBadgePipe,NgIf],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  product: any;
  favorites: any[] = [
    {
      id: 2,
      title: "Z-bock",
      image: "https://ik.imagekit.io/7ksxy0uxk/e-commerce/jj.png?updatedAt=1724415623157",
      price: 9.99,
      discountPercentage: 7.17
    }
  ];

  constructor() {
    this.product = {
      id: 1,
      title: "Z-bock",
      image: "https://ik.imagekit.io/7ksxy0uxk/e-commerce/jj.png?updatedAt=1724415623157",
      price: 9.99,
      discountPercentage: 7.17
    };
  }

  isFavorite(): boolean {
    return this.favorites.some(fav => fav.id === this.product.id);
  }

  toggleFavorite(product: any): void {
    const index = this.favorites.findIndex(fav => fav.id === product.id);
    if (index !== -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(this.product);
    }
    // Handle back-end logic
  }

  getIconClass(): string {
    return this.isFavorite() ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
  }

  addToCart(product: any) {
    // Handle back-end logic
    console.log(product);
  }
}
