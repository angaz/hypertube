import { Component , Input} from '@angular/core';
import { MovieService } from '../../services/movies.service';

@Component ({
  selector: 'hypertube-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css']
})
export class SeriesComponent {
  isHide = false;
  @Input ('isSearchHide') isSearchHide:boolean;
  selectedMovie: Object = {
    'title' : "No Title has been set...",
  };
  defaultMovies: any;

  constructor(private _ytsService:MovieService) {
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
