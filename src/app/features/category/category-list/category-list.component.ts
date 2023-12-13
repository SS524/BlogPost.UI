import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit,OnDestroy {
  //categories$?:Observable<Category[]>;
  categories?:Category[];
  count?:number;
  getCategoriesSubscription?: Subscription;
 constructor(private categoryService:CategoryService){}

  ngOnInit(): void {
    this.getCategoriesSubscription = this.categoryService.getAllCategories().subscribe({
      next: (response)=>{
        this.categories = response;
        this.count = this.categories.length;
      }
    });
  }

  ngOnDestroy(): void {
    this.getCategoriesSubscription?.unsubscribe();
  }
}
