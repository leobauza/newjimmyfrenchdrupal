var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var transform = require('vinyl-transform');
var handleErrors = require('../util/handleErrors');
var bundleLogger = require('../util/bundleLogger');

gulp.task('browserify', function () {

  var bundler,
      bundle,
      cache = {};

  bundler = function (filename) {

    if (cache[filename]) {
      return cache[filename].bundle();
    }

    b = browserify(filename, {
      cache: {},
      packageCache: {},
      fullPaths: true
    });

    b = watchify(b);

    b
    .on('update', bundle)
    .on('error', handleErrors);
    // .on('log', function (msg) {
    //   console.log(msg);
    // });

    cache[filename] = b;

    return b.bundle();
  };

  bundle = function () {

    var bundle = transform(function (filename) {
      //return bundler(filename);
      bundleLogger.start(filename);
      return bundler(filename);
    });

    // Need to make one of this for EACH file if I don't want it all
    // to recompile every single time
    // SHOULD look into a config file at some point
    return gulp.src(['./sites/all/themes/jf/src/js/*.js'])
      .pipe(bundle)
      .pipe(gulp.dest('./sites/all/themes/jf/assets/js'))
      .on('end', function () {
        console.log("finished?");
      });
  };


  return bundle();

});
