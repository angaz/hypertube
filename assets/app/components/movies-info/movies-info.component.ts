import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'movies-info',
    templateUrl: 'movies-info.component.html',
    styleUrls: ['movies-info.component.css']
})
export class MoviesInfoComponent{
    @Input('selectedMovie') movie:string;
    @Output() close: EventEmitter<any> = new EventEmitter();

    movieProfileClose(){
        this.close.emit(null);
    }
}