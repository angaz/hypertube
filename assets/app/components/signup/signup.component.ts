import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/user';

@Component({
	selector: 'hypertube-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
	signupForm: FormGroup;

	constructor(private authService: AuthService, private router: Router) {
	}

	onSubmit() {
		const user = new User(
			this.signupForm.value.firstName,
			this.signupForm.value.lastName,
			this.signupForm.value.email,
			this.signupForm.value.username,
			this.signupForm.value.password,
			null // Meta information
		);
		this.authService.signup(user)
			.subscribe(
				data => {
					console.log(data);
					this.router.navigateByUrl('/users/signin');
				},
				error => console.error(error)
			);
		this.signupForm.reset();
	}

	ngOnInit() {
		this.signupForm = new FormGroup({
			firstName: new FormControl(null, Validators.required),
			lastName: new FormControl(null, Validators.required),
			email: new FormControl(null, [
				Validators.required,
				Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
			]),
			username: new FormControl(null, Validators.required),
			password: new FormControl(null, Validators.required),
			repeatPassword: new FormControl(null, Validators.required)
		});
	}
}