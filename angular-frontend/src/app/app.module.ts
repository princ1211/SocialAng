import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { FlashMessagesModule } from 'flash-messages-angular';
import { HttpClientModule } from '@angular/common/http';
import { SocialAuthServiceConfig,SocialLoginModule,GoogleLoginProvider} from 'angularx-social-login';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChatComponent } from './components/chat/chat.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { MessageComponent } from './components/message/message.component';
import { PostComponent } from './components/post/post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostDeleteDialogComponent } from './components/post-delete-dialog/post-delete-dialog.component';
import { MaterialModule } from './material/material.module';
import { FeedComponent } from './components/feed/feed.component';
import { LeftbarComponent } from './components/leftbar/leftbar.component';
import { RightbarComponent } from './components/rightbar/rightbar.component';
import { EditProfileDialogComponent } from './components/edit-profile-dialog/edit-profile-dialog.component';
import { UpdatePostComponent } from './components/update-post/update-post.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    ChatComponent,
    ConversationComponent,
    MessageComponent,
    PostComponent,
    PostDeleteDialogComponent,
    FeedComponent,
    LeftbarComponent,
    RightbarComponent,
    EditProfileDialogComponent,
    UpdatePostComponent,
  ],
  entryComponents: [
    PostDeleteDialogComponent,
    EditProfileDialogComponent,
    UpdatePostComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FlashMessagesModule.forRoot(),
    HttpClientModule,
    SocialLoginModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '864971037741-dq3o1n51o2nud80ruqabvivnthisiksg.apps.googleusercontent.com'
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
