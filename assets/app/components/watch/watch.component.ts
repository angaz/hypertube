import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { YtsService } from '../../services/yts.service';
import {isNullOrUndefined} from "util";

@Component ({
  selector: 'hypertube-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css']
})
export class WatchComponent {
  private subscription: Subscription;
  movie: any = {
      poster: null,
      src: null
  };
  captions: any = [{
      language: {
          code: null,
          nativeName: null
      },
      src: null
  }];
  noMovie: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private _ytsService:YtsService) {}

  ngOnInit() {
    // subscribe to router event
    this.subscription = this.activatedRoute.params.subscribe(
        (param: any) => {
            let watch = this._ytsService.findBySlug(param.name);
            console.log(watch);
            if (isNullOrUndefined(watch)) {
                return this.noMovie = true;
            }
            this.movie = {
                poster: watch.backdrop_path,
                src: `/api/watch/${watch.torrents[0].hash}`,
            };
            this._ytsService.getCaptions(watch.yify_id)
                .then(captions => {this.captions = captions; console.log(captions);});
        });
  }

  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }
}