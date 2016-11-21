import { Component } from '@angular/core';
import { YtsService } from '../../services/yts.service';

@Component ({
  selector: 'hypertube-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent {
  isHide = false;
  selectedMovie: Object = {
    'title' : "No Title has been set...",
  };
  defaultMovies: any;

  constructor(private _ytsService:YtsService){
    this._ytsService.defaultOutput().subscribe(res => {
      this.defaultMovies = res.data.movies;
    });
  }

  movieProfileClose(){
    this.isHide = false;
  }

  movieUpdateInfo(movieObject: any){
    this.selectedMovie = movieObject;
  }
}