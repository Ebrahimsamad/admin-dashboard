import { Component, OnInit } from '@angular/core';
import { Modal, Toast } from 'bootstrap';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { catchError, of, tap } from 'rxjs';
import { Category } from '../../model/Category';
import { CategoryService } from '../services/Category/category.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'], // Updated to styleUrls
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = []; // Array of categories

  defaultCategory: Category = {
    _id: '',
    name: '',
    __v: 0,
  };
  newCategory: Category = { ...this.defaultCategory };
  selectedCategory: Category = { ...this.defaultCategory }; // Holds the category to be edited

  errorMessage: string | null = null; // Improved type

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories(); // Load categories when the component initializes
    console.log('this.categories = ' + this.categories);
  }

  openEditModal(category: Category): void {
    this.selectedCategory = { ...category }; // Copy the selected category to avoid direct mutation
    this.showModal('editCategoryModal');
  }

  openCreateModal(): void {
    this.newCategory = { ...this.defaultCategory };
    this.showModal('createCategoryModal');
  }

  showToast(message: string, isSuccess: boolean = true): void {
    const toastElement = document.getElementById('dynamicToast');
    const messageElement = document.getElementById('toastMessage');

    if (toastElement && messageElement) {
      // Set the dynamic message
      messageElement.textContent = message;

      // Set the toast background color based on success or error
      if (isSuccess) {
        toastElement.classList.remove('bg-danger');
        toastElement.classList.add('bg-success');
      } else {
        toastElement.classList.remove('bg-success');
        toastElement.classList.add('bg-danger');
      }

      // Show the toast with animation
      const toast = new Toast(toastElement);
      toast.show();

      // Optionally hide after a few seconds
      setTimeout(() => {
        toast.hide();
      }, 3000);
    }
  }

  createCategory(): void {
    // Prepare the category data without _id and __v
    const { _id, __v, ...categoryToCreate } = this.newCategory;
    console.log(
      'categoryToCreate = ',
      JSON.stringify(categoryToCreate, null, 2)
    );

    this.categoryService
      .createCategory(categoryToCreate)
      .pipe(
        tap((category: Category) => {
          console.log('Category created:', category);
          this.categories.push(category); // Add the newly created category to the list
          this.newCategory = { ...this.defaultCategory }; // Reset the new category object
          this.loadCategories();
          this.showToast('Category created successfully!', true);
        }),
        catchError((error) => {
          console.error('Error creating category:', error);
          this.showToast(
            'Failed to create category. Please try again later.',
            false
          );
          this.errorMessage =
            'Failed to create category. Please try again later.';
          return of(null); // Return a null value to complete the observable
        })
      )
      .subscribe(() => this.closeModal('createCategoryModal'));
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService
        .deleteCategoryById(id)
        .pipe(
          tap(() => {
            console.log(
              'Category deleted successfully on the server. Removing from frontend.'
            );
            this.categories = this.categories.filter(
              (category) => category._id !== id
            );

            this.showToast('Category deleted successfully!', true);
          }),
          catchError((error) => {
            this.showToast(
              'Failed to delete category. Please try again later.',
              false
            );
            console.error('Error deleting category:', error);
            this.errorMessage =
              'Failed to delete category. Please try again later.';
            return of(null);
          })
        )
        .subscribe();
    }
  }

  onCreateSubmit() {
    console.log(
      'this.newCategory = ',
      JSON.stringify(this.newCategory, null, 2)
    );

    this.createCategory();
  }
  onEditSubmit(): void {
    if (!this.selectedCategory._id) {
      this.errorMessage =
        'Category ID is missing. Please select a valid category.';
      return;
    }
    // Create a new category object excluding _id and __v
    const { __v, _id, ...categoryData } = this.selectedCategory;
    console.log('this.selectedCategory._id = ' + this.selectedCategory._id);
    console.log('categoryData = ' + JSON.stringify(categoryData, null, 2));
    this.categoryService
      .updateCategoryById(this.selectedCategory._id, categoryData)
      .pipe(
        tap(() => {
          this.closeModal('editCategoryModal');
          this.loadCategories();
          this.showToast('Category Edited successfully!', true);
        }),
        catchError((error) => {
          this.showToast(
            'CFailed to update category. Please try again later.',
            false
          );
          console.error('Error updating category:', error);
          this.errorMessage =
            'Failed to update category. Please try again later.';
          return of(null); // Return a null value to complete the observable
        })
      )
      .subscribe();
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

  private loadCategories(): void {
    this.categoryService
      .getCategories()
      .pipe(
        tap((response) => {
          console.log('Response received:', response);
          this.categories = response.categories; // Ensure this is an array
          console.log('this.categories = ' + this.categories);
          if (this.categories.length > 0) {
            this.selectedCategory = this.categories[0];
          } else {
            console.log('No categories available.');
          }
        }),
        catchError((error) => {
          console.error('Error fetching categories:', error);
          this.errorMessage =
            'Failed to load categories. Please try again later.';
          return of({ categories: [], message: 'Failed to load categories' }); // Return a proper object
        })
      )
      .subscribe();
  }
}
