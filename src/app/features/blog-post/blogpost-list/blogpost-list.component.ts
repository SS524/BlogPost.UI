import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blogpost-list',
  templateUrl: './blogpost-list.component.html',
  styleUrls: ['./blogpost-list.component.css']
})
export class BlogpostListComponent implements OnInit, OnDestroy {
  blogPosts?:BlogPost[];
  count?:number 
  blogPostSubscription?:Subscription;
  constructor(private blogPostService:BlogPostService){}
 
  ngOnInit(): void {
   this.blogPostSubscription = this.blogPostService.getAllBlogPosts().subscribe({
      next: (response)=>{
       this.blogPosts = response;
       this.count = this.blogPosts.length;
      }
    })
    
  }

  ngOnDestroy(): void {
    this.blogPostSubscription?.unsubscribe();
  }

}
