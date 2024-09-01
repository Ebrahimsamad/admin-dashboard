import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../../../model/User';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private adminUrl = 'https://e-commerce-api-fawn.vercel.app/admin'; // API endpoint

  constructor(private http: HttpClient) {}

  // Create a new user
  gitAdmin(): Observable<any> {
    let authToken = localStorage.getItem('token'); 
    return this.http.get<any>(this.adminUrl,{headers:new HttpHeaders({
      Authorization: `${authToken}`,
      'Content-Type': 'application/json',
    })});
  }
  createUser(admin: User): Observable<User> {
    let authToken = localStorage.getItem('token'); // Retrieve the token from local storage
    console.log('Auth Token = ' + authToken);

    if (authToken) {
      authToken = authToken.split(' ')[1]; // Split by space and get the token part
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`, // Add the token to the Authorization header
      'Content-Type': 'application/json', // Optionally, specify the content type
    });

    console.log('Admin Object = ' + JSON.stringify(admin, null, 2));

    return this.http.post<User>(this.adminUrl, admin, { headers }).pipe(
      tap((data) => console.log('User created:', data)),
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

// Admin Object = {
//   "name": "Test Fatma",
//   "email": "testfatma@admin.com",
//   "password": "testFatma!123123",
//   "confirmPassword": "testFatma!123123"
// }
