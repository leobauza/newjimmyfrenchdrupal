var gulp = require('gulp'),
    svgSprite = require('gulp-svg-sprite'),
    config = require('../../config').sprite;

gulp.task('sprite', function () {

  var sprite = {
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
            dest: config.scss
          }
        },
        sprite: config.sprite + config.name,
      }
    },
    variables: {
      spriteFile: config.name,
      calcOffset: function () {
        return function (values, render) {
          var vals = render(values).split('|');
          return vals[0] - vals[1];
        };
      }
    }
  };

  return gulp.src(config.entry)
    .pipe(svgSprite(sprite))
    .pipe(gulp.dest(config.dest));

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