"use strict";

const request = require('request');
const cheerio = require('cheerio');
const magnet = require('magnet-uri');

const base = "http://eztv.ag";

function strToBytes(str) {
    if (!str){
        return 0;
    }

    let scale = 0;
    switch(str.substr(-2)) {
        case 'KB' :
            scale = 1024;
            break;
        case 'MB' :
            scale = 1048576;
            break;
        case 'GB' :
            scale = 1073741824;
    }

    return parseFloat(str) * scale;
}

function getShows() {
    return new Promise((resolve, reject) => {
        request(`${base}/showlist/`, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let $ = cheerio.load(body);
                let series = [];

                $('.forum_header_border .thread_link').each((i, elem) => {
                    let href = $(elem).attr('href').replace('/shows/', '').split('/');
                    series.push({
                        id: href[0],
                        slug: href[1],
                        name: $(elem).text()
                    });
                });
                resolve(series);
            } else {
                reject({
                    message: 'EZTV getSeries error',
                    error: new Error(error),
                    code: response.statusCode
                });
            }
        });
    });
}

/*function grabTorrents(data) {
  var $ = cheerio.load(data.body);
  var torrents = [];
  $('table tr.forum_header_border').each(function(i, elem) {
    var el = cheerio.load(elem);
    var mag = magnet.decode(el(".magnet").attr('href'));
    var epinfo = el(".epinfo");
    var size = epinfo.attr("title").replace(epinfo.text(), '').match(/\(([^\)]*)\)/)[1];
    var seeds = el(".forum_thread_post:nth-last-child(2)");
    var released = el(".forum_thread_post:nth-last-child(3)");
    size = strToBytes(size);
    torrents.push({
      title: el(".epinfo").text(),
      link: base + el(".epinfo").attr('href'),
      magnet: el(".magnet").attr('href'),
      hash: mag.infoHash,
      size: size,
      seeds: Number(seeds.text().replace(/\D/, '')),
      released: released.text()
    });
  });
  return torrents;
}*/

function getShowInfo(series) {
    return new Promise((resolve) => {
        request(`${base}/shows/${series.id}/${series.slug}/`, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let $ = cheerio.load(body);
                let showInfo = {};

                showInfo.imdb = $('.show_info_rating_score > div > a').attr('href').match(/tt[0-9]+/)[0];
                console.log(showInfo.imdb);
                request(`${base}/search/${series.slug}`, (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        let $ = cheerio.load(body);
                        $('table tr.forum_header_border').each((i, elem) => {
                            let href = $(elem).find(".epinfo").attr('href');
                            console.log(`${base}${href}`);
                            request(`${base}${href}`, (error, response, body) => {
                                if (!error && response.statusCode == 200) {
                                    let $ = cheerio.load(body);
                                    let number = $('h2 > u').text().match(/[0-9]{1,}E[0-9]{1,}/);
                                    if (number) {
                                        number = number[0].split('E');
                                        let magnet = $('.magnet');
                                        if (magnet) {
                                            let hash = magnet.attr('href');
                                            if (hash) {
                                                hash = hash.match(/[0-9a-f]{20}/i);
                                            } else {
                                                console.log(`No hash ${number}`);
                                            }
                                            if (hash) {
                                                hash = hash[0];
                                                console.log(number, hash);
                                            }
                                        } else {
                                            console.log(`No hash ${number}`);
                                        }
                                    } else {
                                        console.log(`No number ${href}`);
                                    }
                                } else {
                                    console.log('reject');
                                    throw new Error({
                                        error: error,
                                        status: response.status
                                    });
                                }
                            });
                        });
                    } else {
                        console.log('reject');
                        throw new Error({
                            error: error,
                            status: response.status
                        });
                    }
                });
                resolve();
            } else {
                console.log('reject');
                throw new Error({
                    message: 'eztv getEpisodes error',
                    error: error,
                    code: response.statusCode
                });
            }
        });
    });
}

/*module.exports.seriesTorrents = function getTorrents(show) {
  return got(base + show.slug).then(grabTorrents);
};*/

/*module.exports.search = function search(query) {
  return got(base + '/search/' + encodeURIComponent(query)).then(grabTorrents);
};*/

module.exports = {
    getShows: getShows,
    getShowInfo: getShowInfo
};
