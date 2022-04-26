import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  @ViewChild(PostComponent) public postComponent: any
  currentUser: any;
  constructor(
    public postService: PostService,
    public authService: AuthService
  ) {}
  posts: any;
  desc: any = '';
  pictureData: any;
  ngOnInit(): void {
    this.fetchUserFeed();
    this.fetchCurrentUser();
  }
  postData(event: any) {
    this.desc = event.target.value;
  }

  fetchUserFeed() {
    this.postService.getUserFeed().subscribe((data) => {
      if (data.success) {
        this.posts = data.response;
      } else {
        console.log(data);
      }
    });
  }
  fetchCurrentUser() {
    this.authService.getCurrentUser().subscribe((data) => {
      if (data.success) {
        this.currentUser = data.user;
      }
    });
  }

  onPictureUpload(event: any) {
    if (event.target.files.length > 0) {
      this.pictureData = event.target.files[0];
    }
  }

  submitPost() {
    const formData = new FormData();
    formData.append('desc', this.desc);
    if (this.pictureData) {
      formData.append('postImage', this.pictureData);
    }
    this.postService.createPost(formData).subscribe((data) => {
      this.fetchUserFeed();
      this.postComponent.fetchCurrentUser();
      console.log(data);
    });
    this.desc = '';
    this.pictureData = null;
  }
}
