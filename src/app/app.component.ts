import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoginComponent,
    HttpClientModule,
    HeaderComponent,
    AdminListComponent,
    AdminPageComponent,
    CommonModule, // Ensure CommonModule is imported here
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app';
  isAuthenticated$: Observable<boolean>;

  constructor(public authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }
}
