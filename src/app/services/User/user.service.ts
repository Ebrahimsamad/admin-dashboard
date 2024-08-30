import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../../model/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersUrl = 'http://localhost:3000/users'; // API endpoint

  constructor(private http: HttpClient) {}

  // Fetch all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl).pipe(
      tap((data) => console.log('Users fetched:', data)),
      catchError(this.handleError)
    );
  }

  // Fetch a user by ID
  getUserById(id: string): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<User>(url).pipe(
      tap((data) => console.log('User fetched:', data)),
      catchError(this.handleError)
    );
  }

  // Create a new user
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user).pipe(
      tap((data) => console.log('User created:', data)),
      catchError(this.handleError)
    );
  }

  // Update a user by ID
  updateUserById(id: string, user: Partial<User>): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.put<User>(url, user).pipe(
      tap((data) => console.log('User updated:', data)),
      catchError(this.handleError)
    );
  }

  // Delete a user by ID
  deleteUserById(id: string): Observable<{}> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete(url).pipe(
      tap((data) => console.log('User deleted:', data)),
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
