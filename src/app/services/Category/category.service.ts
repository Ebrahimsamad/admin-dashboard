import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Category } from '../../../model/Category';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoriesUrl = 'https://e-commerce-api-fawn.vercel.app/category';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `${authToken}`,
      'Content-Type': 'application/json',
    });
  }

  getCategories(): Observable<{ categories: Category[]; message: string }> {
    return this.http
      .get<{ categories: Category[]; message: string }>(this.categoriesUrl, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((response) => console.log('Categories response:', response)),
        catchError(this.handleError)
      );
  }

  getCategoryById(id: string): Observable<Category> {
    const url = `${this.categoriesUrl}/${id}`;
    return this.http
      .get<Category>(url, { headers: this.getAuthHeaders() })
      .pipe(
        tap((data) => console.log('Category fetched:', data)),
        catchError(this.handleError)
      );
  }

  createCategory(category: any): Observable<Category> {
    return this.http
      .post<Category>(this.categoriesUrl, category, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((data) => console.log('Category created:', data)),
        catchError(this.handleError)
      );
  }

  updateCategoryById(id: string, category: any): Observable<any> {
    console.log('Category:', JSON.stringify(category, null, 2));
    const url = `${this.categoriesUrl}/${id}`;
    return this.http
      .patch<any>(url, category, { headers: this.getAuthHeaders() })
      .pipe(
        tap((data) => console.log('Category updated:', data)),
        catchError(this.handleError)
      );
  }

  deleteCategoryById(id: string): Observable<void> {
    const url = `${this.categoriesUrl}/${id}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() }).pipe(
      tap(() => console.log('Category deleted on the server')),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;

      try {
        const errorBody = JSON.stringify(error.error, null, 2);
        console.error(
          `Error details: Status code ${error.status}, Body: ${errorBody}`
        );
      } catch (jsonError) {
        console.error('Failed to parse error body as JSON', jsonError);
        console.error(`Raw error body: ${error.error}`);
      }
    }

    console.error(errorMessage);

    return throwError(
      () => new Error('Something went wrong. Please try again later.')
    );
  }
}
