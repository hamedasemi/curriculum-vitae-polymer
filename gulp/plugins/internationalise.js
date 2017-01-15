import through from 'through2';
import gutil from 'gulp-util';
import traverse from 'traverse';
import lodash from 'lodash';

let PluginError = gutil.PluginError;

let all = {};
let allFile;

// consts
const PLUGIN_NAME = `gulp-internationalise`;

function transformStream(language) {
    var stream = through(function (chunk, enc, cb) {

        let parsedString = JSON.parse(chunk);
        let transformedString;
        transformedString = traverse(parsedString).map(function (value) {
            if (this.isLeaf) {
                this.update({ [language]: value }, true);
            }
        });
        // console.log(JSON.stringify(transformedString));
        cb(null, JSON.stringify(transformedString));
    });
    return stream;
}

function mergeStream() {
    var stream = through(function (chunk, enc, cb) {

        lodash.merge(all, JSON.parse(chunk));
        cb(null, chunk);
    });
    return stream;
}

export function gulpInternationalise(options) {

    var stream = through.obj(function (file, enc, cb) {
        if (file.isBuffer()) {
            this.emit(`error`, new PluginError(PLUGIN_NAME, `Buffers not supported!`));
            return cb();
        }

        if (file.isStream()) {
            allFile = file.clone({contents: false});
            let language = file.stem.split(/\./g).reverse()[0];
            var streamer = transformStream(language);
            var merge = mergeStream();
            streamer.on(`error`, this.emit.bind(this, `error`));
            file.contents = file.contents.pipe(streamer).pipe(merge);
        }

        this.push(file);

        cb();
    }, function(cb){
        allFile.basename = options.fileName;
        allFile.contents = new Buffer(JSON.stringify(all));
        this.push(allFile);
        cb();
    });

    stream.on(`end`, function () {
    });

    return stream;
}

export default gulpInternationalise;