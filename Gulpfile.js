const gulp = require('gulp');
const tap = require('gulp-tap');
const browserify = require('browserify');
const plugins = require('gulp-load-plugins')();
const merge = require('merge-stream');

gulp.task(
  'watch:js',
  gulp.series(function() {
    const bootloaders = gulp
      .src('src/bootloader/*.js')
      .pipe(plugins.watchify(gulpWatchBrowserify))
      .pipe(plugins.rename({ prefix: 'content_' }))
      .pipe(gulp.dest('app/scripts'));

    const backgrounds = gulp
      .src('src/background/*.js')
      .pipe(plugins.watchify(gulpWatchBrowserify))
      .pipe(plugins.rename({ prefix: 'background_' }))
      .pipe(gulp.dest('app/scripts'));

    const options = gulp
      .src('src/options/options.js')
      .pipe(plugins.watchify(gulpWatchBrowserify))
      .pipe(gulp.dest('app/scripts'));

    const popup = gulp
      .src('src/popup/popup.js')
      .pipe(plugins.watchify(gulpWatchBrowserify))
      .pipe(gulp.dest('app/scripts'));

    return merge(bootloaders, backgrounds, options, popup);
  })
);

gulp.task(
  'build:js',
  gulp.series(function() {
    const bootloaders = gulp
      .src('src/bootloader/*.js')
      .pipe(gulpBrowserify())
      .pipe(plugins.rename({ prefix: 'content_' }))
      .pipe(gulp.dest('app/scripts'));

    const backgrounds = gulp
      .src('src/background/*.js')
      .pipe(gulpBrowserify())
      .pipe(plugins.rename({ prefix: 'background_' }))
      .pipe(gulp.dest('app/scripts'));

    const options = gulp
      .src('src/options/options.js')
      .pipe(gulpBrowserify())
      .pipe(gulp.dest('app/scripts'));

    const popup = gulp
      .src('src/popup/popup.js')
      .pipe(gulpBrowserify())
      .pipe(gulp.dest('app/scripts'));

    return merge(bootloaders, backgrounds, options, popup);
  })
);

gulp.task(
  'build:less',
  gulp.series(function() {
    const styles = [
      'src/button/styles/*.less',
      'src/options/options.less',
      'src/popup/styles/popup_page.less',
    ];

    return gulp
      .src(styles)
      .pipe(plugins.less())
      .pipe(gulp.dest('app/styles'));
  })
);

gulp.task(
  'watch:less',
  gulp.series('build:less', function() {
    const styles = [
      'src/button/styles/*.less',
      'src/options/options.less',
      'src/popup/styles/*.less',
    ];

    gulp.watch(styles, gulp.series('build:less'));
  })
);

function gulpBrowserify() {
  return tap(function(file) {
    file.contents = browserify(file.path, {
      transform: ['partialify', 'hbsfy'],
    }).bundle();
  });
}

function gulpWatchBrowserify(browserify, args) {
  return browserify(args)
    .transform('partialify')
    .transform('hbsfy');
}
