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
  deleteUser(user: any) {}
  openEditModal(user: any) {}
  ngOnInit(): void {
    this.userService.gitAdmin().subscribe({
      next: (response) => {
        this.users = response.admins;
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openCreateModal() {
    const modalElement = document.getElementById('createUserModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  createAdmin(): void {
    console.log('new user: ' + JSON.stringify(this.newUser, null, 2));
    this.userService
      .createUser(this.newUser)
      .pipe(
        tap((user: any) => {
          console.log('User created:', user);
          this.users.push(user);
          this.newUser = { ...this.defaultUser };
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

  onCreateSubmit() {
    this.createAdmin();
  }
}
