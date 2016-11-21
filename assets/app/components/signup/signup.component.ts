import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';

@Component ({
  selector: 'hypertube-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
  public signupForm: FormGroup;

  ngOnInit() {
      this.signupForm = new FormGroup({
          name: new FormControl(''),
          surname: new FormControl(''),
          email: new FormControl(''),
          username: new FormControl(''),
          password: new FormControl(''),
          repeatPassword: new FormControl('')
      });
  }

  signup(){
      // call to user registration service goes here. Elements have not been sanitized or validated. passing through signup form as object.
      console.log(this.signupForm.value);
  }

 }
