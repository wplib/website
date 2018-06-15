const gulp              = require('gulp');
const browserSync       = require('browser-sync').create();
const reload            = browserSync.reload;
const sass              = require('gulp-sass');
const image             = require('gulp-image');
const sourcemaps        = require('gulp-sourcemaps');
const concat            = require('gulp-concat');
const strip             = require('gulp-strip-comments');
const cleanCSS          = require('gulp-clean-css');
const notify            = require('gulp-notify');
const uglify            = require('gulp-uglify');
const uglifycss         = require('gulp-uglifycss');
const autoprefixer      = require('gulp-autoprefixer');
const clean             = require('gulp-clean');
const html5Lint         = require('gulp-html5-lint');
const chokidar          = require('chokidar');

let sassFiles = [
    "./src/sass/styles.scss",
    "./src/sass/responsive.scss"
];

let jsFiles = [
    "./src/javascript/custom.js"
];


gulp.task('serve', () => {
    browserSync.init({
        open: false,
        server: {
            baseDir: './public_html'
        }
    });

    gulp.watch('./src/*.html').on('change', reload);
});


gulp.task('build-sass', () => {
    return gulp.src(sassFiles)
        .pipe(
            sass({
                outputStyle: 'compressed'
            })
                .on('error', sass.logError)
        )
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest('./public_html/assets/css/'))
        .pipe(notify({
            message: "Sass built successfully.",
            onLast: true
        }))
        .pipe(browserSync.reload({
            stream: true
        })); // prompts a reload after compilation
});

gulp.task('minify-image', () => {
    return gulp.src('./src/images/**/*.{jpg,png,gif}')
        .pipe(image())
        .pipe(gulp.dest('./public_html/assets/images/'))
        .pipe(notify({
            message: "Images minified successfully.",
            onLast: true
        }))
        .pipe(browserSync.reload({
            stream: true
        })); /* prompts a reload after compilation */
});

gulp.task('build-js', () => {
    return gulp.src(jsFiles)
        .pipe(strip())
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('./public_html/assets/javascript'))
        .pipe(notify({
            message: "JavaScript built successfully.",
            onLast: true
        }))
        .pipe(browserSync.reload({
            stream: true
        })); /* pompts a reload after compilation */
});

gulp.task('flexbox', () => {
    return gulp.src('./src/plugins/flexboxgrid/dist/flexboxgrid.min.css')
        .pipe(gulp.dest('./public_html/assets/css'))

});

gulp.task('html', () => {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./public_html'))

});

gulp.task('watch', ['serve'], () => {
    chokidar.watch(['./src/sass/**/*.scss']).on('all', (event, path) => {
        gulp.start('build-sass');
    });
    chokidar.watch(['./src/images/**/*.{jpg,png,gif}']).on('all', (event, path) => {
        gulp.start('minify-image');
    });
    chokidar.watch(['./src/javascript/*.js']).on('all', (event, path) => {
        gulp.start('build-js');
    });
    chokidar.watch(['./src/*.html']).on('all', (event, path) => {
        gulp.start('html');
    });
});

gulp.task('default', ['html', 'build-sass', 'build-js', 'minify-image', 'flexbox']);