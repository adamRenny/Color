var path = require('path');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var plato = require('gulp-plato');
var fs = require('fs');
var jshintOpts = JSON.parse(fs.readFileSync(path.join(__dirname, '.jshintrc'), 'utf8'));

var SRC = path.join(__dirname, 'src');
var TEST = path.join(__dirname, 'test');
var DEST = path.join(__dirname, 'dist');
var REPORTS = path.join(__dirname, 'reports');

gulp.task('dist', function() {
    gulp.src([path.join(SRC, '*.js')])
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(gulp.dest(DEST));
});

gulp.task('report', function() {
    gulp.src([path.join(SRC, '*.js')])
        .pipe(plato(
            path.join(REPORTS, 'complexity'),
            {
                jshint: jshintOpts,
                complexity: {
                    silent: true
                }
            })
        );
});

gulp.task('default', ['dist']);