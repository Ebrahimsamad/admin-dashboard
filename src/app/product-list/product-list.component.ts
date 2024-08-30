import { Component, OnInit } from '@angular/core';
// import { ProductService } from '../../../Services/Product/product.service'; // Assuming you have a service to manage products
import { Modal } from 'bootstrap';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
// import { Product } from '../../../model/Product';
import { catchError, of, tap } from 'rxjs';
import { Product } from '../model/Product';
import { ProductService } from '../services/Product/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = []; // Array of products

  defaultProduct: any = {
    title: 'Product Name',
    description: 'Description',
    categoryID: 123123,
    price: 199.99,
    discountPercentage: 10,
    stock: 50,
    brand: 'SoundMagic',
    dimensions: {
      width: 15,
      height: 20,
      depth: 5,
    },
    warrantyInformation: '2-year manufacturer warranty',
    availabilityStatus: 'available',
    returnPolicy: '30-day return policy with full refund',
    meta: {
      createdAt: '2024-01-15T08:00:00.000Z',
      updatedAt: '2024-08-01T08:00:00.000Z',
      barcode: '1234567890123',
    },
    images: [
      'https://example.com/images/wireless-headphones-front.jpg',
      'https://example.com/images/wireless-headphones-side.jpg',
    ],
    thumbnail: 'https://example.com/images/wireless-headphones-thumbnail.jpg',
  };

  newProduct: any; // Empty object to hold the new product

  selectedProduct: any = {
    title: 'Product Name',
    description: 'description',
    categoryID: 123123,
    price: 199.99,
    discountPercentage: 10,
    stock: 50,
    brand: 'SoundMagic',
    dimensions: {
      width: 15,
      height: 20,
      depth: 5,
    },
    warrantyInformation: '2-year manufacturer warranty',
    availabilityStatus: 'available',
    returnPolicy: '30-day return policy with full refund',
    meta: {
      createdAt: '2024-01-15T08:00:00.000Z',
      updatedAt: '2024-08-01T08:00:00.000Z',
      barcode: '1234567890123',
    },
    images: [
      'https://example.com/images/wireless-headphones-front.jpg',
      'https://example.com/images/wireless-headphones-side.jpg',
    ],
    thumbnail: 'https://example.com/images/wireless-headphones-thumbnail.jpg',
  };

  errorMessage: any;
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.newProduct = this.defaultProduct;
    this.loadProducts(); // Load products when the component initializes
  }

  openEditModal(product: Product) {
    this.selectedProduct = { ...product }; // Copy the selected product to avoid direct mutation
    const modalElement = document.getElementById('editProductModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  openCreateModal() {
    const modalElement = document.getElementById('createProductModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  createProduct(): void {
    this.productService
      .createProduct(this.newProduct)
      .pipe(
        tap((product) => {
          console.log('Product created:', product);
          this.products.push(product); // Add the newly created product to the list
          this.newProduct = this.defaultProduct; // Reset the new product object
          this.loadProducts();
        }),
        catchError((error) => {
          console.log(this.newProduct);
          console.error('Error creating product:', error);
          // Handle error accordingly
          return []; // Return an empty array or appropriate value to complete the observable
        })
      )
      .subscribe();

    // Close the modal (if using Bootstrap)
    const modalElement = document.getElementById('createProductModal') as any;
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProductById(id).subscribe({
        next: () => {
          // Remove the deleted product from the local list
          this.products = this.products.filter((product) => product._id !== id);
        },
        error: (err) => (this.errorMessage = err),
      });
    }
  }

  onEditSubmit(): void {
    if (!this.selectedProduct._id) {
      this.errorMessage =
        'Product ID is missing. Please select a valid product.';
      return;
    }
    // Create a new product object excluding _id and __v
    const { _id, __v, ...productData } = this.selectedProduct;
    // console.log('Submitting product:', JSON.stringify(productData, null, 2));
    this.productService
      .updateProductById(this.selectedProduct._id, productData)
      .pipe(
        tap(() => {
          this.closeModal();
          this.loadProducts();
        }),
        catchError((error) => {
          this.handleError(error);
          return of(null);
        })
      )
      .subscribe();
  }

  onCreateSubmit() {
    this.createProduct();
  }

  handleError(error: any) {
    throw new Error('Method not implemented.');
  }

  private closeModal(): void {
    const modalElement = document.getElementById('editProductModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  // Load products (can be done in ngOnInit or other lifecycle hooks)
  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        // Check if the products are fetched correctly
        console.log('Fetched products: ', products);

        // Assign products to the local variable
        this.products = products;

        // Log the first product after assignment
        if (this.products.length > 0) {
          console.log('First product: ', this.products[0]);
          this.selectedProduct = this.products[0];
        } else {
          console.log('No products available.');
        }
      },
      error: (error) => {
        console.error('Error fetching products: ', error);
      },
    });
  }
}
