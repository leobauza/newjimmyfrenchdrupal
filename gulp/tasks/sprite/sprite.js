var gulp = require('gulp'),
    svgSprite = require('gulp-svg-sprite');

gulp.task('sprite', function () {

  config = {
    shape: {
      spacing: {
        padding: 5
      }
    },
    mode: {
      css: {
        dest: '.',
        bust: false,
        render: {
          scss: {
            template: './gulp/tasks/sprite/sprite.scss',
            dest: '_sprite.scss'
          }
        },
        sprite: 'change/sprite.svg',
      }
    }
  };

  return gulp.src('./sites/all/themes/jf/assets/img/icons/*.svg')
    .pipe(svgSprite(config))
    .pipe(gulp.dest('./sites/all/themes/jf/assets/TEST/'));


});

// gulp.task('pngSprite', ['svgSprite'], function() {
//   return gulp.src('./sites/all/themes/jf/assets/img/sprite.svg')
//     .pipe(svg2png())
//     .pipe(gulp.dest('./sites/all/themes/jf/assets/img'));
// });
//
// gulp.task('sprite', ['pngSprite']);