import { Component } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {UserService} from "../../services/user.service";

@Component ({
	selector: 'hypertube-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.css'],
})

export class NavComponent {
	constructor(
		private authService: AuthService,
		private _searchService: SearchService,
		private router: Router,
		private _userService: UserService
	) {}

	getUserProfile(){
		this._userService.showUserProfile(null);
	}

	toggleSearch(){
		this._searchService.toggleHide();
	}

	onLogout() {
		this.authService.logout();
		this.router.navigateByUrl('/');
	}

	isLoggedIn() {
		return this.authService.isLoggedIn();
	}
}
