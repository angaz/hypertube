import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { User } from "../models/user";
import { BehaviorSubject } from "rxjs";

import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
    user = new User (null, null, null, null, null);

    public profileHide = new BehaviorSubject<any>(true);
    public profileHide$ = this.profileHide.asObservable();

    constructor(private _http:Http) {}

    public fetchingUser = false;

    showUserProfile(user: any) {
        if (!user)
            user = localStorage.getItem('userId');
        this._http.get(`/api/users/${user}`).map(res => res.json()).subscribe(res => {
            this.fetchingUser = true;
            this.user = res;
            this.profileHide.next(false);
        });
        this.fetchingUser = false;
    }

    hideUserProfile(){
        this.profileHide.next(true);
    }
}