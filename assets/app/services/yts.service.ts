import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class YtsService {
    private movies: any[] = [];
    private page = 1;

    constructor(private _http:Http) {}

    fetchList() {
        return new Promise<any>((resolve) => {
            this._http.get(`/api/movies/${this.page++}`)
                .map(res => res.json())
                .subscribe(res => {
                    for (let movie in res) {
                        if (res.hasOwnProperty(movie)) {
                            if (this.movies.indexOf(res[movie]) === -1) {
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
}