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

    public userProfileHide: boolean;
    private userProfileHideSub: Subscription;

    constructor(private _userService: UserService, private _search: SearchService, private  _moviesInfo: MovieService){}

    ngOnInit() {
        this.userProfileHideSub = this._userService.profileHide$.subscribe(hide => this.userProfileHide = hide);
        alert (this.userProfileHide);
    }

    ngOnDestroy() {
        this.userProfileHideSub.unsubscribe();
    }

    getUserInfo(user_id){
        this._userService.showUserProfile(user_id);
        this._moviesInfo.hideMovie();
        this._search.toggleHide();
    }
}