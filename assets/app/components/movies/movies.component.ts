import { Component , Input} from '@angular/core';
import { YtsService } from '../../services/movies.service';

@Component ({
    selector: 'hypertube-movies',
    templateUrl: './movies.component.html',
    styleUrls: ['./movies.component.css']
})
export class MoviesComponent {
  isHide = false;
  @Input ('isSearchHide') isSearchHide:boolean;
  selectedMovie: Object = {
    'title' : "No Title has been set...",
  };
  defaultMovies: any;

  constructor(private _ytsService:YtsService) {
    this._ytsService.getNextList()
        .then(movies => {
            this.defaultMovies = movies;
        });
  }

  movieProfileClose() {
    this.isHide = false;
  }

  movieUpdateInfo(movieObject: any) {
    this.selectedMovie = movieObject;
  }

  onScroll() {
      this._ytsService.getNextList()
          .then(movies => {
              this.defaultMovies = movies;
          });
  }
}