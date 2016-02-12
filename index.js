'use strict';

var _ = require('lodash');
var fs = require('fs');
var yaml = require('js-yaml');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');

var PLUGIN_NAME = 'gulp-es6-constant';

var defaultOptions = {};

function normalizeValue(value) {
  switch (typeof(value)) {
  case 'string':
    return '\'' + value + '\''
    break;
  default:
    return value;
    break;
  }
}

function getFilePath(filePath, options) {
  return gutil.replaceExtension(filePath, '.js');
}

function readFile(filepath) {
  return fs.readFileSync(filepath, 'utf8');
}

module.exports = _.extend(function(config, opts) {
    var options = _.merge({}, defaultOptions, opts);

    return through.obj(function(file, encoding, callback) {
      if (file.isStream()) {
        this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
        return callback();
      }

      try {
        var result = '// gulp-es6-constant plugin file generated\n// ==============================================\n\n';
        var constants = [];
        var constantNames = [];

        var data = file.isNull() ? {} : yaml.safeLoad(file.contents);

        data = _.merge({}, config, data);

        for (var propName in data) {
          if (data.hasOwnProperty(propName)) {
            var constName = propName.toUpperCase();

            constantNames.push(constName);
            constants.push('const ' + constName + ' = ' + normalizeValue(data[propName]) + ';');
          }
        }

        result += constants.join('\n');
        result += '\n\nexport { ' + constantNames.join(', ') + '};\n'

        file.path = getFilePath(file.path, options);
        file.contents = new Buffer(result);
        this.push(file);
      } catch (err) {
        err.fileName = file.path;
        this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
      }
      callback();
    });
  },
  {
    getFilePath: getFilePath
  }
);
