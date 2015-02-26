var gulp = require('gulp'),
    sass = require('gulp-sass'),
    handleErrors = require('../util/handleErrors'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function () {

  return gulp.src('./sites/all/themes/jf/src/scss/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', handleErrors)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./sites/all/themes/jf/assets/css'));

});