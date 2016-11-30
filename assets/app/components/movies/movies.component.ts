import { Component } from '@angular/core';
import { MovieService } from '../../services/movies.service';
import { Subscription } from "rxjs";

@Component ({
    selector: 'hypertube-movies',
    templateUrl: './movies.component.html',
    styleUrls: ['./movies.component.css']
})
export class MoviesComponent {
  private defaultMovies = [];
  private infoHide = true;
  private infoHideSub: Subscription;

  constructor(private _movieService:MovieService) {
    this._movieService.getNextList()
        .then(movies => {
            this.defaultMovies = movies;
        });
  }

  onScroll() {
      this._movieService.getNextList()
          .then(movies => {
              this.defaultMovies = movies;
          });
  }

    ngOnInit() {
        this.infoHideSub = this._movieService.infoHide$
            .subscribe(hide => this.infoHide = hide);
    }

    ngOnDestroy() {
        this.infoHideSub.unsubscribe();
    }
}