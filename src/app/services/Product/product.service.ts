import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Product } from '../../model/Product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'https://e-commerce-api-fawn.vercel.app/product'; // API endpoint

  constructor(private http: HttpClient) {}

  // Fetch all products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      tap((data) => console.log('Products fetched:', data)),
      catchError(this.handleError)
    );
  }

  // Fetch a single product by ID
  getProductById(id: string): Observable<Product> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(url).pipe(
      tap((data) => console.log('Product fetched:', data)),
      catchError(this.handleError)
    );
  }

  // Create a new product
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.productsUrl, product).pipe(
      tap((data) => console.log('Product created:', data)),
      catchError(this.handleError)
    );
  }

  // Update a product by ID
  updateProductById(id: string, product: Product): Observable<Product> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.put<Product>(url, product).pipe(
      tap((data) => console.log('Product updated:', data)),
      catchError(this.handleError)
    );
  }

  // Delete a product by ID
  deleteProductById(id: string): Observable<{}> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.delete(url).pipe(
      tap((data) => console.log('Product deleted:', data)),
      catchError(this.handleError)
    );
  }

  // Error handling method
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log('Handel Error');
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage); // Log the error message
    return throwError('Something went wrong; please try again later.');
  }
}
