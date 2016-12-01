import { Component } from '@angular/core';
import { MovieService } from "../../services/movies.service";
import { SearchService } from "../../services/search.service";
import { UserService } from "../../services/user.service";
import { Subscription } from "rxjs";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [MovieService, SearchService, UserService]
})
export class AppComponent {
    private userProfileHide = true;
    private userProfileHideSub: Subscription;

    constructor(private _user: UserService){}
    ngOnInit() {
        this.userProfileHideSub = this._user.profileHide$.subscribe(hide => this.userProfileHideSub = hide);
    }

    ngOnDestroy() {
        this.userProfileHideSub.unsubscribe();
    }
}
