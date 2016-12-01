import { Injectable} from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class UserService {
    public profileHide: boolean = true;

    constructor(private _http:Http) {}

    public fetchingUser = false;

    profileToggle() {
        this.profileHide = !this.profileHide;
    }

    fetchUserInfo(user_id) {
        return new Promise<any>(resolve => {
            this.fetchingUser = true;
            this._http.get('/api/users/' + user_id)
                .map(res => res.json())
                .subscribe(res => {
                    resolve(res);
                    this.fetchingUser = false;
                });
        });
    }
}