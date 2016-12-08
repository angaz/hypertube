import {Component} from '@angular/core';
import {Subscription} from "rxjs";
import {MovieService} from "../../services/movies.service";

@Component({
	selector: 'movies-info',
	templateUrl: 'movies-info.component.html',
	styleUrls: ['movies-info.component.css']
})
export class MoviesInfoComponent {
	private movie: any = {};
	private movieSub: Subscription;

	constructor(private _movieService: MovieService) {
	}

	ngOnInit() {
		this.movieSub = this._movieService.movie$
			.subscribe(movie => this.movie = movie);
	}

	ngOnDestroy() {
		this.movieSub.unsubscribe();
	}

	movieProfileClose() {
		this.movie = {};
	}
}