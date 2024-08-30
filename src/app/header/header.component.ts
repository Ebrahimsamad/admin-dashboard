// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../services/auth.service';
// import { Router, RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-header',
//   templateUrl: './header.component.html',
//   styleUrls: ['./header.component.css'],
//   standalone: true,
//   imports: [CommonModule, RouterModule],
// })
// export class HeaderComponent implements OnInit {
//   isLoggingOut = false;
//   isAuthenticated = false;

//   constructor(private authService: AuthService, private router: Router) {}

//   ngOnInit() {
//     this.authService.isAuthenticated$.subscribe((isAuth) => {
//       this.isAuthenticated = isAuth;
//     });
//   }

//   // onLogout() {
//   //   this.isLoggingOut = true;

//   //   setTimeout(() => {
//   //     this.authService.logout();
//   //     this.router.navigate(['/login']);
//   //     this.isLoggingOut = false;
//   //   }, 1000);
//   // }

//   onLogout() {
//     this.isLoggingOut = true;

//     this.authService.logout();
//     this.isAuthenticated = false; // Update the local state immediately

//     // Navigate to the login page after a short delay
//     setTimeout(() => {
//       this.router.navigate(['/login']);
//       this.isLoggingOut = false;
//     }, 1000);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HeaderComponent implements OnInit {
  isLoggingOut = false;
  isAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });
  }

  onLogout() {
    this.isLoggingOut = true;

    setTimeout(() => {
      this.authService.logout();
      this.isLoggingOut = false;
    }, 1000);
  }
}
