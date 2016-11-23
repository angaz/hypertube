/**
 * Created by adippena on 11/23/16.
 */
"use strict";
const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const schema = new Schema({
    yify_id: {
        type: Number,
        required: true,
        index: true,
        unique: true
    },                                                      // YIFY ID number
    tmdb_id: {type: Number, required: true, unique: true},  // The Movie DB (TMDB) ID number
    imdb_id: {type: String, required: true, unique: true},  // IMDB ID number
    belongs_to_collection: {type: Schema.Types.Mixed},                 // TMDB collection
    title: {type: String, required: true},                  // Movie title
    vote_average: {type: Number, required: true},           // TMDB Average vote
    vote_count: {type: Number, required: true},             // TMDB vpte count
    runtime: {type: Number, required: true},                // Runtime in minutes
    genres: {type: [String], required: true},               // Array of strings of genre names
    overview: {type: String, required: true},               // short summary of the movie
    language: {type: String, required: true},               // Spoken Language
    mpa_rating: {type: String, required: true},             // MPA rating
    backdrop_path: {type: String, required: true},          // Location of backdrop, prepend http://image.tmdb.org/t/p
    poster_path: {type: String, required: true},            // Location of the poster, prepend http://image.tmdb.org/t/p
    release_date: {type: String, required: true},           // Date of release in theaters
    revenue: {type: Number, required: true},                // Revenue in USD
    tagline: {type: String, required: true},                // Movie tagline
    popularity: {type: Number, required: true},             // Movie's popularity
    torrents: {type: Schema.Types.Mixed, required: true}
    /**
     * torrents: {
     *    hash: String    ('9D5F7E2F1B45ADC6D6B8C2028249DBF460F45B98'),
     *    quality: String ('720'/'1080'),
     *    size: Number    ('730259784'),
     *    health: Number  (seeds/peers/2: 1.7336)
     * }
     */
});

schema.plugin(unique);

module.exports = mongoose.model('Movie', schema);