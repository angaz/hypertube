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

export class resetComponent implements OnInit {
    resetForm: FormGroup;

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        const user = new User(
            null,
            null,
            this.resetForm.value.email,
            null,
            null
        );
        this.authService.reset(user)
            .subscribe(
                data => {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                    this.router.navigateByUrl('/movies');//?token=' + data.token);
                },
                error => console.error(error)
            );
        this.resetForm.reset();
    }
    ngOnInit () {
        this.resetForm = new FormGroup({
            email: new FormControl(null, Validators.required)
        });
    }
}