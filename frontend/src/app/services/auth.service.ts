import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  authToken: string;
  user: any;

  constructor(private http: HttpClient) {}

  // send http post to backend to register user
  registerUser(user) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/register', user, {headers})
      .pipe(map(res => res));
  }

  // send http post to authenticate user
  authenticateUser(user) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/authenticate', user, {headers})
      .pipe(map(res => res));
  }

  // send http get to get authorization
  getProfile() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', token);
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/users/profile', {headers});
  }

  // store user token in localstorage
  storeUser(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  // check if logged in or not
  loggedIn() {
    const helper = new JwtHelperService();
    return !helper.isTokenExpired(this.authToken);
  }

  // logout
  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

}
