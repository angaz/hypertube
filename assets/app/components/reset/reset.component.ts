import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component ({
    selector: 'hypertube-reset',
    templateUrl: './reset.component.html',
    styleUrls: ['./reset.component.css']
})

export class ResetComponent implements OnInit {
    emailForm: FormGroup;
    passwordForm: FormGroup;
    emailSent: boolean = false;


    constructor(private authService: AuthService, private router: Router) {}

    onSubmitEmail() {
        const user = new User(
            null,
            null,
            this.emailForm.value.email,
            null,
            null
        );
        this.authService.sendReset(user)
            .subscribe(
                data => {
                    console.log(data);
                    this.router.navigateByUrl('/users/reset');
                },
                error => console.error(error)
            );
        this.emailSent = true;
        this.emailForm.reset();
    }

    resetRequest() {
        console.log('reset.component entered: resetRequest function executed');
        const user = new User(
            null,
            null,
            null,
            null,
            this.passwordForm.value.password
        );
        this.authService.resetPassword()
            .subscribe(
                data => {
                    //localStorage.setItem('token', data.token);
                    //localStorage.setItem('userId', data.userId);
                    this.router.navigateByUrl('/reset');
                },
                error => console.error(error)
            );
        this.passwordForm.reset();
    }


    onSubmitPassword() {
        const user = new User(
            null,
            null,
            null,
            null,
            this.passwordForm.value.password
        );
        this.authService.resetPassword()
            .subscribe(
                data => {
                    //localStorage.setItem('token', data.token);
                    //localStorage.setItem('userId', data.userId);
                    //this.router.navigateByUrl('/reset');
                },
                error => console.error(error)
            );
        this.passwordForm.reset();
    }

    ngOnInit () {
        this.passwordForm = new FormGroup({
            password: new FormControl(null, Validators.required)
        });
        this.emailForm = new FormGroup({
            email: new FormControl(null, Validators.required)
        });
    }
}