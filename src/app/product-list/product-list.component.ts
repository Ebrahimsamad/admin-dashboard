import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../model/Product';
import { ProductService } from '../services/Product/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  defaultProduct: Product = {
    _id: '',
    title: 'Default Product Title',
    description: 'Default product description goes here.',
    categoryID: {
      _id: '',
      name: 'Default Category',
    },
    price: 100,
    discountPercentage: 0,
    stock: 0,
    brand: 'Default Brand',
    dimensions: 'Default Dimensions',
    warrantyInformation: 'Default Warranty Information',
    images: [],
    image: '',
    rating: 0,
    reviews: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    meta: {
      barcode: 'DefaultBarcode',
    },
    __v: 0,
  };

  products: Product[] = [];
  newProduct: Product = this.defaultProduct;
  selectedProduct: Product = this.defaultProduct;
  errorMessage: string = '';
  productForm!: FormGroup;
  files: File[] = [];
  thumbnail: File | null = null;

  isLoading = true;
  skeletonItems = Array(6).fill(null); // 6 skeleton items

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.initializeForm();
  }

  initializeForm(): void {
    this.productForm = new FormGroup({
      title: new FormControl(this.defaultProduct.title, Validators.required),
      description: new FormControl(
        this.defaultProduct.description,
        Validators.required
      ),
      price: new FormControl(this.defaultProduct.price, [
        Validators.required,
        Validators.min(0),
      ]),
      discountPercentage: new FormControl(
        this.defaultProduct.discountPercentage,
        [Validators.required, Validators.min(0), Validators.max(100)]
      ),
      categoryName: new FormControl(
        this.defaultProduct.categoryID.name,
        Validators.required
      ),
      stock: new FormControl(this.defaultProduct.stock, [
        Validators.required,
        Validators.min(0),
      ]),
      brand: new FormControl(this.defaultProduct.brand, Validators.required),
      dimensions: new FormControl(this.defaultProduct.dimensions),
      warrantyInformation: new FormControl(
        this.defaultProduct.warrantyInformation
      ),
    });
  }

  onFilesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.files = Array.from(input.files);
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.thumbnail = input.files[0];
    }
  }

  Add(): void {
    if (this.productForm.valid) {
      const formData = new FormData();

      formData.append('title', this.productForm.get('title')?.value);
      formData.append(
        'description',
        this.productForm.get('description')?.value
      );
      formData.append('price', this.productForm.get('price')?.value);
      formData.append(
        'discountPercentage',
        this.productForm.get('discountPercentage')?.value
      );
      formData.append(
        'categoryName',
        this.productForm.get('categoryName')?.value
      );
      formData.append('stock', this.productForm.get('stock')?.value);
      formData.append('brand', this.productForm.get('brand')?.value);
      formData.append('dimensions', this.productForm.get('dimensions')?.value);
      formData.append(
        'warrantyInformation',
        this.productForm.get('warrantyInformation')?.value
      );

      // Handle the "images" field
      if (this.files.length > 0) {
        this.files.forEach((image) => {
          formData.append('images', image);
        });
      } else {
        console.error('At least one image is required');
        return;
      }

      if (this.thumbnail) {
        formData.append('image', this.thumbnail);
      } else {
        console.error('Primary image is required');
        return;
      }

      this.productService.createProduct(formData).subscribe({
        next: () => {
          console.log('Product created successfully');
          this.loadProducts(); // Refresh the product list
        },
        error: (err) => {
          console.error('Error creating product:', err);
          if (err.error) {
            console.error('Error response:', err.error);
          }
        },
      });
    } else {
      console.error('Form is invalid');
    }
  }

  openEditModal(product: Product) {
    this.selectedProduct = { ...product };
    this.productForm.patchValue(this.selectedProduct);
    const modalElement = document.getElementById('editProductModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  updateProduct(): void {
    if (!this.selectedProduct._id) {
      this.errorMessage =
        'Product ID is missing. Please select a valid product.';
      return;
    }

    const formData = new FormData();
    Object.keys(this.productForm.controls).forEach((key) => {
      const control = this.productForm.get(key);

      if (control?.value !== null && control?.value !== undefined) {
        if (key === 'images') {
          const files: File[] = control.value;
          if (files && files.length) {
            // Use `append` to handle multiple files, not `set`
            files.forEach((file: File) => {
              formData.append('images', file);
            });
          }
        } else if (key === 'image') {
          // If you have a single image upload field, handle it separately
          const file: File = control.value;
          if (file) {
            formData.append('image', file);
          }
        } else {
          formData.append(key, control.value);
        }
      }
    });

    this.productService
      .updateProductById(this.selectedProduct._id, formData)
      .subscribe({
        next: () => {
          console.log('Product updated successfully');
          this.closeModal('editProductModal');
          this.loadProducts(); // Refresh the product list
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.errorMessage =
            'Failed to update product. Please try again later.';
        },
      });
  }

  openCreateModal() {
    const modalElement = document.getElementById('createProductModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  deleteProduct(id: string | undefined): void {
    if (!id) {
      console.error('Product ID is not defined');
      return;
    }

    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProductById(id).subscribe({
        next: () => {
          this.products = this.products.filter((product) => product._id !== id);
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          this.errorMessage =
            'Failed to delete product. Please try again later.';
        },
      });
    }
  }

  private closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  loadProducts(): void {
    this.isLoading = true; // Set loading to true before fetching data
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.products;
        console.log('Fetched products:', response.products);
        this.isLoading = false; // Set loading to false once data is fetched
        if (this.products.length > 0) {
          this.selectedProduct = this.products[0];
        }
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.isLoading = false; // Set loading to false in case of error
        this.errorMessage = 'Failed to load products. Please try again later.';
      },
    });
  }
}
