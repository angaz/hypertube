import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component ({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  signinForm: FormGroup;

  onSubmit() {
      // call to user registration service goes here. Elements have not been sanitized or validated. passing through signup form as object.
      console.log(this.signinForm);
      this.signinForm.reset();
    }

    ngOnInit () {
	this.signinForm = new FormGroup({
	  username: new FormControl(null, Validators.required),
	  password: new FormControl(null, Validators.required)
	})
  }
}