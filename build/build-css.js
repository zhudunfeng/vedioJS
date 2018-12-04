const path = require('path');
const sh = require('shelljs');

sh.cd(path.join(__dirname, '..'));

const options = {
  minify: true
};
let i = process.argv.length;

while (i--) {
  const arg = process.argv[i];

  if (arg === '--no-min') {
    options.minify = false;
  }
}

const build = function() {
  // cdn css
  sh.exec('node-sass src/css/vjs-cdn.scss dist/alt/video-js-cdn.css');
  sh.exec('postcss --verbose --config postcss.config.js -d dist/alt dist/alt/video-js-cdn.css');

  // normal css
  sh.exec('node-sass src/css/vjs.scss dist/video-js.css');
  sh.exec('postcss --verbose --config postcss.config.js -d dist/ dist/video-js.css');
};

const minify = function() {
  sh.exec('cleancss dist/alt/video-js-cdn.css -o dist/alt/video-js-cdn.min.css');
  sh.exec('cleancss dist/video-js.css -o dist/video-js.min.css');
};

build();

if (options.minify) {
  minify();
}
