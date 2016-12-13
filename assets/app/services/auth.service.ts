import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs";
import {User} from "../models/user";
import 'rxjs/Rx';

@Injectable()
export class AuthService {
	constructor(private http: Http) {
	}

    signup(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers ({'Content-Type': 'application/json'});
        return this.http.post('/users/signup', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    signin(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers ({'Content-Type': 'application/json'});
        return this.http.post('/users/signin', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    sendReset(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers ({'Content-Type': 'application/json'});
        return this.http.post('/users/reset', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    resetPassword(validate: string) {
        return this.http.get('/users/reset/request/${validate}')
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
    }

    logout() {
        localStorage.clear();
    }

	isLoggedIn() {
		return localStorage.getItem('token') !== null;
	}
}
