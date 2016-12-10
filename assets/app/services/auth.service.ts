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
        return this.http.post('http://localhost:4200/users/reset', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

/*
    receiveReset(user: User) {
        if (typeof movie === 'string') {
            this._http.get(`/api/get_movie/${movie}`)
                .map(res => res.json())
                .subscribe(res => {
                    this.selectedMovie.next(res);
                    this.infoHide.next(false);
                });
        } else {
            this.selectedMovie.next(movie);
            this.infoHide.next(false);
        }
    }

    getResetRequest(email: string) {
        return new Promise<any>((resolve) => {
            this._http.get(`/api/captions/${imdb}`)
                .map(res => res.json())
                .subscribe(res => {
                    resolve(res);
                });
        });
    }

    */

    resetRequest() {
        //const body = JSON.stringify(user);
        const headers = new Headers ({'Content-Type': 'application/json'});
        console.log("auth service entered");
        return this.http.get('http://localhost:4200/users/reset/request', {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    resetPassword() {
        //const body = JSON.stringify(user);
        const headers = new Headers ({'Content-Type': 'application/json'});
        console.log("auth service entered");
        return this.http.get('http://localhost:4200/users/reset/request', {headers: headers})
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
