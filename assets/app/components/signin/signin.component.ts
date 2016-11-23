import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../user.model';

@Component ({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  signinForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
      // call to user registration service goes here. Elements have not been sanitized or validated. passing through signup form as object.
      const user = new User(this.signinForm.value.username, this.signinForm.value.password);
      this.authService.signin(user)
          .subscribe(
              data => {
                  localStorage.setItem('token', data.token);
                  localStorage.setItem('userId', data.userId);
                  this.router.navigateByUrl('/');
              },
              error => console.error(error)
          );
      this.signinForm.reset();
    }

    ngOnInit () {
	this.signinForm = new FormGroup({
	  username: new FormControl(null, Validators.required),
	  password: new FormControl(null, Validators.required)
	})
  }
}