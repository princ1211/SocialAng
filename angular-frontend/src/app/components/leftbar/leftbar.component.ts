import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-leftbar',
  templateUrl: './leftbar.component.html',
  styleUrls: ['./leftbar.component.css'],
})
export class LeftbarComponent implements OnInit {
  constructor(public postService: PostService, public router: Router) {}
  friends: any;
  ngOnInit(): void {
    this.fetchCurrentUserFriends();
  }
  fetchCurrentUserFriends() {
    this.postService.getCurrentUserFriends().subscribe((data) => {
      if (data.success) {
        this.friends = data.response;
      }
    });
  }
  redirectTo(uri: any) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(uri));
  }
  seeProfile(friendId: any) {
    this.redirectTo(['profile', friendId]);
    //this.router.navigate(['profile',friendId]);
  }
}
