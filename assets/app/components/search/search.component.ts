import {Component, Input} from '@angular/core';
import {SearchService} from "../../services/search.service";

@Component({
    selector: 'hypertube-search',
    templateUrl: 'search.component.html',
    styleUrls: ['search.component.css']
})
export class SearchComponent {
    constructor  (private _searchService: SearchService) {
        this._searchService.fetchMoviesList()
            .then(bagOMovies => this.moviesList = bagOMovies)
            .catch(error => console.log(`Error occurred fetching movies list ${error}`));
    }

    private query: String = '';
    private moviesList = [];
    private filteredList = [];


    getHide(){
        return this._searchService.getHide();
    }

    filter() {
        if (this.query.length > 0 && !this._searchService.fetchingMovies) {
            this.filteredList = this.moviesList.filter((el: String) => {
                return el.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            });
        } else {
            this.filteredList = [];
        }
    }
}
