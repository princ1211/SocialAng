import { Component, OnInit } from '@angular/core';
import { ValidateService } from 'src/app/services/validate.service';
import { AuthService } from 'src/app/services/auth.service';
import { FlashMessagesService } from 'flash-messages-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  username: string = '';
  email: string = '';
  password: string = '';
  constructor(
    private validateService: ValidateService,
    private flashMessagesService: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}
  onSubmit() {
    const user = {
      username: this.username,
      email: this.email,
      password: this.password,
    };
    if (!this.validateService.validateRegister(user)) {
      this.flashMessagesService.show('please Fill All The Fields', {
        cssClass: 'alert-danger',
        timeout: 3000,
      });
      return false;
    }

    if (!this.validateService.validateEmail(user.email)) {
      this.flashMessagesService.show('please enter valid email', {
        cssClass: 'alert-danger',
        timeout: 3000,
      });
      return false;
    }
    this.authService.addUser(user).subscribe((data) => {
      if (data.success) {
        this.flashMessagesService.show(data.message, {
          cssClass: 'alert-success',
          timeout: 3000,
        });
        this.router.navigate(['/login']);
      } else {
        this.flashMessagesService.show(data.message, {
          cssClass: 'alert-danger',
          timeout: 3000,
        });
      }
    });
    return true;
  }
}
