import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  JwtAuthToken: any;
  user: any;
  serverUrl = 'http://localhost:5000';
  //serverUrl = 'http://3.17.149.82:5000';
  constructor(private http: HttpClient) {}

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.JwtAuthToken = token;
  }

  getUserById(userId: any): Observable<any> {
    this.loadToken();
    const headers = new HttpHeaders()
      .set('Authorization', this.JwtAuthToken)
      .set('Access-Control-Allow-Origin', '*');
    return this.http.get(`${this.serverUrl}/user/getuser/${userId}`, {
      headers: headers,
    });
  }
  getUserFeed(): Observable<any> {
    this.loadToken();
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', this.JwtAuthToken);
    return this.http.get(`${this.serverUrl}/posts/getuserfeed`, {
      headers: headers,
    });
  }

  createPost(postData: any): Observable<any> {
    this.loadToken();
    const headers = new HttpHeaders()
      .set('Authorization', this.JwtAuthToken)
      .set('Access-Control-Allow-Origin', '*');
    return this.http.post(`${this.serverUrl}/posts/createpost`, postData, {
      headers: headers,
    });
  }

  updatePost(postData:any,postId:any):Observable<any>{
    this.loadToken();
    const headers = new HttpHeaders()
      .set('Authorization', this.JwtAuthToken)
      .set('Access-Control-Allow-Origin', '*');
    return this.http.put(`${this.serverUrl}/posts/updatepost/${postId}`,postData,{headers});
  }

  deletePost(postId: any): Observable<any> {
    this.loadToken();
    const headers = new HttpHeaders()
      .set('Authorization', this.JwtAuthToken)
      .set('Access-Control-Allow-Origin', '*');
    return this.http.delete(`${this.serverUrl}/posts/deletepost/${postId}`, {
      headers: headers,
    });
  }

  likeordislike(postId: any): Observable<any> {
    this.loadToken();
    const headers = new HttpHeaders()
      .set('Authorization', this.JwtAuthToken)
      .set('Access-Control-Allow-Origin', '*');
    return this.http.put(
      `${this.serverUrl}/posts/likeordislike/${postId}`,
      null,
      { headers: headers }
    );
  }

  getLikes(postId: any): Observable<any> {
    return this.http.get(`${this.serverUrl}/posts/getlikes/${postId}`);
  }

  getUnFollowingPeople(): Observable<any> {
    this.loadToken();
    const headers = new HttpHeaders()
      .set('Authorization', this.JwtAuthToken)
      .set('Access-Control-Allow-Origin', '*');
    return this.http.get(`${this.serverUrl}/user/peopleyoumayknow`, {
      headers: headers,
    });
  }

  getCurrentUserFriends(): Observable<any> {
    this.loadToken();
    const headers = new HttpHeaders()
      .set('Authorization', this.JwtAuthToken)
      .set('Access-Control-Allow-Origin', '*');
    return this.http.get(`${this.serverUrl}/user/getuserfriends`, {
      headers: headers,
    });
  }

  follow(userId: any): Observable<any> {
    this.loadToken();
    const headers = new HttpHeaders()
      .set('Authorization', this.JwtAuthToken)
      .set('Access-Control-Allow-Origin', '*');
    return this.http.put(`${this.serverUrl}/user/${userId}/follow`, null, {
      headers: headers,
    });
  }

  unfollow(userId: any): Observable<any> {
    this.loadToken();
    const headers = new HttpHeaders()
      .set('Authorization', this.JwtAuthToken)
      .set('Access-Control-Allow-Origin', '*');
    return this.http.put(`${this.serverUrl}/user/${userId}/unfollow`, null, {
      headers,
    });
  }

  updateUserProfile(user: any): Observable<any> {
    this.loadToken();
    const headers = new HttpHeaders()
      .set('Authorization', this.JwtAuthToken)
      .set('Access-Control-Allow-Origin', '*');
    return this.http.put(`${this.serverUrl}/user/updateuser`, user, {
      headers,
    });
  }

  updateUserProfilepic(formData: any): Observable<any> {
    this.loadToken();
    const headers = new HttpHeaders()
      .set('Authorization', this.JwtAuthToken)
      .set('Access-Control-Allow-Origin', '*');
    return this.http.put(`${this.serverUrl}/user/updateprofilepic`, formData, {
      headers,
    });
  }
}
