import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import { FormControl, FormGroup, Validators ,FormBuilder} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, of, tap } from 'rxjs';
import { Product } from '../../model/Product';
import { ProductService } from '../services/Product/product.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, CommonModule , ReactiveFormsModule],
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
      name: 'Default Category'
    },
    price: 0,
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
      barcode: 'DefaultBarcode'
    },
    __v: 0
  };
  

  products: Product[] = [];
  newProduct: Product = this.defaultProduct;
  selectedProduct: Product = this.defaultProduct;
  errorMessage: string = '';
  productForm!: FormGroup;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.initializeForm();
  }


  initializeForm(): void {
    this.productForm = new FormGroup({
      title: new FormControl('Default Title'),
      description: new FormControl('Default Description'),
      price: new FormControl(10),
      discountPercentage: new FormControl(0),
      categoryName: new FormControl('asd'),
      stock: new FormControl(0),
  
      // meta as a FormGroup containing barcode
      meta: new FormGroup({
        barcode: new FormControl('123eqw')
      }),
  
      brand: new FormControl('Default Brand'),
      dimensions: new FormControl('Default Dimensions'),
      warrantyInformation: new FormControl('Default Warranty Information'),
  
      // images as an array of file objects
      images: new FormControl([]),
  
      // image as a file object
      image: new FormControl(null),
    });
  }
  
  onFilesChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      const fileArray = files.map(file => ({
        fileData: file,
        type: file.type
      }));
      this.productForm.get(controlName)?.setValue(fileArray);
    }
  }
  
  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.productForm.get(controlName)?.setValue({
        fileData: file,
        type: file.type
      });
    }
  }

  


Add(): void {
  if (this.productForm.valid) {
    this.productService.createProduct(this.productForm.value).subscribe({
      next: () => {
        console.log("Product created successfully");
      },
      error: (err) => {
        console.error("Error creating product:", err);
        console.error("MMMM",err.error.message);
        
      }
    });
  } else {
    console.error("Form is invalid");
  }
}




  openEditModal(product: any) {
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
      this.errorMessage = 'Product ID is missing. Please select a valid product.';
      return;
    }

    const formData = new FormData();
    Object.keys(this.productForm.value).forEach(key => {
      formData.append(key, this.productForm.get(key)?.value);
    });

    this.productService.updateProductById(this.selectedProduct._id, formData).pipe(
      tap(() => {
        console.log('Product updated');
        this.closeModal('editProductModal');
        this.loadProducts();
      }),
      catchError((error) => {
        console.error('Error updating product:', error);
        this.errorMessage = 'Failed to update product. Please try again later.';
        return of(null);
      })
    ).subscribe();
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
          this.products = this.products.filter(product => product._id !== id);
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          this.errorMessage = 'Failed to delete product. Please try again later.';
        }
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
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.products;
        console.log('Fetched products:', response.products); // أضف هذا السطر
        this.products = response.products;
        if (this.products.length > 0) {
          this.selectedProduct = this.products[0];
        }
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.errorMessage = 'Failed to load products. Please try again later.';
      }
    });
  }
}
