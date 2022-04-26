import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rightbar',
  templateUrl: './rightbar.component.html',
  styleUrls: ['./rightbar.component.css'],
})
export class RightbarComponent implements OnInit {
  constructor(public postService: PostService, private router: Router) {}
  peopleYouMayKnow: any;
  ngOnInit(): void {
    this.fetchUnFollowingPeople();
  }

  fetchUnFollowingPeople() {
    this.postService.getUnFollowingPeople().subscribe((data) => {
      if (data.success) {
        this.peopleYouMayKnow = data.response;
      }
    });
  }

  redirectTo(uri: any) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(uri));
  }
  seeProfile(person: any) {
    this.redirectTo(['profile', person._id]);
    // this.router.navigate(['profile',person._id])
  }
}
