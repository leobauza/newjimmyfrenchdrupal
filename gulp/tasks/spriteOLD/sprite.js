var gulp = require('gulp'),
    svgSprites = require('gulp-svg-sprites'),
    svg2png = require('gulp-svg2png'),
    svgo = require('gulp-svgo');

gulp.task('svgSpriteOLD', function () {

  return gulp.src('./sites/all/themes/jf/assets/img/icons/*.svg')
    .pipe(svgo())
    .pipe(svgSprites({
      cssFile: 'src/scss/core/_spritemap.scss',
      preview: false,
      layout: 'diagonal',
      padding: 5,
      svg: {
        sprite: 'assets/img/sprite.svg'
      },
      templates: {
        css: require("fs").readFileSync('./gulp/tasks/sprite/sprite-template.scss', "utf-8")
      }
    }))
    .pipe(gulp.dest('./sites/all/themes/jf/'));

});

gulp.task('pngSpriteOLD', ['svgSprite'], function() {
  return gulp.src('./sites/all/themes/jf/assets/img/sprite.svg')
    .pipe(svg2png())
    .pipe(gulp.dest('./sites/all/themes/jf/assets/img'));
});

gulp.task('spriteOLD', ['pngSpriteOLD']);