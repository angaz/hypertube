import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class YtsService{
    private searchUrl: string;
    private movies: any[];
    private page = 1;

    constructor(private _http:Http){
    }

    defaultOutput(){
        this.searchUrl = "https://yts.ag/api/v2/list_movies.json";
        return this._http.get(this.searchUrl)
        .map(res => res.json());
    }

    getList() {
        this._http.get(`/api/movies/${this.page++}`)
            .map(res => res.json())
            .subscribe(res => {
                for (let movie in res) {
                    if (res.hasOwnProperty(movie)) {
                        if (this.movies.indexOf(res[movie]) === -1) {
                            this.movies.push(res[movie]);
                        }
                    }
                }
            });
    }
}