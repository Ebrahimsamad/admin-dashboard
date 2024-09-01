import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../../../model/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private adminUrl = 'https://e-commerce-api-fawn.vercel.app/admin'; // API endpoint

  constructor(private http: HttpClient) {}

  // Handle headers and token retrieval
  private getHeaders(): HttpHeaders {
    let authToken = localStorage.getItem('token'); // Retrieve the token from local storage
    if (authToken && authToken.startsWith('Bearer ')) {
      authToken = authToken.substring(7); // Remove 'Bearer ' prefix
    }

    return new HttpHeaders({
      Authorization: `Bearer ${authToken}`, // Add the token to the Authorization header
      'Content-Type': 'application/json', // Specify content type
    });
  }

  // Fetch admin users
  getAdmin(): Observable<any> {
    return this.http.get<any>(this.adminUrl, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Admins fetched:', response)),
        catchError(this.handleError)
      );
  }

  // Create a new user
  createUser(admin: any): Observable<User> {
    return this.http.post<any>(this.adminUrl, admin, { headers: this.getHeaders() })
      .pipe(
        tap((data) => console.log('User created:', data)),
        catchError(this.handleError)
      );
  }

  // Update an existing user
  updateUser(id: string, admin: any): Observable<User> {
    const url = `${this.adminUrl}/${id}`;
    console.log("Admin _id = " + id);
    return this.http.patch<any>(url, admin, { headers: this.getHeaders() })
      .pipe(
        tap((data) => console.log('User updated:', data)),
        catchError(this.handleError)
      );
  }

  // Delete a user by ID
  deleteUser(id: string): Observable<any> {
    const url = `${this.adminUrl}/${id}`;
    return this.http.delete<any>(url, { headers: this.getHeaders() })
      .pipe(
        tap(() => console.log(`User with ID ${id} deleted`)),
        catchError(this.handleError)
      );
  }


  
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
  
    // Log the full error details
    console.error('Error details:', error);
  
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code
      errorMessage = `Server-side error: Status code ${error.status}, Message: ${error.message}`;
    }
  
    // Log the user-friendly error message
    console.error('Error message:', errorMessage);
  
    // Return an observable with a user-facing error message
    return throwError(() => new Error(errorMessage));
  }
  
}
