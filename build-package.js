const path = require('path');
const package = require('./package.json');
const fs = require('fs');

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
    bin: {
        'cleanup-translation-files': './bin/index.js',
        [name]: './bin/index.js'
    }
}

fs.writeFileSync(
    path.join(
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
require('${path.join('..', main)}');`
if(!fs.existsSync('dist/bin')){
    fs.mkdirSync('dist/bin');
}
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
