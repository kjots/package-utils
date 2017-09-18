import 'babel-polyfill';

import del from 'del';
import gulp from 'gulp';
import gulpBabel from 'gulp-babel';
import gulpEslint from 'gulp-eslint';
import gulpSourcemaps from 'gulp-sourcemaps';
import path from 'path';

const srcFiles = [ 'index.mjs' ]
    .map(srcFile => path.resolve(__dirname, srcFile));

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