import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discount',
  standalone: true
})
export class DiscountPipe implements PipeTransform {

  transform(price: number, discountPercentage?: number): string {
    if (!discountPercentage || discountPercentage <= 0) {
      return `$${price.toFixed(2)}`;
    }
    const discountedPrice = price - (price * discountPercentage / 100);
    return `$${price.toFixed(2)} $${discountedPrice.toFixed(2)}`;
  }

}
