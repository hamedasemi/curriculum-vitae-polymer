export let config = {
    cwd: `./..`,
    polymer: {
        scripts: [
            `./src/**/*.js`
        ],
        styles: [
            `./src/**/*.css`
        ],
        markups: [
            `./src/**/*.html`
        ]
    },
    angular: {
        scripts: [
            `./src/+(app)/**/*.js`
        ],
        styles: [
            `./src/+(app)/**/*.css`
        ],
        markups: [
            `./src/+(app)/**/*.html`,
            `./src/index.html`
        ]
    },
    data: `./dist/assets/data`,
    api: {
        url: `api.phraseapp.com/api/v2`,
        projectId: `2bb0a495c85a79d155bf38af80448e60`,
        fileFormat: `nested_json`,
        accessToken: `9220d73a14d176f6a687f45913a0cf64583a9b5c25b0a9436ad3c036396ffd11`
    },
    css: [
        `./src/+(app|app/core)/**/*.css`],
    client: {
        test: {
            unit: [
                `./src/**/*.unit.test.js`
            ],
            web: [
                `./src/**/*.web.test.js`
            ],
            e2e: [
                `./src/+(app|app/core|app/shared)/**/*.e2e.test.js`,
                `./src/index.e2e.test.js`
            ]
        }
    },
    server: {
        test: {
            unit: [
                `./server/**/*.test.js`
            ]
        }
    },
    assets: `client/assets/**/*.*`,
    libs: `client/assets/libs/**/*.{html, js}`,
    fonts: `client/assets/fonts/**/*.{ttf, otf}`,
    icons: `client/assets/icons/**/*.{svg}`,
    images: `client/assets/images/**/*.{jpeg, jpg, png}`,
    vectors: `client/assets/vectors/**/*.{svg}`,
    root: `client/assets/root/**/*.*`,
    src: `./src`,
    dest: `./dist`
};

export default config;
