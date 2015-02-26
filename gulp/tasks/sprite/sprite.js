var gulp = require('gulp'),
    svgSprite = require('gulp-svg-sprite');

gulp.task('sprite', function () {

  var config = {
    shape: {
      spacing: {
        padding: 5
      }
    },
    mode: {
      css: {
        dest: '.',
        bust: false,
        prefix: '',
        render: {
          scss: {
            template: './gulp/tasks/sprite/sprite-template.scss',
            dest: 'src/scss/core/_sprite.scss'
          }
        },
        sprite: 'assets/img/sprite.svg',
      }
    },
    variables: {
      spriteFile: 'sprite.svg',
      calcOffset: function () {
        return function (values, render) {
          var vals = render(values).split('|');
          return vals[0] - vals[1];
        };
      }
    }
  };

  return gulp.src('./sites/all/themes/jf/assets/img/icons/*.svg')
    .pipe(svgSprite(config))
    .pipe(gulp.dest('./sites/all/themes/jf/'));

});

// need a PNG sprite fallback
// need SCSS template to account for that...

// gulp.task('pngSprite', ['svgSprite'], function() {
//   return gulp.src('./sites/all/themes/jf/assets/img/sprite.svg')
//     .pipe(svg2png())
//     .pipe(gulp.dest('./sites/all/themes/jf/assets/img'));
// });
//
// gulp.task('sprite', ['pngSprite']);