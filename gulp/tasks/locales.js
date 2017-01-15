// $.request(`https://api.phraseapp.com/api/v2/projects/ea649a80b7be5f38d2a1a832d1b61c06/?callback=&access_token=577f70bfcb8d02ba83ec2579215e6dccf1d3a0478e3092e6134e66b8921cdfda`, function (error, response, body) {
// $.request(`https://api.phraseapp.com/api/v2/projects/ea649a80b7be5f38d2a1a832d1b61c06/locales?callback=&access_token=577f70bfcb8d02ba83ec2579215e6dccf1d3a0478e3092e6134e66b8921cdfda`, function (error, response, body) {
// $.request(`https://api.phraseapp.com/api/v2/projects/ea649a80b7be5f38d2a1a832d1b61c06/locales/f0a218caa7eab69633ab671aed326f88?callback=&access_token=577f70bfcb8d02ba83ec2579215e6dccf1d3a0478e3092e6134e66b8921cdfda`, function (error, response, body) {

// include_empty_translations
// format_options

// https://api.phraseapp.com/api/v2/projects/ea649a80b7be5f38d2a1a832d1b61c06/locales/f0a218caa7eab69633ab671aed326f88/download?file_format=json&callback=&access_token=577f70bfcb8d02ba83ec2579215e6dccf1d3a0478e3092e6134e66b8921cdfda



// gulp.task(`phrase:get:locales`, [], function () {
//     return
// });

// gulp.task(`phrase:get:locale`, [`phrase:get:locales`], function () {
//     JSON.parse(locales).map(function (locale) {
//         $.request(
//             `https://` + api.url +
//             `/projects/` + api.projectId +
//             `/locales/` + locale.id +
//             `/download?file_format=` + api.fileFormat +
//             `&callback=&access_token=` + api.accessToken)
//             .pipe($.vinylSourceStream(`` + locale.name + `.json`))
//             .pipe(gulp.dest(`./app/assets/data/`));
//     });

// });




import {watch, src, dest, series} from 'gulp';

import {debug} from 'webrew-helpers-log';

import {obj} from 'stream-combiner2';
import vinylSourceStream from 'vinyl-source-stream';
import rename from 'gulp-rename';
import newer from 'gulp-newer';
import {get, post, patch} from 'request';

import config from './../config';


let locales = [];

export function localesList() {
    return obj([

        post(
            `https://${config.api.url}/projects/${config.api.projectId}/uploads?&callback=&access_token=${config.api.accessToken}&name=sv&code=sv-SE`, { name: `interface` }, function (x, y, body) {
                locales = body;
            }),
        vinylSourceStream(`locales.json`),
        dest(config.data)

        // ]).on(`error`, console.error.bind(console));
        //     post(
        //         `https://${config.api.url}/projects/${config.api.projectId}/locales?&callback=&access_token=${config.api.accessToken}&name=sv&code=sv-SE`, {name: `interface`}, function (x, y, body) {
        //             locales = body;
        //         }),
        //         vinylSourceStream(`locales.json`)
        //         dest(config.data)

        // ]).on(`error`, console.error.bind(console));
        // return obj([
        //     get(
        //         `https://${config.api.url}/projects/${config.api.projectId}/locales?&callback=&access_token=${config.api.accessToken}`, function (x, y, body) {
        //             locales = body;
        //         }),
        //         vinylSourceStream(`locales.json`),
        //         dest(config.data)

    ]).on(`error`, console.error.bind(console));
}

localesList.description = `Angular components scripts transpile.`;

