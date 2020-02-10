#!/usr/bin/env node

const manifest = require(__dirname + '/../src/manifest.chrome.json');
console.log(manifest.version);
