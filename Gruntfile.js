/*jshint node:true */
'use strict';

var request = require('request');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      test: ['tmp']
    },

    copy: {
      test: {
        src: ['_normalize.scss'],
        dest: 'tmp/normalize.scss'
      }
    },

    sass: {
      test: {
        options: {
          style: 'compressed',
          loadPath: process.cwd()
        },
        src: ['tmp/normalize.scss'],
        dest: 'tmp/normalize.test.css'
      }
    },

    cssmin: {
      test: {
        filter: 'isFile',
        expand: true,
        src: ['tmp/*.css']
      }
    }
  });

  grunt.util.linefeed = '\n';

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('get_orig', function () {
    var orig_url = 'http://necolas.github.com/normalize.css/latest/normalize.css';
    var orig_file = 'tmp/normalize.orig.css';

    var done = this.async();
    request.get(orig_url, function (err, res, body) {
      if (!err && res.statusCode === 200) {
        grunt.file.write(orig_file, body);
        grunt.log.writeln('File "' + orig_file + '" created.');
      }

      done(err);
    });
  });

  grunt.registerTask('compare', function () {
    var orig_file = 'tmp/normalize.orig.css';
    var test_file = 'tmp/normalize.test.css';
    var orig = grunt.file.read(orig_file);
    var test = grunt.file.read(test_file);

    if (orig !== test) {
      grunt.fail.warn('File "' + test_file + '" does not equal file "' + orig_file + '".');
    }

    grunt.log.writeln('File "' + test_file + '" equals file "' + orig_file + '".');
  });

  grunt.registerTask('test', [
    'clean:test',
    'copy:test',
    'sass:test',
    'get_orig',
    'cssmin:test',
    'compare'
  ]);
};
