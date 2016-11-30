import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component ({
    selector: 'hypertube-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {
    signinForm: FormGroup;

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        const user = new User(
            null,
            null,
            null,
            this.signinForm.value.username,
            this.signinForm.value.password
        );
        this.authService.signin(user)
            .subscribe(
                data => {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                    this.router.navigateByUrl('/movies');//?token=' + data.token);
                },
                error => console.error(error)
            );
        this.signinForm.reset();
    }
    ngOnInit () {
        this.signinForm = new FormGroup({
            username: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.required)
        });
    }
}