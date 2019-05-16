const gulp = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename")
const handlebars = require("gulp-compile-handlebars");
const del = require("del");
// const html = require("gulp-htmlmin");
const notify = require("gulp-notify");
const browserSync = require("browser-sync").create();
const path = {
	root: "./",
	src: {
		root: 		"src/",
		fonts: 		"src/fonts/**/*",
    samples: 	"src/samples/**/*.{jpg,svg,png,jpeg,JPG,PNG}",
		scss: 		"src/scss/**/*.{sass,scss}",
    js: 			"src/js/**/*.js",
    templates:  "src/templates/"
	},
	dist: {
    root: "dist",
		css: "dist/css",
    js: "dist/js",
    samples: "dist/samples",
    fonts: "dist/fonts",
    fontAwesome: "dist/fonts/font-awesome"
	}
}
const bootstrap = path.root + "node_modules/bootstrap/dist/js/bootstrap.js";
const popper = path.root + "node_modules/popper.js/dist/umd/popper.js";
const jquery = path.root + "node_modules/jquery/dist/jquery.js";
const fontAwesome = path.root + "node_modules/font-awesome/fonts/*";

// reload browser starta o browser
function html() {
  //compile and transform handlebars to html
  var templateData = {
      firstName: 'Kaanon'
    };
  var options = {
    ignorePartials: false,
    batch : [path.src.templates + "partials/"],
    helpers : {
      capitals : function(str){
        return str.toUpperCase();
      }
    }
  }
  return gulp.src(path.src.templates + "pages/**/*.hbs")
    .pipe(handlebars(templateData, options))
    .pipe(rename({extname: '.html'}))
    .on("error", notify.onError("Error: <%= error.message %>"))
    .pipe(gulp.dest(path.dist.root))
    .pipe(browserSync.reload({stream: true}));
}
function css() {
  //transform sass in css, minify and add a .map file
  return gulp.src(path.src.scss)
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: "expanded"}).on("error", sass.logError))
  .pipe(rename({ suffix: ".min" }))
  .pipe(postcss([autoprefixer(), cssnano()]))
  .pipe(sourcemaps.write('./'))
  .on("error", notify.onError("Error: <%= error.message %>"))
  .pipe(gulp.dest(path.dist.css))
  .pipe(browserSync.reload({stream: true}));
}
function js() {
  // copy js files
  return gulp.src(path.src.js)
  .pipe(gulp.dest(path.dist.js))
  .pipe(browserSync.reload({stream: true}));
}
function vendorJs() {
  // copy js from vendors
  return gulp.src([bootstrap, popper, jquery])
    .pipe(gulp.dest(path.dist.js));
}
function fonts(callback) {
  // copy font files
  gulp.src(fontAwesome).pipe(gulp.dest(path.dist.fontAwesome));
  gulp.src(path.src.fonts).pipe(gulp.dest(path.dist.fonts))
  /*.pipe(browserSync.reload({stream: true}))*/;
  callback();
}
function samples() {
  // copy samples
  return gulp.src(path.src.samples)
  .pipe(gulp.dest(path.dist.samples));
}
const buildJs = gulp.parallel(js, vendorJs);
const build =gulp.series(clear, gulp.parallel(html,css,buildJs, fonts, samples));
function watch() {
  gulp.watch(path.src.templates, html);
  gulp.watch(path.src.scss, css);
  gulp.watch(path.src.js, js);
  gulp.watch(path.src.samples, samples);
  // gulp.watch(path.src.fonts, fonts);
}
function browsersync() {
  browserSync.init({
    server: {
      baseDir: path.dist.root,
    },
    port: 8080,
    startPath: 'index.html',
  })
}
function clear() {
  return del([path.dist.root]);
}
exports.default = gulp.series(build, gulp.parallel(browsersync,watch));
exports.del = clear;