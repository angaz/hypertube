import { Component, Input, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component ({
	selector: 'hypertube-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.css'],
})

export class NavComponent {
	constructor(
		private authService: AuthService,
		private _searchService: SearchService,
		private router: Router
	) {}

	hideSearch(){
		this._searchService.hideSearch();
	}

	onLogout() {
		this.authService.logout();
		this.router.navigateByUrl('/');
	}

	isLoggedIn() {
		return this.authService.isLoggedIn();
	}
}
