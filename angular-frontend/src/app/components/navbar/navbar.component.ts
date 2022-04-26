import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'flash-messages-angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  
  user:any
  constructor(
    public authService: AuthService,
    private router: Router,
    private flashmessages: FlashMessagesService,
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((data) => {
      if (data.success) {
        console.log(data.user);
        this.user = data.user;
      }
    });
  }
  

  onLogout() {
    this.authService.logout();
    this.flashmessages.show('You logged Out', {
      cssClass: 'alert-success',
      timeout: 5000,
    });
    this.router.navigate(['register']);
    return false;
  }
  redirectTo(uri: any) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(uri));
  }
  currentUserProfile() {
    this.redirectTo(['profile', this.user._id]);
  }
}
