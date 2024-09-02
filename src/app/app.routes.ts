import { Routes } from '@angular/router';
import { AdminListComponent } from './admin-list/admin-list.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard';
import { AdminPageComponent } from './admin-page/admin-page.component';

// prettier-ignore
const routes: Routes = [
  { path: '', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminListComponent, canActivate: [AuthGuard] },
  { path: 'product',component: ProductListComponent,canActivate: [AuthGuard],},
  { path: 'category',component: CategoryListComponent,canActivate: [AuthGuard],},
  { path: '**', redirectTo: '' }, 
];

export { routes };
