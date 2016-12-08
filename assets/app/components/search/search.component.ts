import {Component} from '@angular/core';
import {SearchService} from "../../services/search.service";
import {MovieService} from "../../services/movies.service";

@Component({
	selector: 'hypertube-search',
	templateUrl: 'search.component.html',
	styleUrls: ['search.component.css']
})
export class SearchComponent {
	private query: String = '';
	private moviesList = [];
	private filteredList = [];

	constructor(private _searchService: SearchService, private _movieService: MovieService) {
		this._searchService.fetchMoviesList()
			.then(bagOMovies => {
				this.moviesList = bagOMovies;
				this.filter();
			})
			.catch(error => console.log(`Error occurred fetching movies list ${error}`));
	}

	filter() {
		let query = this.query.toLowerCase().trim();
		if (this.query.length > 0 && this.moviesList.length > 0 && !this._searchService.fetchingMovies) {
			this.filteredList = this.moviesList
				.filter(movie => movie.lower_title.indexOf(query) > -1)
				.map(movie => {
					movie.strong_title = movie.title.replace(new RegExp(query, 'gi'), '<strong>$&</strong>');
					return movie;
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
