import { Component } from '@angular/core';
import { SearchService } from "../../services/search.service";
import { MovieService } from "../../services/movies.service";

@Component({
    selector: 'hypertube-search',
    templateUrl: 'search.component.html',
    styleUrls: ['search.component.css']
})
export class SearchComponent {
    constructor  (private _searchService: SearchService, private _movieService: MovieService) {
        this._searchService.fetchMoviesList()
            .then(bagOMovies => {
                this.moviesList = bagOMovies.map(movie => {
                    return movie.lowerTitle = movie.title.toLowerCase();
                });
            })
            .catch(error => console.log(`Error occurred fetching movies list ${error}`));
    }

    private query: String = '';
    private moviesList = [];
    private filteredList = [];

    filter() {
        if (this.query.length > 0 && !this._searchService.fetchingMovies) {
            this.filteredList = this.moviesList.filter(movie => {
                return movie.lowerTitle.indexOf(this.query.toLowerCase()) > -1;
            });
        } else {
            this.filteredList = [];
        }
    }

    selectMovie(movie) {
        this._movieService.showMovie(movie.imdb_id);
        this._searchService.hide = true;
    }
}
