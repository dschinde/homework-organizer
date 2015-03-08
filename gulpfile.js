var gulp = require('gulp');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

var ngTemplates = require('gulp-angular-templatecache');
var open = require('gulp-open');

/* Build tasks */

gulp.task('clean', function (done) {
    rimraf('build', function (e) {
        if (e) throw e;
        
        mkdirp('build', function (e) {
            if (e) throw e;
            done();
        });
    });
});

gulp.task('img', ['clean'], function () {
    return gulp.src('www/img/*')
            .pipe(gulp.dest('build/img'));
});

gulp.task('css', ['clean'], function () {
    return gulp.src('www/css/*.css')
            .pipe(gulp.dest('build/css'));
});

gulp.task('lib', ['clean'], function () {
    return gulp.src('www/lib/**/*')
            .pipe(gulp.dest('build/lib'));
});

gulp.task('scripts', ['clean'], function () {
    return gulp.src('www/js/**/*.js')
            .pipe(gulp.dest('build/js'));
});

gulp.task('index', ['clean'], function () {
    return gulp.src('www/index.html')
            .pipe(gulp.dest('build'));
});

gulp.task('templates', ['clean'], function () {
    return gulp.src('www/templates/*.html')
            .pipe(ngTemplates('templates.js', {
               root: 'templates',
               module: 'hwo.templates',
               standalone: true
            }))
            .pipe(gulp.dest('build/js'));
});

gulp.task('build', [ 'clean', 'img', 'css', 'lib', 'scripts', 'index', 'templates']);

/* Run tasks */
gulp.task('run', run);


/* Default task */
gulp.task('default', [ 'build' ], run);

/* Runs the app */
function run() {
    var options = {};
    if (process.platform === 'win32') {
        options.app = 'chrome';
    } else {
        options.app = 'google chrome';
    }

    return gulp.src('build/index.html')
            .pipe(open('build/index.html', options));
}
