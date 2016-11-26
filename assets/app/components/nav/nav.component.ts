import { Component, Input, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component ({
  selector: 'hypertube-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent{
    constructor(private _searchService: SearchService){}

    hideSearch(){
        this._searchService.hideSearch();
    }
}
