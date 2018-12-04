/* eslint-disable no-console */
const fs = require('fs');
const zlib = require('zlib');
const filesize = require('filesize');
const Table = require('cli-table');
const path = require('path');
const sh = require('shelljs');

const filepaths = sh.find(path.join(__dirname, '..', 'dist', '**', '*.{js,css}')).filter(function(filepath) {
  if ((/\/(lang|example|font)\//).test(filepath)) {
    return false;
  }

  return true;
});

Promise.all(filepaths.map(function(filepath) {
  // gzip and stat
  return new Promise(function(resolve, reject) {
    const readStream = fs.createReadStream(filepath);
    const writeStream = fs.createWriteStream(filepath + '.gz');
    const gzip = zlib.createGzip();

    readStream.pipe(gzip).pipe(writeStream).on('close', function() {
      const gzStat = fs.statSync(filepath + '.gz');
      const fileStat = fs.statSync(filepath);

      resolve({filepath, gzStat, fileStat});
    })
      .on('error', reject);
  });
})).then(function(results) {
  return Promise.all(results.map(function(result) {
    return new Promise(function(resolve, reject) {
      const {fileStat, gzStat, filepath} = result;

      resolve([filepath.split('dist/')[1], filesize(fileStat.size), filesize(gzStat.size)]);
    });
  }));
})
  .then(function(lines) {
    const table = new Table({
      head: ['filename', 'size', 'gzipped'],
      colAligns: ['left', 'right', 'right'],
      style: {
        border: ['white']
      }
    });

    table.push.apply(table, lines);
    console.log(table.toString());

    filepaths.forEach(function(filepath) {
      fs.unlinkSync(filepath + '.gz');
    });

  })
  .catch(function(err) {
    console.error(err.stack);
  });
