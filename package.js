Package.describe({
  name: "wolas:publish-counts",
  summary: "Publish the count of a cursor, in real time",
  version: "0.5.1",
  git: "https://github.com/percolatestudio/publish-counts.git"
});

Package.on_use(function (api, where) {
  api.versionsFrom(['1.6.1', '2.3', '3.0']);

  api.use(['blaze', 'templating'], 'client', { weak: true });
  api.use('mongo', 'client');

  api.add_files('publish-counts.js');

  api.export('Counts');
  api.export('publishCount', 'server');
});

Package.on_test(function (api) {
  api.use([
    'wolas:publish-counts',
    'tinytest',
    'facts']);

  api.add_files('publish-counts_tests.js');
});