const package = require('./package.json');
const fs = require('fs');
const joinPath = require('util.join').join;
const fsExtra = require('fs-extra');

const { name, version, description, dependencies, license, main, author, keywords } = package;

const libraryPackage = {
    name,
    version,
    description,
    peerDependencies: dependencies,
    license,
    main,
    author,
    keywords,
    publishConfig: {
        access: "public"
    },
    bin: {
        'cleanup-translation-files': './bin/index.js',
        [name]: './bin/index.js'
    }
}

fs.writeFileSync(
    joinPath(
        'dist',
        'package.json'
    ),
    JSON.stringify(
        libraryPackage,
        null,
        2
    )
)

const binFileContent = `#!/usr/bin/env node
require('${joinPath('..', main)}');`
fsExtra.ensureDir('dist/bin');
fs.writeFileSync(
    'dist/bin/index.js',
    binFileContent
)

fs.writeFileSync(
    'dist/LICENCE',
    fs.readFileSync('LICENCE')
)
fs.writeFileSync(
    'dist/README.MD',
    fs.readFileSync('README.md')
)
