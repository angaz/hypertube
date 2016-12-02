import { Component , OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {SearchService} from "../../services/search.service";
import {MovieService} from "../../services/movies.service";
import {Subscription} from "rxjs";

@Component ({
    selector: 'hypertube-user-profile',
    templateUrl: 'user-profile.component.html',
    styleUrls: ['user-profile.component.css']
})
export class UserProfileComponent implements OnInit{

    public userProfileHide = true;
    private userProfileHideSub: Subscription;

    constructor(private _userService: UserService, private _searchService: SearchService, private  _moviesInfo: MovieService){}

    ngOnInit() {
        this.userProfileHideSub = this._userService.profileHide$.subscribe(hide => this.userProfileHide = hide);
        this._searchService.hide = true;
    }

    ngOnDestroy() {
        this.userProfileHideSub.unsubscribe();
    }
}