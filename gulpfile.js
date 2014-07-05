var path = require('path');
var gulp = require('gulp');
var uglify = require('gulp-uglify');

var SRC = path.join(__dirname, 'src');
var TEST = path.join(__dirname, 'test');
var DEST = path.join(__dirname, 'dist');

gulp.task('dist', function() {
    gulp.src([path.join(SRC, 'Color.js')])
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(gulp.dest(DEST));
});

gulp.task('default', ['dist']);