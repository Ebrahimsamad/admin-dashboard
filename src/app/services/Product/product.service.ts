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

  getProductById(id: string): Observable<Product> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<Product>(url, { headers: this.getAuthHeaders() }).pipe(
      tap((data) => console.log('Product fetched:', data)),
      catchError(this.handleError)
    );
  }

  createProduct(data: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token || '',
    });
    return this.http.post(this.productsUrl, data, { headers });
  }

  updateProductById(id: string, formData: FormData): Observable<Product> {
    const url = `${this.productsUrl}/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token || '',
    });
    return this.http.patch<Product>(url, formData, { headers });
  }

  deleteProductById(id: string): Observable<{}> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.delete(url, { headers: this.getAuthHeaders() }).pipe(
      tap(() => console.log('Product deleted')),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${
        error.status
      }, error message is: ${error.message}, response body: ${JSON.stringify(
        error.error
      )}`;
    }
    console.error(errorMessage);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
