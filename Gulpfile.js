var path = require('path');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var merge = require('merge-stream');

function configure(browserify, args) {
  return browserify(args)
    .transform('partialify')
    .transform('hbsfy');
}

gulp.task('watch:js', function() {
  var bootloaders = gulp.src('src/bootloader/*.js')
    .pipe(plugins.watchify(configure))
    .pipe(plugins.rename({ prefix: 'content_' }))
    .pipe(gulp.dest('app/scripts'));

  var backgrounds = gulp.src('src/background/*.js')
    .pipe(plugins.watchify(configure))
    .pipe(plugins.rename({ prefix: 'background_' }))
    .pipe(gulp.dest('app/scripts'));

  var options = gulp.src('src/options/options.js')
    .pipe(plugins.watchify(configure))
    .pipe(gulp.dest('app/scripts'));

  var popup = gulp.src('src/popup/popup.js')
    .pipe(plugins.watchify(configure))
    .pipe(gulp.dest('app/scripts'));

  return merge(bootloaders, backgrounds, options, popup);
});

gulp.task('build:js', function() {
  var bootloaders = gulp.src('src/bootloader/*.js')
    .pipe(plugins.browserify(configure))
    .pipe(plugins.rename({ prefix: 'content_' }))
    .pipe(gulp.dest('app/scripts'));

  var backgrounds = gulp.src('src/background/*.js')
    .pipe(plugins.browserify(configure))
    .pipe(plugins.rename({ prefix: 'background_' }))
    .pipe(gulp.dest('app/scripts'));

  var options = gulp.src('src/options/options.js')
    .pipe(plugins.browserify(configure))
    .pipe(gulp.dest('app/scripts'));

  var popup = gulp.src('src/popup/popup.js')
    .pipe(plugins.browserify(configure))
    .pipe(gulp.dest('app/scripts'));

  return merge(bootloaders, backgrounds, options, popup);
});

gulp.task('build:less', function() {
  var styles = [
    'src/button/styles/*.less',
    'src/options/options.less',
    'src/popup/styles/popup_page.less'
  ];

  return gulp.src(styles)
    .pipe(plugins.less())
    .pipe(gulp.dest('app/styles'));
});

gulp.task('watch:less', ['build:less'], function() {
  var styles = [
    'src/button/styles/*.less',
    'src/options/options.less',
    'src/popup/styles/popup_page.less'
  ];
  
  gulp.watch(styles, ['build:less']);
});
