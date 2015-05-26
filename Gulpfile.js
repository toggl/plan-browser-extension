var path = require('path');
var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
var rename = require('gulp-rename');
var glob = require('glob');
var through = require('through2');
var Vinyl = require('vinyl');

function createBrowserify(path, args) {
  return browserify(args)
    .transform('partialify')
    .transform('hbsfy')
    .add(path);
}

function createWatchify(path) {
  var br = createBrowserify(path, watchify.args);
  return watchify(br);
}

function createBundle(relativePath, br) {
  var stream = through.obj();
  var absolutePath = path.resolve(relativePath);
  var baseDirectory = path.dirname(absolutePath);

  br.bundle(function(error, buffer) {
    if (error) {
      stream.emit('error', error);
    } else {
      var v = new Vinyl({
        base: baseDirectory,
        path: absolutePath,
        contents: buffer
      });

      stream.push(v);
    }
  });

  return stream;
}

gulp.task('watch:js', function() {
  var output = through.obj();

  glob('src/bootloader/*.js', function(error, files) {
    files.forEach(function(file) {
      var w = createWatchify(file);

      w.on('update', function(ids) {
        var files = ids.map(path.basename).join(', ');
        gutil.log(gutil.colors.cyan(files), 'changed, rebuilding');
        
        createBundle(file, w).pipe(output);
      });

      w.on('time', function(time) {
        var seconds = (time / 1000).toFixed(1);
        gutil.log('Finished in', gutil.colors.magenta(seconds), gutil.colors.magenta('s'));
      });

      createBundle(file, w).pipe(output);
    });
  });

  return output
    .pipe(rename({ prefix: 'content_' }))
    .pipe(gulp.dest('app/scripts'));
});

gulp.task('build:js', function() {
  var output = through.obj();

  glob('src/bootloader/*.js', function(error, files) {
    files.forEach(function(file) {
      var b = createBrowserify(file);
      createBundle(file, b).pipe(output);
    });
  });

  return output
    .pipe(rename({ prefix: 'content_' }))
    .pipe(gulp.dest('app/scripts'));
});

gulp.task('build:less', function() {
  gulp.src('src/button/styles/*.less')
    .pipe(less())
    .pipe(gulp.dest('app/styles/'));
});

gulp.task('watch:less', ['build:less'], function() {
  gulp.watch('src/button/styles/*.less', ['build:less']);
});
