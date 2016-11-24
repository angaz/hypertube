/**
 * Created by adippena on 11/23/16.
 */
"use strict";
const ytsAPI = require('./yts.api');
const tmdbAPI = require('./tmdb.api');
const Movie = require('./models/movie');
const iso639 = require('iso-639-1').default;

Array.prototype.compact = () => {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === undefined || this[i] === null || this[i] === [] || this[i] === '') {
            this.splice(i--, 1);
        }
    }
    return this;
};

function update() {
    return new Promise((resolve, reject) => {
        newMovie(1)
            .then(bigBagOMovies => {
                Movie.collection.insert(bigBagOMovies, (error, inserted) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(inserted.length);
                });
            })
            .catch(error => reject(error));
    });
}

function newMovie(page) {
    let promises = [];
    return new Promise((resolve, reject) => {
        ytsAPI.getPage(page).then(yifyPage => {
            console.log(`Get page ${page}`);
            if (yifyPage === undefined) {
                return reject('getPage returned undefined');
            }

            yifyPage.forEach(yify => {
                promises.push(new Promise((success, problem) => {
                    Movie.find({'yify_id': yify.id}, '*', (error, movie) => {
                        if (error) {
                            return problem(error);
                        }

                        if (movie[0] === undefined) {
                            tmdbAPI.findByImdb(yify.imdb_code).then(tmdb => {
                                if (tmdb === undefined) {
                                    return problem('findByImdb returned undefined');
                                }

                                let genres = tmdb.genres.map(genre => {
                                    return genre.name;
                                });

                                let torrents = [];
                                yify.torrents.forEach(torrent => {
                                    if (torrent.quality.match(/^(720p|1080p)$/)) {
                                        torrents.push({
                                            hash: torrent.hash,
                                            quality: torrent.quality,
                                            size: torrent.size_bytes,
                                            health: (torrent.seeds/(torrent.peers * 2))
                                        });
                                    }
                                });

                                success(new Movie({
                                    yify_id: yify.id,
                                    tmdb_id: tmdb.id,
                                    imdb_id: yify.imdb_code,
                                    belongs_to_collection: tmdb.belongs_to_collection,
                                    title: tmdb.title,
                                    vote_average: tmdb.vote_average,
                                    vote_count: tmdb.vote_count,
                                    runtime: tmdb.runtime,
                                    genres: genres,
                                    overview: tmdb.overview,
                                    language: iso639.getName(tmdb.original_language),
                                    mpa_rating: yify.mpa_rating,
                                    backdrop_path: tmdb.backdrop_path,
                                    poster_path: tmdb.poster_path,
                                    release_date: tmdb.release_date,
                                    revenue: tmdb.revenue,
                                    tagline: tmdb.tagline,
                                    popularity: tmdb.popularity,
                                    torrents: torrents
                                }));
                            }).catch(error => {
                                return problem(error);
                            });
                        }
                        success(null);
                    });
                }));
            });

            Promise.all(promises)
                .then(bagOmovies => {
                    bagOmovies = bagOmovies.compact();
                    if (bagOmovies.length > 0) {
                        newMovie(page + 1)
                            .then(anotherBagOMovies => {
                                resolve(bagOmovies.concat(anotherBagOMovies));
                            })
                            .catch(error => reject(error));
                    } else {
                        resolve([]);
                    }
                })
                .catch(error => {
                    return reject(error);
                });
        }).catch(error => {
            return reject(error);
        });
    });
}



module.exports = {
    update: update
};