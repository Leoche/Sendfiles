var gulp = require("gulp");
var dest = 'dist/';
var browserSync = require('browser-sync').create();
var plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
	replaceString: /\bgulp[\-.]/
});
var mainBowerFiles = require('main-bower-files');

var paths = {
  scripts: ['src/js/*'],
  htmls: 'src/**/*.html',
  phps: 'src/*.php',
  images: 'src/images/**/*',
  styles:'src/css/*',
};

gulp.task('scripts', function() {
  console.log(mainBowerFiles({filter:new RegExp(/.js$/, 'i')}));
	return gulp.src(mainBowerFiles({filter:new RegExp(/.js$/, 'i')}).concat(paths.scripts))
		.pipe(plugins.filter('**/*.js'))
		.pipe(plugins.concat('main.min.js'))
		//.pipe(plugins.uglify())
		.pipe(gulp.dest('dist/js'));
});
gulp.task('css', function() {
	return gulp.src(mainBowerFiles().concat(paths.styles))
		.pipe(plugins.filter('**/*.css'))
		.pipe(plugins.order([
			'normalize.css',
			'*'
		]))
		.pipe(plugins.concat('style.min.css'))
		.pipe(plugins.uglifycss({"uglyComments": false}))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});
gulp.task('htmls', function(){
  return gulp.src(paths.htmls)
      .pipe(plugins.htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('dist'));
});
gulp.task('php', function(){
  return gulp.src(paths.phps)
      .pipe(gulp.dest('dist'));
});
gulp.task('images', function(){
  return gulp.src(paths.images)
    .pipe(gulp.dest('dist/imgs'));
});
gulp.task('serve', function() {
    browserSync.init({
        server: {
          baseDir:"./dist"
        }
    });
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']).on("change", browserSync.reload);
  gulp.watch(paths.styles, ['css']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.phps, ['php']);
  gulp.watch(paths.htmls, ['htmls']).on("change", browserSync.reload);
});
gulp.task("default", ['htmls','php','css','scripts', 'images','serve','watch']);