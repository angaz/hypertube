import { BehaviorSubject } from "rxjs";
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class MovieService {
    private movies: any[] = [];
    private page = 1;

    /**
     * Movies Info variables
     */
    private selectedMovie = new BehaviorSubject<any>({});
    private infoHide = new BehaviorSubject<any>(true);
    public movie$ = this.selectedMovie.asObservable();
    public infoHide$ = this.infoHide.asObservable();

    constructor(private _http:Http) {}

    fetchList() {
        return new Promise<any>(resolve => {
            this._http.get(`/api/movies/${this.page++}`)
                .map(res => res.json())
                .subscribe(res => {
                    for (let movie in res) {
                        if (res.hasOwnProperty(movie)) {
                            if (this.movies.indexOf(res[movie]) === -1) {
                                res[movie].slug = `${res[movie].title.toLowerCase().replace('\'', '').replace(' ', '-')}-${res[movie].release_date.replace(/-.*/, '')}`;
                                this.movies.push(res[movie]);
                            }
                        }
                    }
                    resolve();
                });
        });
    }

    getNextList() {
        return new Promise<any>((resolve) => {
            this.fetchList()
                .then(() => resolve(this.movies));
        });
    }

    findBySlug(search: string) {
        return this.movies.find(movie => {
            return movie.slug === search;
        });
    }

    getCaptions(imdb: string) {
        return new Promise<any>((resolve) => {
            this._http.get(`/api/captions/${imdb}`)
                .map(res => res.json())
                .subscribe(res => {
                    resolve(res);
                });
        });
    }

    /**
     * Movie Info functions
     */
    showMovie(movie: any) {
        if (typeof movie === 'string') {
            this._http.get(`/api/get_movie/${movie}`)
                .map(res => res.json())
                .subscribe(res => {
                    this.selectedMovie.next(res);
                    this.infoHide.next(false);
                });
        } else {
            this.selectedMovie.next(movie);
            this.infoHide.next(false);
        }
    }

    hideMovie() {
        this.infoHide.next(true);
    }
}