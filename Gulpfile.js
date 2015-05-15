var path = require('path');
var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var through = require('through2');
var glob = require('glob');

function createBrowserify(filename, args) {
  return browserify(args)
    .add(filename)
    .transform('hbsfy');
}

function createWatchify(filename) {
  var browserify = createBrowserify(filename, watchify.args);
  return watchify(browserify);
}

function processScripts() {
  return through()
    .pipe(gulp.dest('app/scripts'));
}

function processBundle(bundle, filename) {
  return bundle
    .pipe(source(filename))
    .pipe(buffer());
}

function compileScript(input, output) {
  var bundle = createBrowserify(input).bundle();
  return processBundle(bundle, output);
}

function watchScript(input, output) {
  var w = createWatchify(input);

  w.on('update', function(ids) {
    var files = ids.map(path.basename).join(', ');
    gutil.log(gutil.colors.cyan(files), 'changed, rebuilding');
    
    var bundle = w.bundle();
    processBundle(bundle, output).pipe(processScripts());
  });

  w.on('time', function(time) {
    var seconds = (time / 1000).toFixed(1);
    gutil.log('Finished in', gutil.colors.magenta(seconds), gutil.colors.magenta('s'));
  });

  return processBundle(w.bundle(), output);
}

gulp.task('build:js', function() {
  var stream = processScripts();

  glob('src/content/*.js', function(err, files) {
    if (err) {
      stream.emit('error', err);
      return;
    }

    files.forEach(function(input) {
      var output = 'content_' + path.basename(input);
      compileScript(input, output).pipe(stream);
    });
  });

  return stream;
});

gulp.task('watch:js', function() {
  var stream = processScripts();

  glob('src/content/*.js', function(err, files) {
    if (err) {
      stream.emit('error', err);
      return;
    }

    files.forEach(function(input) {
      var output = 'content_' + path.basename(input);
      watchScript(input, output).pipe(stream);
    });
  });

  return stream;
});

gulp.task('build:less', function() {
  gulp.src('src/button/button.less')
    .pipe(less())
    .pipe(gulp.dest('app/styles/'));
});

gulp.task('watch:less', ['build:less'], function() {
  gulp.watch('src/button/**/*.less', ['build:less']);
});
