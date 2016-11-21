import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class YtsService{
    private searchUrl: string;

    constructor(private _http:Http){
    }

    defaultOutput(){
        this.searchUrl = "https://yts.ag/api/v2/list_movies.json";
        return this._http.get(this.searchUrl)
        .map(res=> res.json());
    }
}