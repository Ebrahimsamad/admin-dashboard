import { Component, OnInit } from '@angular/core';
import { Modal } from 'bootstrap';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { catchError, of, tap } from 'rxjs';
import { Category } from '../model/Category';
import { CategoryService } from '../services/Category/category.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = []; // Array of categories

  defaultCategory: any = {
    name: '',
  };
  newCategory: any = {
    name: '',
  };

  selectedCategory: any = {
    name: '',
  }; // Holds the category to be edited

  errorMessage: any;
  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadcategories(); // Load categories when the component initializes
  }

  openEditModal(category: Category) {
    this.selectedCategory = { ...category }; // Copy the selected category to avoid direct mutation
    const modalElement = document.getElementById('editCategoryModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  openCreateModal() {
    this.newCategory = this.defaultCategory;
    console.log(
      'this.newCategory.name = ' + this.newCategory.name,
      'this.defaultCategory.name = ' + this.defaultCategory.name
    );
    const modalElement = document.getElementById('createCategoryModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  createcategory(): void {
    this.categoryService
      .createCategory(this.newCategory)
      .pipe(
        tap((category: Category) => {
          console.log('category created:', category);
          this.categories.push(category); // Add the newly created category to the list
          console.log(
            'this.newCategory.name = ' + this.newCategory.name,
            'this.defaultCategory.name = ' + this.defaultCategory.name
          );
          this.newCategory.name = ''; // Reset the new category object
          this.loadcategories();
        }),
        catchError((error) => {
          console.log(this.newCategory);
          console.error('Error creating category:', error);
          // Handle error accordingly
          return []; // Return an empty array or appropriate value to complete the observable
        })
      )
      .subscribe();

    // Close the modal (if using Bootstrap)
    const modalElement = document.getElementById('createCategoryModal') as any;
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategoryById(id).subscribe({
        next: () => {
          // Remove the deleted category from the local list
          this.categories = this.categories.filter(
            (category) => category._id !== id
          );
        },
        error: (err: any) => (this.errorMessage = err),
      });
    }
  }

  onEditSubmit(): void {
    if (!this.selectedCategory._id) {
      this.errorMessage =
        'category ID is missing. Please select a valid category.';
      return;
    }
    // Create a new category object excluding _id and __v
    const { _id, __v, ...categoryData } = this.selectedCategory;
    // console.log('Submitting category:', JSON.stringify(categoryData, null, 2));
    this.categoryService
      .updateCategoryById(this.selectedCategory._id, categoryData)
      .pipe(
        tap(() => {
          this.closeModal();
          this.loadcategories();
        }),
        catchError((error) => {
          this.handleError(error);
          return of(null);
        })
      )
      .subscribe();
  }

  onCreateSubmit() {
    this.createcategory();
  }

  handleError(error: any) {
    throw new Error('Method not implemented.');
  }

  private closeModal(): void {
    const modalElement = document.getElementById('editCategoryModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  // Load categories (can be done in ngOnInit or other lifecycle hooks)
  loadcategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        // Check if the categories are fetched correctly
        console.log('Fetched categories: ', categories);

        // Assign categories to the local variable
        this.categories = categories;

        // Log the first category after assignment
        if (this.categories.length > 0) {
          console.log('First category: ', this.categories[0]);
          this.selectedCategory = this.categories[0];
        } else {
          console.log('No categories available.');
        }
      },
      error: (error: any) => {
        console.error('Error fetching categories: ', error);
      },
    });
  }
}
