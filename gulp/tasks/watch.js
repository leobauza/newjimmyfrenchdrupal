var gulp = require('gulp');

gulp.task('watch', function(callback) {
  gulp.watch('./sites/all/themes/jf/src/js/**/*.js', ['browserify']);
  // Watchify will watch and recompile our JS, so no need to gulp.watch it
});