import { watch, src, dest, series } from 'gulp';

import {debug} from 'webrew-helpers-log';

import { obj } from 'stream-combiner2';
import rename from 'gulp-rename';
import newer from 'gulp-newer';
import babel from 'gulp-babel';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import nested from 'postcss-nested';
import customProperties from 'postcss-custom-properties';
import apply from 'postcss-apply';
import customMedia from 'postcss-custom-media';
import cssMqpacker from 'css-mqpacker';
import polymerPostcss from 'gulp-polymer-postcss';
import polymerBabel from 'gulp-polymer-babel';

import config from './../config';
import sharedConfig from './../../src/config.json';

/**
 * ------------------------------------------------------------
 * Angular angulars
 * ------------------------------------------------------------
 */

export function angularScriptTranspile() {
    return obj([
        src(config.angular.scripts),
        newer(config.dest),
        babel({
            presets: [`es2017`],
            plugins: [
                `transform-es2015-modules-systemjs`,
                `transform-decorators-legacy`
            ]
        }),
        rename({
            extname: `.js`
        }),
        dest(config.dest)

    ]).on(`error`, console.error.bind(console));
}

angularScriptTranspile.description = `Angular angulars scripts transpile.`;


export function angularScriptTranspileWatch(next) {
    let watcher = watch(config.angular.scripts, series(angularScriptTranspile));
    watcher.on(`add`, function (path) { debug(`${path} added.`); });
    watcher.on(`change`, function (path) { debug(`${path} changed.`); });
    watcher.on(`unlink`, function (path) { debug(`${path} removed.`); });
    next();
}

angularScriptTranspileWatch.description = `Watch Angular angulars scripts transpile.`;


export function angularStyleTranspile() {
    return obj([
        src(config.angular.styles),
        newer(config.dest),
        postcss([
            autoprefixer({ browsers: [`last 2 versions`] }),
            apply, customMedia, customProperties({ variables: sharedConfig.features.customProperties }), nested, cssMqpacker
        ]),
        rename({
            extname: `.css`
        }),
        dest(config.dest)

    ]).on(`error`, console.error.bind(console));
}

angularStyleTranspile.description = `Angular angulars styles transpile.`;


export function angularStyleTranspileWatch(next) {
    let watcher = watch(config.angular.styles, series(angularStyleTranspile));
    watcher.on(`add`, function (path) { debug(`${path} added.`); });
    watcher.on(`change`, function (path) { debug(`${path} changed.`); });
    watcher.on(`unlink`, function (path) { debug(`${path} removed.`); });
    next();
}

angularStyleTranspileWatch.description = `Watch Angular angulars styles transpile.`;


export function angularMarkupTranspile() {
    return obj([
        src(config.angular.markups),
        newer(config.dest),
        polymerPostcss([
            autoprefixer({ browsers: [`last 2 versions`] }),
            apply, customMedia, customProperties({ variables: sharedConfig.features.customProperties }), nested, cssMqpacker
        ]),
        polymerBabel({
            presets: [`es2017`]
        }),
        rename({
            extname: `.html`
        }),
        dest(config.dest)

    ]).on(`error`, console.error.bind(console));
}

angularMarkupTranspile.description = `Angular angulars styles transpile.`;


export function angularMarkupTranspileWatch(next) {
    let watcher = watch(config.angular.markups, series(angularMarkupTranspile));
    watcher.on(`add`, function (path) { debug(`${path} added.`); });
    watcher.on(`change`, function (path) { debug(`${path} changed.`); });
    watcher.on(`unlink`, function (path) { debug(`${path} removed.`); });
    next();
}

angularMarkupTranspileWatch.description = `Watch Angular angulars styles transpile.`;



/**
 * ------------------------------------------------------------
 * Polymer polymers
 * ------------------------------------------------------------
 */

export function polymerScriptTranspile() {
    return obj([
        src(config.polymer.scripts),
        newer(config.dest),
        babel({
            presets: [`es2017`]
        }),
        rename({
            extname: `.js`
        }),
        dest(config.dest)

    ]).on(`error`, console.error.bind(console));
}

polymerScriptTranspile.description = `Polymer polymers scripts transpile.`;


export function polymerScriptTranspileWatch(next) {
    let watcher = watch(config.angular.scripts, series(polymerScriptTranspile));
    watcher.on(`add`, function (path) { debug(`${path} added.`); });
    watcher.on(`change`, function (path) { debug(`${path} changed.`); });
    watcher.on(`unlink`, function (path) { debug(`${path} removed.`); });
    next();
}

polymerScriptTranspileWatch.description = `Watch Polymer polymers scripts transpile.`;


export function polymerMarkupTranspile() {
    return obj([
        src(config.polymer.markups),
        newer(config.dest),
        polymerPostcss([
            autoprefixer({ browsers: [`last 2 versions`] }),
            apply, customMedia, customProperties({ variables: sharedConfig.features.customProperties }), nested, cssMqpacker
        ]),
        polymerBabel({
            presets: [`es2017`]
        }),
        rename({
            extname: `.html`
        }),
        dest(config.dest)

    ]).on(`error`, console.error.bind(console));
}

polymerMarkupTranspile.description = `Polymer polymers markups transpile.`;


export function polymerMarkupTranspileWatch(next) {
    let watcher = watch(config.polymer.markups, series(polymerMarkupTranspile));
    watcher.on(`add`, function (path) { debug(`${path} added.`); });
    watcher.on(`change`, function (path) { debug(`${path} changed.`); });
    watcher.on(`unlink`, function (path) { debug(`${path} removed.`); });
    next();
}

polymerMarkupTranspileWatch.description = `Watch Polymer polymers markups transpile.`;


export function polymerStyleTranspile() {
    return obj([
        src(config.polymer.styles),
        newer(config.dest),
        postcss([
            autoprefixer({ browsers: [`last 2 versions`] }),
            apply, customMedia, customProperties({ variables: sharedConfig.features.customProperties }), nested, cssMqpacker
        ]),
        rename({
            extname: `.css`
        }),
        dest(config.dest)

    ]).on(`error`, console.error.bind(console));
}

polymerStyleTranspile.description = `Polymer polymers markups transpile.`;


export function polymerStyleTranspileWatch(next) {
    let watcher = watch(config.polymer.styles, series(polymerStyleTranspile));
    watcher.on(`add`, function (path) { debug(`${path} added.`); });
    watcher.on(`change`, function (path) { debug(`${path} changed.`); });
    watcher.on(`unlink`, function (path) { debug(`${path} removed.`); });
    next();
}

polymerStyleTranspileWatch.description = `Watch Polymer polymers markups transpile.`;