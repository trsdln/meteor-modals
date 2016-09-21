Package.describe({
  name: 'trsdln:modals',
  version: '0.6.3',
  summary: 'Provides easy way to control your modals',
  git: 'https://github.com/trsdln/meteor-modals',
  documentation: 'README.md',
});

// eslint-disable-next-line
Package.onUse(function (api) {
  api.versionsFrom('1.3');
  api.use([
    'ecmascript',
    'blaze-html-templates',
    'blaze',
    'mongo',
    'jquery',
  ], 'client');

  api.mainModule('main.js', 'client');
});
