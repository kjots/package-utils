import 'babel-polyfill';

import del from 'del';
import glob from 'glob';
import gulp from 'gulp';
import gulpBabel from 'gulp-babel';
import gulpEslint from 'gulp-eslint';
import gulpSourcemaps from 'gulp-sourcemaps';
import path from 'path';

const srcFiles = [ 'index.mjs', 'utils/**/*.mjs' ]
    .map(srcPattern => path.resolve(__dirname, srcPattern))
    .reduce((srcFiles, srcPattern) => srcFiles.concat(glob.sync(srcPattern)), []);

gulp.task('test', [ 'test:eslint' ]);

gulp.task('test:eslint', () => {
    return gulp.src(srcFiles)
        .pipe(gulpEslint())
        .pipe(gulpEslint.format())
        .pipe(gulpEslint.failAfterError());
});

gulp.task('compile', () => {
    return gulp.src(srcFiles, { base: __dirname })
        .pipe(gulpSourcemaps.init())
        .pipe(gulpBabel())
        .pipe(gulpSourcemaps.write('.', { includeContent: false, sourceRoot: '.' }))
        .pipe(gulp.dest('.'));
});

gulp.task('clean', () => del(
    srcFiles
        .map(srcFile => srcFile.replace(/\.mjs$/, '.js'))
        .reduce((libFiles, srcFile) => libFiles.concat(srcFile, srcFile + '.map'), [])
));