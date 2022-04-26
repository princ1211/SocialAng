import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any;
  isFollowing: boolean = false;
  currentUser: any;
  isCurrentUserProfile: any;
  constructor(
    public authService: AuthService,
    private activatedroute: ActivatedRoute,
    private postService: PostService,
    public dialog: MatDialog,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserById();
    this.fetchCurrentUser();
  }

  fetchCurrentUser() {
    this.authService.getCurrentUser().subscribe((data) => {
      if (data.success) {
        this.currentUser = data.user;
      }
      this.isCurrentUserProfile = this.user._id === this.currentUser._id;
      this.checkIfCurrentUserIsfollowingTheUser();
    });
  }
  checkIfCurrentUserIsfollowingTheUser() {
    if (this.currentUser.followings.includes(this.user._id)) {
      this.isFollowing = true;
    } else {
      this.isFollowing = false;
    }
  }

  fetchUserById() {
    let userId = this.activatedroute.snapshot.paramMap.get('userId');
    this.postService.getUserById(userId).subscribe((data) => {
      this.user = data.message;
    });
  }
  follow() {
    this.postService.follow(this.user._id).subscribe((data) => {
      console.log(data);
      this.checkIfCurrentUserIsfollowingTheUser();
      this.redirectTo(['profile', this.user._id]);
    });
  }
  unfollow() {
    this.postService.unfollow(this.user._id).subscribe((data) => {
      console.log(data);
      this.checkIfCurrentUserIsfollowingTheUser();
      this.redirectTo(['profile', this.user._id]);
    });
  }
  redirectTo(uri: any) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(uri));
  }
  openDialog() {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      data: this.user,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.postService.updateUserProfile(result).subscribe((data) => {
          console.log(data);
        });
      }
    });
  }

  onProfilePicUpload(event: any) {
    let formData = new FormData();
    formData.append('profilePic', event.target.files[0]);
    this.postService.updateUserProfilepic(formData).subscribe((data) => {
      console.log(data);
    });
  }

  onCoverPicUpload(event: any) {
    console.log(event.target.files[0]);
  }
}
