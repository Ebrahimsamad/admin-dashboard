import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Category } from '../../model/Category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoriesUrl = 'http://localhost:3000/category'; // API endpoint

  constructor(private http: HttpClient) {}

  // Fetch all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl).pipe(
      tap((data) => console.log('Categories fetched:', data)),
      catchError(this.handleError)
    );
  }

  // Fetch a single category by ID
  getCategoryById(id: string): Observable<Category> {
    const url = `${this.categoriesUrl}/${id}`;
    return this.http.get<Category>(url).pipe(
      tap((data) => console.log('Category fetched:', data)),
      catchError(this.handleError)
    );
  }

  // Create a new category
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.categoriesUrl, category).pipe(
      tap((data) => console.log('Category created:', data)),
      catchError(this.handleError)
    );
  }

  // Update a category by ID
  updateCategoryById(id: string, category: Category): Observable<Category> {
    const url = `${this.categoriesUrl}/${id}`;
    return this.http.put<Category>(url, category).pipe(
      tap((data) => console.log('Category updated:', data)),
      catchError(this.handleError)
    );
  }

  // Delete a category by ID
  deleteCategoryById(id: string): Observable<{}> {
    const url = `${this.categoriesUrl}/${id}`;
    return this.http.delete(url).pipe(
      tap((data) => console.log('Category deleted:', data)),
      catchError(this.handleError)
    );
  }

  // Error handling method
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log('Handle Error');
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
