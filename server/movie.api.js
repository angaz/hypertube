/**
 * Created by adippena on 11/23/16.
 */
"use strict";
const ytsAPI = require('./yts.api');
const tmdbAPI = require('./tmdb.api');
const Movie = require('./models/movie');
const iso639 = require('iso-639-1').default;

function cleanArray(actual) {
    let newArray = [];
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}

function update() {
    return new Promise((resolve, reject) => {
        newMovie(1)
            .then(bigBagOMovies => resolve(bigBagOMovies))
            .catch(error => reject(error));
    });
}

function newMovie(page) {
    let promises = [];
    return new Promise((resolve, reject) => {
        ytsAPI.getPage(page).then(yifyPage => {
            console.log(`Get page ${page}\t${new Date()}`);
            if (yifyPage === undefined) {
                return reject('getPage returned undefined');
            }

            yifyPage.forEach(yify => {
                promises.push(new Promise((success, problem) => {
                    Movie.find({'yify_id': yify.id}, '*', (error, movie) => {
                        if (error) {
                            return problem({
                                message: 'Mongoose Movie find error',
                                error:error
                            });
                        }

                        if (movie[0] === undefined) {
                            tmdbAPI.findByImdb(yify.imdb_code).then(tmdb => {
                                if (tmdb === undefined) {
                                    console.log(`findByImdb returned undefined, skipping value ${yify.imdb_code}`);
                                    return success(null);
                                }

                                if (yify.torrents === undefined) {
                                    console.log(`yify.torrents undefined, skipping value ${yify.imdb_code}`);
                                    return success(null);
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
                                            health: (torrent.seeds/(torrent.peers) ? (torrent.peers * 2) : 10)
                                        });
                                    }
                                });

                                let newMovie = {
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
                                };

                                success(new Movie(newMovie));
                            }).catch(error => {
                                return problem({
                                    message: 'findMovieByImdb error',
                                    error: new Error(error).stack
                                });
                            });
                        } else {
                            success(null);
                        }
                    });
                }));
            });

            Promise.all(promises)
                .then(bagOmovies => {
                    bagOmovies = cleanArray(bagOmovies);
                    if (bagOmovies.length > 0) {
                        Movie.insertMany(bagOmovies, (error, inserted) => {
                            if (error) {
                                return reject({
                                    message: 'insert error',
                                    error: error
                                });
                            }
                            setTimeout(() => {
                                newMovie(page + 1)
                                    .then(anotherBagOMovies => {
                                        console.log(inserted + anotherBagOMovies);
                                        resolve(inserted + anotherBagOMovies);
                                    }).catch(error => reject(error));
                            }, 2500);
                        });
                    } else {
                        console.log('resolving empty array');
                        resolve(0);
                    }
                })
                .catch(error => {
                    return reject({
                        message: 'promise all error',
                        error: error
                    });
                });
        }).catch(error => {
            return reject(error);
        });
    });
}

module.exports = {
    update: update
};