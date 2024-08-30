import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discountBadge',
  standalone: true
})
export class DiscountBadgePipe implements PipeTransform {

  transform(price: number, discountPercentage: number | undefined): string {
    if (!discountPercentage || discountPercentage <= 0) {
      return '';
    }
    return `-${discountPercentage.toFixed(0)}%`;
  }

}
