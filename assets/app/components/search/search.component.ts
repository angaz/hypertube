import {Component, Input} from '@angular/core';
import {SearchService} from "../../services/search.service";

@Component({
    selector: 'hypertube-search',
    templateUrl: 'search.component.html',
    styleUrls: ['search.component.css']
})
export class SearchComponent {
    constructor  (private _searchService: SearchService){}

    getHide(){
        return this._searchService.getHide();
    }
}
