import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {UserService} from "../../services/user.service";
import {Subscription} from "rxjs";

@Component ({
	selector: 'hypertube-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.css'],
})

export class NavComponent {
	private userProfileHide = true;
	private userProfileHideSub: Subscription;
	constructor(
		private authService: AuthService,
		private _searchService: SearchService,
		private router: Router,
		private _userService: UserService
	) {}

	toggleUserProfile(){
		if (this.userProfileHide)
			this._userService.showUserProfile(null);
		else
			this._userService.hideUserProfile();
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

	ngOnInit(){
		this.userProfileHideSub = this._userService.profileHide$.subscribe(hide => this.userProfileHide = hide);
	}
}
