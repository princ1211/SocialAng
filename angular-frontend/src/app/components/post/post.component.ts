import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { MatDialog } from '@angular/material/dialog';
import { PostDeleteDialogComponent } from '../post-delete-dialog/post-delete-dialog.component';
import { FlashMessagesService } from 'flash-messages-angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UpdatePostComponent } from '../update-post/update-post.component';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() post: any;
  @Output() refreshFeed = new EventEmitter();
  userNameOfAPost: any;
  noOfLikes: Number = 0;
  user: any;
  currentUser: any;
  isCurrentUserProfile: any;
  isCurrentUserLiked: any;
  constructor(
    private postService: PostService,
    public dialog: MatDialog,
    private flashMessages: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.postService.getUserById(this.post.userId).subscribe((user) => {
      this.userNameOfAPost = user.message.username;
      this.user = user.message;
      this.fetchCurrentUser();
    });
    this.setLikes();
  }
  fetchCurrentUser() {
    this.authService.getCurrentUser().subscribe((data) => {
      if (data.success) {
        this.currentUser = data.user;
      }
      if (this.currentUser && this.user) {
        this.isCurrentUserProfile = this.user._id === this.currentUser._id;
      }
      this.checkIfCurrentUserLikedOrNot();
    });
  }
  checkIfCurrentUserLikedOrNot() {
    this.isCurrentUserLiked = this.post.likes.includes(this.currentUser._id);
  }
  openDialog() {
    const postDialogRef = this.dialog.open(PostDeleteDialogComponent);
    postDialogRef.afterClosed().subscribe((result) => {
      if (result === 'true') {
        this.postService.deletePost(this.post._id).subscribe((data) => {
          if (!data.success) {
            this.flashMessages.show(data.message, {
              cssClass: 'alert-danger',
              timeout: 5000,
            });
          }
          this.refreshFeed.emit();
        });
      }
    });
  }

  openEditPostDialog(){
    const editPostDialogRef = this.dialog.open(UpdatePostComponent,{
      data:this.post
    });
    editPostDialogRef.afterClosed().subscribe((result)=>{
      console.log(result)
      console.log(this.post._id)
      this.postService.updatePost(result,this.post._id).subscribe(data=>{
        if(!data.success){
          this.flashMessages.show(data.message, {
            cssClass: 'alert-danger',
            timeout: 5000,
          });
        }
        console.log(data);
        this.refreshFeed.emit();
      })
    })
  }
  setLikes() {
    this.postService.getLikes(this.post._id).subscribe((data) => {
      if (data.success) {
        this.noOfLikes = data.response;
      } else {
        console.log(data);
      }
    });
  }

  likeordislike() {
    this.postService.likeordislike(this.post._id).subscribe((data) => {
      this.refreshFeed.emit();
      if (data.success) {
        this.setLikes();
      } else {
        console.log(data);
      }
    });
  }
}
