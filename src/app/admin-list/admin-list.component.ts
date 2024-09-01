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
  errorMessage: string | undefined;

  defaultUser: User = {
    _id:"",
    name: 'new',
    email: 'new@example.com',
    password: 'SecurePassword123!',
    confirmPassword: 'SecurePassword123!',
  };

  newUser: User = {
    _id:"",
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  selectedUser: User = {
    name: '',
    email: 'Fatma@example.com',
    password: '',
    role:'',
    _id: ""
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.userService.getAdmin().subscribe({
      next: (response) => {
        this.users = response.admins;
        console.log('Admins loaded:', this.users);
      },
      error: (err) => {
        this.errorMessage = 'Failed to load admins';
        console.error('Error loading admins:', err);
      },
    });
  }

  openCreateModal(): void {
    this.resetNewUserForm();
    this.showModal('createUserModal');
  }

  openEditModal(user: User): void {
    this.selectedUser = {
      name: user.name || '', // Assuming `name` might be in the original object
      email: user.email || '',
      role: user.role || '',
      password: user.password || '',
      _id: user._id || ''
    };
    console.log("this.selectedUser: ", JSON.stringify(this.selectedUser, null, 2));
    console.log("sent User: ", JSON.stringify(user, null, 2));
    this.showModal('editUserModal');
  }
  

  createAdmin(): void {
    if (this.validateNewUser(this.newUser)) {
      // Exclude the _id field from the newUser object
      const { _id, ...createdAdmin } = this.newUser;
  
      console.log('Creating user:', JSON.stringify(createdAdmin, null, 2));
      this.userService
        .createUser(createdAdmin)
        .pipe(
          tap((user: any) => {
            console.log('User created:', user);
            this.users.push(user);
            this.loadAdmins();
            this.newUser = { ...this.defaultUser };
          }),
          catchError((error) => {
            console.error('Error creating user:', error);
            this.errorMessage = 'Failed to create user';
            return of([]);
          })
        )
        .subscribe();
  
      this.closeModal('createUserModal');
    } else {
      console.error('User validation failed');
    }
  }

  
  updateAdmin(): void {  
    // Construct the userToUpdate object with specific properties
    const userToUpdate = {
      name: this.selectedUser.name,
      email: this.selectedUser.email,
      role: this.selectedUser.role,
      password: this.selectedUser.password
    };
  
    console.log('Updating user:', JSON.stringify(userToUpdate, null, 2));
  
    this.userService
      .updateUser(this.selectedUser._id, userToUpdate)
      .pipe(
        tap((updatedUser: any) => {
          console.log('User updated:', updatedUser);
          // Update the user in the current list
          this.users = this.users.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
          );
          // Reload the admin users after the update
          this.loadAdmins();
        }),
        catchError((error) => {
          console.log('Error updating user:', error);
          this.errorMessage = 'Failed to update user';
          return of([]);
        })
      )
      .subscribe();
  
    this.closeModal('editUserModal');
  }
  
  
  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService
        .deleteUser(userId)
        .pipe(
          tap(() => {
            this.users = this.users.filter((user) => user._id !== userId);
            console.log('User deleted:', userId);
            this.loadAdmins();
          }),
          catchError((error) => {
            console.error('Error deleting user:', error);
            this.errorMessage = 'Failed to delete user';
            return of([]);
          })
        )
        .subscribe();
    }
  }

  onCreateSubmit(): void {
    this.createAdmin();
  }

  onEditSubmit(): void {

    this.updateAdmin();
  }

  private validateNewUser(user: User): boolean {
    if (!user.name || !user.email || !user.password || !user.confirmPassword) {
      this.errorMessage = 'All fields are required';
      return false;
    }
    if (user.password !== user.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }
    // Add additional validation logic if necessary
    return true;
  }

  private resetNewUserForm(): void {
    this.newUser = { ...this.defaultUser };
  }

  private showModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  private closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
}
