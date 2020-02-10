#!/usr/bin/env node

const manifest = require(__dirname + '/../app/manifest.chrome.json');
console.log(manifest.version);
