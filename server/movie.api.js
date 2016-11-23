/**
 * Created by adippena on 11/23/16.
 */
"use strict";
// const mongoose = require('mongoose');

const ytsAPI = require('./yts.api');
const tmdbAPI = require('./tmdb.api');
const Movie = require('./models/movie');
const iso639 = require('iso-639-1').default;

function update() {
    return new Promise((resolve, reject) => {
        let page = 1;
        ytsAPI.getPage(page).then(yify => {
            if (yify === undefined) {
                return reject('getPage returned undefined');
            }
            tmdbAPI.findByImdb(yify.imdb_code).then(tmdb => {
                // let bulk = Movie.collection.initializeUnorderedBulkOp();

                let genres = tmdb.genres.map(genre => {
                    delete genre.id;
                    return genre;
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

                new Movie({
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
                    mpa_rating: yify.mps_rating,
                    backdrop_path: tmdb.backdrop_path,
                    poster_path: tmdb.poster_path,
                    release_date: tmdb.release_date,
                    revenue: tmdb.revenue,
                    tagline: tmdb.tagline,
                    popularity: tmdb.popularity,
                    torrents: torrents
                }).save().then(saved => resolve(saved));

                /*moviesList.forEach(movie => {

                 });*/
            });
        });
    });
}

module.exports = {
    update: update
}