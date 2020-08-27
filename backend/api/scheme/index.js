module.exports = function lol() {
    const {fileLoader, mergeTypes} = require("merge-graphql-schemas");
    const path = require('path');

    const rootDir = path.join(__dirname, '/../api/scheme');
    console.log(rootDir);
    const schemes = fileLoader(rootDir, {recursive: true});
    console.log(schemes);
    console.log([mergeTypes(schemes)]);
};

const p = require('./index');

p();
