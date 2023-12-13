import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { UpdateBlogPost } from '../models/update-blog-post.model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-edit-blogpost',
  templateUrl: './edit-blogpost.component.html',
  styleUrls: ['./edit-blogpost.component.css']
})
export class EditBlogpostComponent implements OnInit, OnDestroy {
  id:string | null = null;
  routeSubscription?:Subscription;
  getBlogPostByIdSubscription?: Subscription;
  updateBlogPostSubscription?: Subscription;
  deleteBlogPostSubscription?:Subscription;
  model?:BlogPost;
  categories$?:Observable<Category[]>
  selectedCategories?:string[];
  isImageSelectorVisible:boolean = false;
  imageSelectSubscription?:Subscription;
  constructor(private route:ActivatedRoute,private imageService:ImageService, private blogPostService:BlogPostService, private categoryService:CategoryService, private router:Router){}
  
  ngOnInit(): void {

    this.categories$ = this.categoryService.getAllCategories();
    this.routeSubscription = this.route.paramMap.subscribe({
      next:(param)=>{
        this.id = param.get('id')

        if(this.id){
          this.getBlogPostByIdSubscription = this.blogPostService.getBlogPostById(this.id).subscribe({
            next: (response)=>{
              this.model = response;
              this.selectedCategories = response.categories.map(x=>x.id);
            }
          })
        }

        this.imageSelectSubscription = this.imageService.onSelectedImage().subscribe({
          next: (response)=>{
            if(this.model){
              this.model.featuredImageUrl = response.url;
              this.isImageSelectorVisible = false;
            }
          }
        })

      }
    })
  }



  onFormSubmit(){
    if(this.model && this.id){
      var updateBlogPost:UpdateBlogPost = {
        author: this.model.author,
        content: this.model.content,
        shortDescription: this.model.shortDescription,
        featuredImageUrl:this.model.featuredImageUrl,
        publishedDate: this.model.publishedDate,
        title: this.model.title,
        urlHandle: this.model.urlHandle,
        isVisible: this.model.isVisible,
        categories: this.selectedCategories?? []
      };
      this.updateBlogPostSubscription = this.blogPostService.updateBlogPost(this.id,updateBlogPost).subscribe({
        next: (response)=>{
          this.router.navigateByUrl('/admin/blogposts');
        }
      })
    }

   
  }

  openImageSelector(){
    this.isImageSelectorVisible = true;
  }

  closeImageSelector(){
    this.isImageSelectorVisible = false;
  }

  onDelete(){
    if(this.id){
      this.deleteBlogPostSubscription = this.blogPostService.deleteBlogPost(this.id).subscribe({
        next: (response)=>{
          this.router.navigateByUrl('/admin/blogposts');
        }
      })
    }
    
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.getBlogPostByIdSubscription?.unsubscribe();
    this.updateBlogPostSubscription?.unsubscribe();
    this.deleteBlogPostSubscription?.unsubscribe();
    this.imageSelectSubscription?.unsubscribe();
  }

}
