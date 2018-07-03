var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');

gulp.task('sprite', function () {
  var spriteData = gulp.src('images/*.png').pipe(spritesmith({
    imgName: 'assets/sprite.png',
    cssName: 'assets/sprite.css',
  }));
  return spriteData.pipe(gulp.dest('src/'));
});
