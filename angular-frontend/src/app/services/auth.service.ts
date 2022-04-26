import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  JwtAuthToken: any;
  user: any;
  serverUrl = 'http://localhost:5000';
  //serverUrl = 'http://3.17.149.82:5000';
  constructor(private http: HttpClient) {}

  addUser(user: Object): Observable<any> {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    return this.http.post(this.serverUrl + '/user/register', user, {
      headers: headers,
    });
  }

  socialLogin(user: Object): Observable<any> {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    console.log(user);
    return this.http.post(`${this.serverUrl}/user/sociallogin`, user, {
      headers: headers,
    });
  }
  authenticateUser(user: Object): Observable<any> {
    const headers = new HttpHeaders();
    headers.set('content-type', 'application/json');
    return this.http.post(`${this.serverUrl}/user/authenticate`, user, {
      headers: headers,
    });
  }

  getCurrentUser(): Observable<any> {
    this.loadToken();
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.JwtAuthToken);
    return this.http.get(`${this.serverUrl}/user/currentuser`, {
      headers: headers,
    });
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.JwtAuthToken = token;
  }
  storeUser(jwtToken: any, user: any): any {
    localStorage.setItem('id_token', jwtToken);
    //localStorage.setItem('user',JSON.stringify(user))
    this.JwtAuthToken = jwtToken;
    this.user = user;
  }

  logout() {
    this.JwtAuthToken = null;
    this.user = null;
    localStorage.clear();
  }

  isTokenExpired() {
    this.loadToken();
    const helper = new JwtHelperService();
    return helper.isTokenExpired(this.JwtAuthToken);
  }
}
