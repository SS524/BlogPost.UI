import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { RouteReuseStrategy, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent implements OnInit, OnDestroy {
  model:AddBlogPost;
  isImageSelectorVisible:boolean = false;
  private addBlogPostSubscription?: Subscription;
  imageSelectorSubscription?:Subscription;
  categories$?: Observable<Category[]>;
  constructor(private blogPostService:BlogPostService,private imageService:ImageService, private router: Router, private categoryService:CategoryService){
    this.model = {
      title: '',
      shortDescription: '',
      urlHandle: '',
      content: '',
      featuredImageUrl: '',
      author: '',
      isVisible: true,
      publishedDate: new Date(),
      categories: []
    }
  }
  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();

    this.imageSelectorSubscription = this.imageService.onSelectedImage().subscribe({
      next: (selectedImage)=>{
        this.model.featuredImageUrl = selectedImage.url;
        this.isImageSelectorVisible = false;
      }
    })
  }


  onFormSubmit(){
    this.addBlogPostSubscription = this.blogPostService.createBlogPost(this.model).subscribe({
      next: (response) =>{
        this.router.navigateByUrl('admin/blogposts');
      }
    })
  }

  openImageSelector(){
    this.isImageSelectorVisible = true;
  }

  closeImageSelector(){
    this.isImageSelectorVisible = false;
  }

  ngOnDestroy(): void {
    this.addBlogPostSubscription?.unsubscribe();
    this.imageSelectorSubscription?.unsubscribe();
  }
}
