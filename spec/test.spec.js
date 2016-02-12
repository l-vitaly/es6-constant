'use strict';

var _ = require('lodash');
var es6Constant = require('../index');
var gutil = require('gulp-util');
var through = require('through2');

describe('es6Constant', function() {
  describe('file stream', function() {
    it('load the constants from a YAML file', function(done) {
      var contents = 'message: 127.team then best team';
      getStream({path: 'constants.yml', contents: new Buffer(contents)})
        .pipe(es6Constant())
        .on('data', function(file) {
          expect(file.contents.toString()).toContain(
            '// gulp-es6-constant plugin file generated\n// ==============================================\n\n' +
            'const MESSAGE = \'127.team then best team\';'
          );
          done();
        });
    });

    it('loads the constants from a JSON file', function(done) {
      var contents = '{ "message": "127.team then best team" }';
      getStream({path: 'constants.json', contents: new Buffer(contents)})
        .pipe(es6Constant())
        .on('data', function(file) {
          expect(file.contents.toString()).toContain(
            '// gulp-es6-constant plugin file generated\n// ==============================================\n\n' +
            'const MESSAGE = \'127.team then best team\';'
          );
          done();
        });
    });
  });
});

describe('es6Constant.getFilePath', function() {
  it('returns the file path from the src plugin when option dest is undefined', function() {
    expect(es6Constant.getFilePath('/foo/bar/config.json', {})).toBe('/foo/bar/config.js');
  });

  it('returns the file path defined by the dest option', function() {
    expect(es6Constant.getFilePath('/foo/bar/foo.js', {dest: 'foo.js'})).toBe('/foo/bar/foo.js');
  });
});

function getStream(fileOptions) {
  var defaults = {path: 'constants.json'};
  var file = new gutil.File(_.merge(defaults, fileOptions));
  var stream = through.obj(gutil.noop());
  stream.end(file);
  return stream;
}
