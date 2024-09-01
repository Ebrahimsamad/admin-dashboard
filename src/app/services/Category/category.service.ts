import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Category } from '../../../model/Category';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoriesUrl = 'https://e-commerce-api-fawn.vercel.app/category'; // Updated API endpoint

  constructor(private http: HttpClient) {}

  // Fetch all categories
  private getAuthHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `${authToken}`,
      'Content-Type': 'application/json'
    });
  }

  // Fetch all categories
  getCategories(): Observable<{ categories: Category[], message: string }> {
    return this.http.get<{ categories: Category[], message: string }>(this.categoriesUrl, { headers: this.getAuthHeaders() }).pipe(
      tap((response) => console.log('Categories response:', response)),
      catchError(this.handleError)
    );
  }

  // Fetch a single category by ID
  getCategoryById(id: string): Observable<Category> {
    const url = `${this.categoriesUrl}/${id}`;
    return this.http.get<Category>(url, { headers: this.getAuthHeaders() }).pipe(
      tap((data) => console.log('Category fetched:', data)),
      catchError(this.handleError)
    );
  }

  // Create a new category
  createCategory(category: any): Observable<Category> {
    return this.http.post<Category>(this.categoriesUrl, category, { headers: this.getAuthHeaders() }).pipe(
      tap((data) => console.log('Category created:', data)),
      catchError(this.handleError)
    );
  }

  // Update a category by ID
  updateCategoryById(id: string, category: any): Observable<any> {
    console.log("Category:", JSON.stringify(category, null, 2));
    const url = `${this.categoriesUrl}/${id}`;
    return this.http.patch<any>(url, category, { headers: this.getAuthHeaders() }).pipe(
      tap((data) => console.log('Category updated:', data)),
      catchError(this.handleError)
    );
  }

  // Delete a category by ID
  deleteCategoryById(id: string): Observable<void> {
    const url = `${this.categoriesUrl}/${id}`;
    return this.http.delete<void>(url, { headers: this.getAuthHeaders() }).pipe(
      tap(() => console.log('Category deleted')),
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;
  
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
  
      // Log the error body as JSON
      try {
        const errorBody = JSON.stringify(error.error, null, 2);
        console.error(`Error details: Status code ${error.status}, Body: ${errorBody}`);
      } catch (jsonError) {
        console.error('Failed to parse error body as JSON', jsonError);
        console.error(`Raw error body: ${error.error}`);
      }
    }
  
    // Log the generic error message
    console.error(errorMessage);
  
    // Return a user-facing error message
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
  
  
  
}
