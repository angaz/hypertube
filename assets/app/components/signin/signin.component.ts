import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component ({
  selector: 'hypertube-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit{
  public signinForm: FormGroup;

  ngOnInit (){
    this.signinForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    })
  }

  signin(){
    // call to user signin service goes here. Elements have not been sanitized or validated. passing through signup form as object.
    console.log(this.signinForm.value);
  }


}
