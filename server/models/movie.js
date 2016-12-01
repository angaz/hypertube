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
    belongs_to_collection: {type: Schema.Types.Mixed},      // TMDB collection
    title: {type: String, required: true},                  // Movie title
    slug: {type: String, required: true},                   // Lowercase title, whitespace to '-', special characters removed, ending with release year
    lowerTitle: {type: String, required: true},             // Movie title in lower case for faster searching
    vote_average: {type: Number},                           // TMDB Average vote
    vote_count: {type: Number},                             // TMDB vpte count
    runtime: {type: Number, required: true},                // Runtime in minutes
    genres: {type: [String]},                               // Array of strings of genre names
    overview: {type: String},                               // short summary of the movie
    language: {type: String},                               // Spoken Language
    mpa_rating: {type: String},                             // MPA rating
    backdrop_path: {type: String},                          // Location of backdrop, prepend http://image.tmdb.org/t/p
    poster_path: {type: String},                            // Location of the poster, prepend http://image.tmdb.org/t/p
    release_date: {type: String},                           // Date of release in theaters
    revenue: {type: Number},                                // Revenue in USD
    tagline: {type: String},                                // Movie tagline
    popularity: {type: Number},                             // Movie's popularity
    subtitles: {type: [Schema.Types.Mixed]},                // Array of subtitles, contains language and subtitle path
    cast: {type: [Schema.Types.Mixed]},                     // Movie main cast members
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