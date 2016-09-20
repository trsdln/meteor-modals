Package.describe({
  name: 'trsdln:modals',
  version: '0.6.1',
  // Brief, one-line summary of the package.
  summary: 'Provides easy way to control your modals',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/trsdln/meteor-modals',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
});

Package.onUse(function (api) {
  api.versionsFrom('1.2');
  api.use([
    'mongo',
    'templating',
    'blaze',
    'jquery',
    'coffeescript',
    'less',
  ], 'client');

  api.addFiles([
    'modal-manager/modal-manager.html',
    'modal-manager/modal-manager.js',
    'modal-manager/modal/modal.html',
    'modal-manager/modal/modal.js',
    'modal-manager/modal-manager.less',
  ], 'client');

  api.export('ModalManager', ['client', 'server']);
});
