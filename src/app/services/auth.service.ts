import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://e-commerce-api-fawn.vercel.app';
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        // Check if the user is an admin before proceeding
        if (response.user.role === 'admin') {
          this.handleAuthentication(response.token, response.user);
        } else {
          console.log('You do not have permission to access this application.');
          throw new Error(
            'You do not have permission to access this application.'
          );
          this.isAuthenticated.next(false);
          this.router.navigate(['/login']);
        }
      }),
      catchError(this.handleError)
    );
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  private handleAuthentication(token: string, user: object): void {
    localStorage.setItem('token', 'Bearer ' + token);
    localStorage.setItem('user', JSON.stringify(user));
    this.isAuthenticated.next(true);
    this.router.navigate(['/']);
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('token');
    this.isAuthenticated.next(!!token);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = this.getServerErrorMessage(error);
    }
    return throwError(() => new Error(errorMessage));
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 409:
        return 'The email address you have entered already exists.';
      case 404:
        return 'This email does not exist in our records.';
      case 400:
        return 'Bad request. Please check the data you have entered.';
      case 401:
        return 'Unauthorized. Please check your credentials.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return `Error: ${error.message}`;
    }
  }
}
