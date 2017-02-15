"use strict";

var gulp = require('gulp'),
	concatCSS = require('gulp-concat'),
	rename = require('gulp-rename'),	
	watch = require('gulp-watch'),
	htmlmin = require('gulp-htmlmin'),
  	minify = require('gulp-minify'),
	cssmin = require('gulp-cssmin'),
  	connect = require('gulp-connect'),
  	ngrok = require('ngrok');
var uglify = require('gulp-uglify'); // Minify JavaScript
var imagemin = require('gulp-imagemin'); // Minify images

var site      = '';
var portVal   = 3000;

gulp.task('ngrok-url', function(cb) {
  return ngrok.connect(portVal, function (err, url) {
    site = url;
    console.log('serving your tunnel from: ' + site);
    cb();
  });
});

//css watch concat prefix min
gulp.task('css', function() {
  gulp.src('src/css/*.css')
  	.pipe(cssmin())
    .pipe(rename('style.min.css'))
  	.pipe(gulp.dest('app/css/'))
    .pipe(connect.reload());
});

//html minifying
gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('app/'))
    .pipe(connect.reload());
});

gulp.task('connect', function() {
  connect.server({
    port: portVal,
    root: 'src',
    livereload: true //with LiveReload!
  });
});

gulp.task('js',function(){
   return gulp.src('src/js/*.js')
       .pipe(gulp.dest('app/js/'))
       .pipe(uglify())
       .pipe(connect.reload());
});

gulp.task('images', function() {
    gulp.src('./src/img/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./app/img'));
});

gulp.task('build', ['css','html','js','images']);

gulp.task('watch', function() {
	gulp.watch('src/css/*.css', ['css']);
	gulp.watch('src/index.html',['html']);
    gulp.watch('src/js/*.js',['js']);
    gulp.watch('src/img/*',['images']);
});


gulp.task('default',['connect','watch']);