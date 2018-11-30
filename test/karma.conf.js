const generate = require('videojs-generate-karma-config');

module.exports = function(config) {
  const coverageFlag = process.env.npm_config_coverage;
  const reportCoverage = false; // process.env.TRAVIS || coverageFlag || false;

  // see https://github.com/videojs/videojs-generate-karma-config
  // for options
  const options = {
    travisLaunchers(defaults) {
      delete defaults.travisFirefox;
      return defaults;
    },
    serverBrowsers(defaults) {
      return [];
    },
    coverage: reportCoverage
  };

  config = generate(config, options);

  config.proxies = config.proxies || {};

  // disable warning logs for sourceset tests, by proxing to a remote host
  Object.assign(config.proxies, {
    '/test/relative-one.mp4': 'http://example.com/relative-one.mp4',
    '/test/relative-two.mp4': 'http://example.com/relative-two.mp4',
    '/test/relative-three.mp4': 'http://example.com/relative-three.mp4'
  });

  config.files = [
    'node_modules/es5-shim/es5-shim.js',
    'node_modules/es6-shim/es6-shim.js',
    'node_modules/sinon/pkg/sinon.js',
    'dist/video-js.css',
    'test/dist/bundle.js',
    'test/dist/browserify.js',
    'test/dist/webpack.js'
  ];

  config.browserStack.project = 'Video.js';

  if (reportCoverage) {
    config.browserify.transform.push('browserify-istanbul');
  }

  // pin Browserstack Firefox version to 64
  config.customLaunchers.bsFirefox.browser_version = '64.0';

  // uncomment the section below to re-enable all browserstack video recording
  // it is off by default because it slows the build
  /*
  Object.keys(config.customLaunchers).forEach(function(cl) {
    if ('browserstack.video' in config.customLaunchers[cl]) {
      config.customLaunchers[cl]['browserstack.video'] = "true";
    }
  });
  */
};
