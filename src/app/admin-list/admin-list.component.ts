// import { Component, OnInit } from '@angular/core';
// import { Modal } from 'bootstrap';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { catchError, of, tap } from 'rxjs';
// import { User } from '../../model/User';
// import { UserService } from '../services/User/user.service';
// import {
//   trigger,
//   state,
//   style,
//   transition,
//   animate,
// } from '@angular/animations';

// @Component({
//   selector: 'app-user-list',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './admin-list.component.html',
//   styleUrls: ['./admin-list.component.css'],
//   animations: [
//     trigger('modalAnimation', [
//       state('void', style({ opacity: 0 })),
//       transition(':enter', [animate('0.3s ease-in', style({ opacity: 1 }))]),
//       transition(':leave', [animate('0.3s ease-out', style({ opacity: 0 }))]),
//     ]),
//   ],
// })
// export class AdminListComponent implements OnInit {
//   users: User[] = [];
//   defaultUser: any = {
//     name: 'new',
//     email: 'new@example.com',
//     password: 'SecurePassword123!',
//     confirmPassword: 'SecurePassword123!',
//   };
//   newUser: any = {
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ' ',
//   };
//   selectedUser: any = {
//     name: ' ',
//     email: 'Fatma@example.com',
//     password: ' ',
//     confirmPassword: ' ',
//   };
//   errorMessage: string | undefined;

//   constructor(private userService: UserService) {}

//   ngOnInit(): void {
//     this.loadAdmin();
//   }

//   openEditModal(user: User) {
//     this.selectedUser = { ...user };
//     const modalElement = document.getElementById('editUserModal');
//     if (modalElement) {
//       const modal = new Modal(modalElement);
//       modal.show();
//     }
//   }

//   openCreateModal() {
//     const modalElement = document.getElementById('createUserModal');
//     if (modalElement) {
//       const modal = new Modal(modalElement);
//       modal.show();
//     }
//   }

//   createUser(): void {
//     console.log('new user: ' + JSON.stringify(this.newUser, null, 2));
//     this.userService
//       .createUser(this.newUser)
//       .pipe(
//         tap((user: any) => {
//           console.log('User created:', user);
//           this.users.push(user);
//           this.newUser = this.defaultUser;
//           this.loadAdmin();
//         }),
//         catchError((error) => {
//           console.error('Error creating user:', error);
//           return of([]);
//         })
//       )
//       .subscribe();

//     const modalElement = document.getElementById('createUserModal') as any;
//     if (modalElement) {
//       const modal = Modal.getInstance(modalElement);
//       if (modal) {
//         modal.hide();
//       }
//     }
//   }

//   deleteUser(id: string): void {
//     if (confirm('Are you sure you want to delete this user?')) {
//       this.userService.deleteUserById(id).subscribe({
//         next: () => {
//           this.users = this.users.filter((user) => user._id !== id);
//         },
//         error: (err: any) => (this.errorMessage = err),
//       });
//     }
//   }

//   onEditSubmit(): void {
//     if (!this.selectedUser._id) {
//       this.errorMessage = 'User ID is missing. Please select a valid user.';
//       return;
//     }
//     const { _id, __v, image, ...userData } = this.selectedUser;
//     this.userService
//       .updateUserById(this.selectedUser._id!, userData)
//       .pipe(
//         tap(() => {
//           this.closeModal();
//           this.loadAdmin();
//         }),
//         catchError((error) => {
//           console.error('Error updating user:', error);
//           return of(null);
//         })
//       )
//       .subscribe();
//   }

//   onCreateSubmit() {
//     this.createUser();
//   }

//   private closeModal(): void {
//     const modalElement = document.getElementById('editUserModal');
//     if (modalElement) {
//       const modal = Modal.getInstance(modalElement);
//       if (modal) {
//         modal.hide();
//       }
//     }
//   }

//   loadAdmin(): void {
//     this.userService.getUsers().subscribe({
//       next: (users: User[]) => {
//         this.users = users.filter((user) => user.role === 'admin');
//       },
//       error: (error: any) => {
//         console.error('Error fetching users:', error);
//       },
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, of, tap } from 'rxjs';
import { User } from '../../model/User';
import { UserService } from '../services/User/user.service';

@Component({
  selector: 'app-admin-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css'],
})
export class AdminListComponent implements OnInit {
  users: User[] = [];

  defaultUser: any = {
    name: 'new',
    email: 'new@example.com',
    password: 'SecurePassword123!',
    confirmPassword: 'SecurePassword123!',
  };
  newUser: any = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ' ',
  };
  selectedUser: any = {
    name: ' ',
    email: 'Fatma@example.com',
    password: ' ',
    confirmPassword: ' ',
  };
  errorMessage: string | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadAdmin();
  }

  openEditModal(user: User) {
    this.selectedUser = { ...user };
    const modalElement = document.getElementById('editUserModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  openCreateModal() {
    const modalElement = document.getElementById('createUserModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  createUser(): void {
    console.log('new user: ' + JSON.stringify(this.newUser, null, 2));
    this.userService
      .createUser(this.newUser)
      .pipe(
        tap((user: any) => {
          console.log('User created:', user);
          this.users.push(user);
          this.newUser = this.defaultUser;
          this.loadAdmin();
        }),
        catchError((error) => {
          console.error('Error creating user:', error);
          return of([]);
        })
      )
      .subscribe();

    const modalElement = document.getElementById('createUserModal') as any;
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUserById(id).subscribe({
        next: () => {
          this.users = this.users.filter((user) => user._id !== id);
        },
        error: (err: any) => (this.errorMessage = err),
      });
    }
  }

  onEditSubmit(): void {
    if (!this.selectedUser._id) {
      this.errorMessage =
        'category ID is missing. Please select a valid category.';
      return;
    }
    const { _id, __v, image, ...userData } = this.selectedUser;
    this.userService
      .updateUserById(this.selectedUser._id!, userData)
      .pipe(
        tap(() => {
          this.closeModal();
          this.loadAdmin();
        }),
        catchError((error) => {
          console.error('Error updating user:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  onCreateSubmit() {
    this.createUser();
  }

  private closeModal(): void {
    const modalElement = document.getElementById('editUserModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  loadAdmin(): void {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users.filter((user) => user.role === 'admin');
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
      },
    });
  }
}
