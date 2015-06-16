var path = require('path');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

function configure(browserify, args) {
  return browserify(args)
    .transform('partialify')
    .transform('hbsfy');
}

gulp.task('watch:js', function() {
  return gulp.src('src/bootloader/*.js')
    .pipe(plugins.watchify(configure))
    .pipe(plugins.rename({ prefix: 'content_' }))
    .pipe(gulp.dest('app/scripts'));
});

gulp.task('build:js', function() {
  return gulp.src('src/bootloader/*.js')
    .pipe(plugins.browserify(configure))
    .pipe(plugins.rename({ prefix: 'content_' }))
    .pipe(gulp.dest('app/scripts'));
});

gulp.task('build:less', function() {
  gulp.src('src/button/styles/*.less')
    .pipe(plugins.less())
    .pipe(gulp.dest('app/styles/'));
});

gulp.task('watch:less', ['build:less'], function() {
  gulp.watch('src/button/styles/*.less', ['build:less']);
});
