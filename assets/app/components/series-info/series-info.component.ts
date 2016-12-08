import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
	selector: 'movies-info',
	templateUrl: 'series-info.component.html',
	styleUrls: ['series-info.component.css']
})
export class MoviesInfoComponent {
	@Input('selectedMovie') movie: string;
	@Output() close: EventEmitter<any> = new EventEmitter();

	movieProfileClose() {
		this.close.emit(null);
	}
}