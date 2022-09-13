#!/usr/bin/env node

const manifest = require(__dirname + '/../src/manifest.chrome.v3.json');
console.log(manifest.version);
