module.exports = {
    builder: 'zuul-builder-webpack',
    webpack: require('./webpack.config.js'),
    ui: 'mocha-bdd',
    browsers: [
        {
            name: 'chrome',
            version: 'latest'
        }
    ]
};