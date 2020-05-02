import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: string;
  username: string;
  email: string;
  password: string;

  constructor(private validateService: ValidateService,
              private flashMessagesService: FlashMessagesService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {

  }

  onRegisterSubmit() {
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password,
    };

    // check register fields
    if (!this.validateService.validateRegister(user)) {
      this.flashMessagesService.show('please fill in all fields !', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // check email
    if (!this.validateService.validateEmail(user.email)) {
      this.flashMessagesService.show('please fill in valid email !', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // register user
    this.authService.registerUser(user).pipe().subscribe(
      data => {
        this.flashMessagesService.show('You are now registered and can login', {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/login']);
      },
      error => {
        this.flashMessagesService.show('Something went wrong', {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/register']);
      },
    );
  }
}
