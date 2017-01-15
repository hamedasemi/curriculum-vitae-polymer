import {src, dest} from 'gulp';
import {obj} from 'stream-combiner2';

import internationalize from './../plugins/internationalise';

import config from './../config';

export function internationalise() {
    return obj([
        src(`${config.src}/**/locale.*.json`, { buffer: false }),
        internationalize({
            fileName: `locales.all.json`
        }),
        dest(config.dest)

    ]).on(`error`, console.error.bind(console));
}

internationalise.description = `Internationalize locale files.`;