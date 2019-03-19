#!/usr/bin/env node

const manifest = require(__dirname + '/../app/manifest.json');
console.log(manifest.version);

// console.log();
//
// const { spawn } = require('child_process');
// const commands = [
//   ['git', ['add', '.']],
//   ['git', ['commit', '-m', `Release v${manifest.version}`]],
//   ['git', ['tag', `v${manifest.version}`]],
//   ['git', ['push']],
//   ['git', ['push', '--tags']],
// ];
//
// (async function() {
//   for (const c of commands) {
//     await new Promise((resolve, reject) => {
//       const [command, args] = c;
//       const cmd = spawn(command, args);
//       cmd.stdout.setEncoding('utf8');
//       cmd.stdout.on('data', function(data) {
//         console.log(data);
//       });
//       cmd.stderr.on('data', function(data) {
//         console.log('stderr: ' + data);
//       });
//       cmd.on('close', function(code) {
//         resolve();
//       });
//     });
//   }
// })();
