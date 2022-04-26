import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'flash-messages-angular';
import { AuthService } from 'src/app/services/auth.service';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  user: SocialUser = new SocialUser();
  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessages: FlashMessagesService,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      if (user === null) {
        this.router.navigate(['login']);
      } else {
        this.user = user;
        this.authService
          .socialLogin({
            username: user.name,
            email: user.email,
            password: user.id,
          })
          .subscribe((data) => {
            if (data.success) {
              this.authService.storeUser(data.message, data.user);
              this.flashMessages.show('Logged In Successful', {
                cssClass: 'alert-success',
                timeout: 5000,
              });
              this.router.navigate(['']);
            } else {
              this.flashMessages.show(data.message, {
                cssClass: 'alert-danger',
                timeout: 5000,
              });
              this.router.navigate(['login']);
            }
          });
      }
    });
  }

  onSubmit() {
    const user = {
      email: this.email,
      password: this.password,
    };
    this.authService.authenticateUser(user).subscribe((data) => {
      if (data.success) {
        this.authService.storeUser(data.message, data.user);
        this.flashMessages.show('Logged In Successful', {
          cssClass: 'alert-success',
          timeout: 5000,
        });

        this.router.navigate(['']);
      } else {
        this.flashMessages.show(data.message, {
          cssClass: 'alert-danger',
          timeout: 5000,
        });
        this.router.navigate(['login']);
      }
    });
  }
  
  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
}
