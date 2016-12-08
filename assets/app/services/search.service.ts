import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class SearchService {
	public hide: boolean = true;

	constructor(private _http: Http) {
	}

	public fetchingMovies = false;

	toggleHide() {
		this.hide = !this.hide;
	}

	fetchMoviesList() {
		return new Promise<any>(resolve => {
			this.fetchingMovies = true;
			this._http.get('/api/get_movies')
				.map(res => res.json())
				.subscribe(res => {
					resolve(res.map(movie => {
						movie.lower_title = movie.title.toLowerCase().replace(/[^a-z\-\s]/g, '');
						return movie;
					}));
					this.fetchingMovies = false;
				});
		});
	}
}