"use strict";

var request = require("request");

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    clean: {
      main: ["tmp"]
    },

    copy: {
      main: {
        src: ["_normalize.scss"],
        dest: "tmp/normalize.scss"
      }
    },

    sass: {
      main: {
        options: {
          loadPath: process.cwd(),
          sourcemap: "none",
          style: "compressed"
        },

        src: ["tmp/normalize.scss"],
        dest: "tmp/normalize.actual.css"
      }
    },

    cssmin: {
      main: {
        options: {
          keepSpecialComments: 0
        },

        expand: true,
        filter: "isFile",
        src: ["tmp/*.css"]
      }
    }
  });

  grunt.util.linefeed = "\n";

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-sass");

  grunt.registerTask("get", function () {
    var url = "http://necolas.github.com/normalize.css/latest/normalize.css";
    var file = "tmp/normalize.expected.css";

    var done = this.async();
    request.get(url, function (err, res, body) {
      if (!err && res.statusCode === 200) {
        grunt.file.write(file, body);
        grunt.log.writeln('File "' + file + '" created.');
      }

      done(err);
    });
  });

  grunt.registerTask("compare", function () {
    var actual = {
      path: "tmp/normalize.actual.css",
      content: ""
    };
    var expected = {
      path: "tmp/normalize.expected.css",
      content: ""
    };
    actual.content = grunt.file.read(actual.path);
    expected.content = grunt.file.read(expected.path);

    if (actual.content !== expected.content) {
      grunt.fail.warn('File "' + actual.path + '" is not the same as file "' +
        expected.path + '".');
    }

    grunt.log.writeln('File "' + actual.path + '" is the same as file "' +
      expected.path + '".');
  });

  grunt.registerTask("test", [
    "clean",
    "copy",
    "sass",
    "get",
    "cssmin",
    "compare"
  ]);
};
