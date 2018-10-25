'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var include = require('gulp-include');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync').create();
var babelify = require('babelify');
var autoprefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var path = require('path');
var transform = require('gulp-transform');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var _ = require('lodash');
var watchify = require('watchify');
var gzip = require('gulp-gzip');
var envify = require('envify/custom');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var minifyCss = require('gulp-minify-css');
var normalize = require('node-normalize-scss').includePaths;
var handlebars = require('gulp-compile-handlebars');
var revts = require('gulp-rev-timestamp');

var srcRoot = '.';
var targetRoot = 'public';
var nodeModules = path.join(__dirname, 'node_modules');

var isProduction = false; //изменяется программно
var isMinifyCss = false;

var config = {
    'styles': {
        'src': srcRoot + '/stylesheets/main.scss',
        'dest': targetRoot,
        'bundleName': 'main.css',
        'watch': srcRoot + '/stylesheets/**/*.scss',
        'sassIncludePaths': [nodeModules],
        'cssIncludePaths': [nodeModules]
    },

    'scripts': {
        'src': srcRoot + '/javascripts/app.js',
        'dest': targetRoot,
        'bundleName': 'scripts.js',
        'watch': srcRoot + '/javascripts/**/*.js'
    },

    'index': {
        'src': srcRoot + '/*.html',
        'dest': targetRoot
    },

    'views': {
        'src': srcRoot + '/views/**/*.html',
        'dest': targetRoot + '/views'
    },

    'json': {
        'src': srcRoot + '/json/*.json',
        'dest': targetRoot + '/json'
    },

    'templates':{
        'src': srcRoot + '/templates/**/*.*',
        'dest': targetRoot + '/templates/'
    },

    'plugins': {
        'src': srcRoot + '/plugins/**/*.*',
        'dest': targetRoot + '/plugins'
    },

    'images': {
        'src': srcRoot + '/images/**/*.*',
        'dest': targetRoot + '/images'
    },

    'favicon': {
        'src': srcRoot + '*.ico',
        'dest': targetRoot
    },

    'fonts': {
        'lato': [srcRoot + '/node_modules/lato-webfont/fonts/*{ttf,woff,woff2,svg,eot}'],
        'src': [srcRoot + '/fonts/**/*.*'],
        'dest': targetRoot + '/fonts'
    },

    'dist': {
        'root': targetRoot
    }
};

//Файлы продукции
var pasteData = require('./json/toothpaste.json');
var dispenserData = require('./json/dispenser.json');
var kidsData = require('./json/kids.json');

//Прерндер продукции
gulp.task('renderHtml', function () {
    return gulp.src('./templates/*.hbs')
        .pipe(handlebars({paste: pasteData, dispenser: dispenserData, kids: kidsData}, {
            ignorePartials: true,
            batch: ['./templates/partials']
        }))
        .pipe(rename('products.html'))
        .pipe(gulp.dest('./templates'))
});

gulp.task('clean', function () {
    return del([config.dist.root + '/*.{js,html,css}', config.dist.root + '/images/**', config.dist.root + '/fonts/**']);
});

gulp.task('styles', function () {
    return gulp.src(config.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer('last 3 versions', '> 1%', 'ie 9'))
        .pipe(gulpif(isMinifyCss, minifyCss()))
        .pipe(gulp.dest(config.styles.dest));
    //.pipe(browserSync.stream({once: true}));
});

gulp.task('plugins', function () {
    return gulp.src(config.plugins.src)
        .pipe(changed(config.plugins.dest))
        .pipe(gulp.dest(config.plugins.dest));
});

gulp.task('favicon', function () {
    return gulp.src(config.favicon.src)
        .pipe(gulp.dest(config.favicon.dest));
});

gulp.task('fonts', function () {
    gulp.src(config.fonts.src)
        .pipe(gulp.dest(config.fonts.dest));
    gulp.src(config.fonts.lato)
        .pipe(gulp.dest(config.fonts.dest));
});

gulp.task('images', function () {
    return gulp.src(config.images.src)
        .pipe(changed(config.images.dest))
        .pipe(gulp.dest(config.images.dest));
});

gulp.task('scripts', function () {

    var customOpts = {
        entries: config.scripts.src,
        debug: true,
        fullPaths: true
    };

    var opts = _.assign({}, watchify.args, customOpts);

    var bundler = browserify(opts);

    if (!isProduction) {
        bundler = watchify(bundler);
        bundler.on('update', rebundle); // on any dep update, runs the bundler
        bundler.on('log', gutil.log); // output build logs to terminal
    }

    bundler.transform(babelify.configure({
        // Optional ignore regex - if any filenames **do** match this regex then
        // they aren't compiled
        ignore: /templates/
    }));
    bundler.transform(envify({
        NODE_ENV: isProduction ? 'production' : 'development'
    }));

    function rebundle() {

        console.log('rebundle js...');

        return bundler.bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source(config.scripts.bundleName))
            .pipe(buffer())
            .pipe(gulpif(isProduction, uglify({mangle: false})))
            .pipe(gulp.dest(config.scripts.dest))
            .pipe(browserSync.stream({once: true}));
    }

    return rebundle();
});

gulp.task('js_scripts', function() {
    return browserify({ entries: config.scripts.src, debug: true})
        .transform(babelify)
        .bundle()
        .pipe(source(config.scripts.bundleName))
        .pipe(gulp.dest(config.scripts.dest))
});

gulp.task('index', ['renderHtml'], function () {
    return gulp.src(config.index.src)
        .pipe(revts())
        .pipe(include())
        .pipe(gulp.dest(config.index.dest))
    //.pipe(browserSync.stream({once: true}));
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: config.dist.root
        },
        port: 9023,
        notify: false,
        ghostMode: {
            clicks: false,
            forms: false,
            scroll: false
        }
    });
});

gulp.task('watch', ['serve'], function () {
    gulp.watch(config.styles.watch, ['styles']);
    gulp.watch(config.scripts.watch, ['js_scripts']);
    gulp.watch(config.index.src, ['index']);
    gulp.watch(config.templates.src, ['index']);
    gulp.watch(config.images.src, ['images']);
    gulp.watch(config.fonts.src, ['fonts']);
});

gulp.task('dev', ['clean'], function (cb) {
    isProduction = false;
    cb = cb || function () {
    };
    runSequence(['styles', 'plugins', 'images', 'index', 'fonts', 'favicon'], 'js_scripts', 'watch', cb);
});

gulp.task('prod', ['clean'], function (cb) {
    isMinifyCss = true;
    isProduction = true;
    cb = cb || function () {
    };
    runSequence(['styles', 'plugins', 'images', 'index', 'fonts', 'favicon'], 'scripts', cb);
});

gulp.task('default', ['clean'], function (cb) {
    isMinifyCss = true;
    isProduction = true;
    cb = cb || function () {
    };
    runSequence(['styles', 'plugins', 'images', 'index', 'fonts', 'favicon'], 'scripts', cb);
});
