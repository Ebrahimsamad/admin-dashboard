// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AuthService } from './auth.service';
// import { map } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(): Observable<boolean> | boolean {
//     return this.authService.isAuthenticated$.pipe(
//       map((isAuthenticated) => {
//         console.log('AuthGuard - isAuthenticated:', isAuthenticated);
//         if (!isAuthenticated) {
//           this.router.navigate(['/login']);
//           return false;
//         }
//         return true;
//       })
//     );
//   }
// }
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
