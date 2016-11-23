import { Injectable} from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class SearchService {
    hide:boolean = true;

    constructor(private _http:Http) {}

    getHide(){
        return this.hide;
    }

    hideSearch(){
        this.hide = !this.hide;
        return this.hide;
    }

}