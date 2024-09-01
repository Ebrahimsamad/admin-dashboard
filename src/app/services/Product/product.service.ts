import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Product } from '../../../model/Product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'https://e-commerce-api-fawn.vercel.app/product'; // API endpoint

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    let authToken = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `${authToken}`,
      'Content-Type': 'application/json',
    });
  }

  // Fetch all products
  getProducts(): Observable<{ message: string; products: any[] }> {
    const getAllProductsURL = `https://e-commerce-api-fawn.vercel.app/search?product`;
    return this.http
      .get<{ message: string; products: any[] }>(getAllProductsURL, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((data) =>
          console.log(
            'Products fetched:',
            JSON.stringify(data.products, null, 2)
          )
        ),
        catchError(this.handleError)
      );
  }

  // Fetch a single product by ID
  getProductById(id: string): Observable<Product> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(url, { headers: this.getAuthHeaders() }).pipe(
      tap((data) => console.log('Product fetched:', data)),
      catchError(this.handleError)
    );
  }

  // Create a new product
  createProduct(data: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token || '', // Use the token directly from localStorage
    });
    return this.http.post(this.productsUrl, data, { headers });
  }

  // Update a product by ID
  updateProductById(id: string, formData: FormData): Observable<Product> {
    const url = `${this.productsUrl}/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token || '', // Use the token directly from localStorage
    });
    return this.http.patch<Product>(url, formData, { headers });
  }

  // Delete a product by ID
  deleteProductById(id: string): Observable<{}> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.delete(url, { headers: this.getAuthHeaders() }).pipe(
      tap(() => console.log('Product deleted')),
      catchError(this.handleError)
    );
  }

  // Error handling method
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Server returned code: ${
        error.status
      }, error message is: ${error.message}, response body: ${JSON.stringify(
        error.error
      )}`;
    }
    console.error(errorMessage); // Log the error message
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
