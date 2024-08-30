import { Component, AfterViewInit } from '@angular/core';
import { ProductListComponent } from '../product-list/product-list.component';
import { AdminListComponent } from '../admin-list/admin-list.component';
import { CategoryListComponent } from '../category-list/category-list.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    ProductListComponent,
    AdminListComponent,
    CategoryListComponent,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
})
export class AdminPageComponent implements AfterViewInit {
  ngAfterViewInit() {
    setTimeout(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.classList.add('fade-in');
      }
    }, 0); // Delayed to ensure the animation applies after initial render
  }
}
