(() => {
    'use strict'

    const assets = 'assets/'
    const assetsProd = 'src/'
    const dev = 'dev/'
    const prod = 'app/'

    const clean = require('del')
    const gulp = require('gulp')
    const jade = require('gulp-jade');
    const jsuglify = require('gulp-uglify')
    const runSequence = require('run-sequence')
    const sourcemaps = require('gulp-sourcemaps')
    const stylus = require('gulp-stylus')
    const typescript = require('gulp-typescript')

    const tsProject = typescript.createProject('tsconfig.json')

    gulp.task('typescript', () =>
        gulp.src([`${dev}**/*.ts`])
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject))
        .pipe(sourcemaps.write())
        .pipe(jsuglify())
        .pipe(gulp.dest(prod))
    )

    gulp.task('styles', () =>
        gulp.src([
            `${dev}/**/*.styl`,
            `!${dev}/**/_*.styl`,
            `!${dev}/**/_**/**/*.styl`
        ])
        .pipe(stylus({
            compress: true,
            linenos: false
        }))
        .pipe(gulp.dest(assetsProd))
        .on('error', (error) => console.log(error))
    )

    gulp.task('jade', () =>
        gulp.src(`${dev}**/*.jade`)
        .pipe(jade({
            pretty: true
        }))
        .on('error', (error) => console.log(error))
        .pipe(gulp.dest(prod))
    )

    gulp.task('jade-index', () =>
        gulp.src(`${dev}index/index.jade`)
        .pipe(jade({
            pretty: true
        }))
        .on('error', (error) => console.log(error))
        .pipe(gulp.dest('./'))
    )

    gulp.task('watch', () => {
        gulp.watch(`${dev}**/*.ts`, ['typescript'])
        gulp.watch(`${dev}**/*.styl`, ['styles'])
    })

    gulp.task('compiledBase' , (cb) =>
        runSequence('typescript', ['styles', 'jade'], 'clean-index', 'watch', cb)
    )

    gulp.task('clean', (cb) =>
        clean([prod, assetsProd], {
            force: true
        }, cb)
    )

    gulp.task('clean-index', (cb) =>
        clean([`${prod}index`], {
            force: true
        }, cb)
    )

    gulp.task('default', (cb) =>
        runSequence('clean', 'jade-index', 'compiledBase', cb)
    )
})()