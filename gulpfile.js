/**
 * Created by Granevich on 21.04.2016.
 */
var gulp        = require('gulp'),
    sass        = require('gulp-sass'),//переводит sass в css
    browserSync = require('browser-sync'),//обновление браузера
    concat  = require('gulp-concat'),//сборщик всех файлов
    uglify  = require('gulp-uglifyjs'),//минифицирует скрипты
    cssnano = require('gulp-cssnano'),//минифицирует css
    rename = require('gulp-rename'),//переиминовывает файлы
    del = require('del'),//удаляет файлы и директории
    imagemin = require('gulp-imagemin'),//минифицирует картинки
    pngquant = require('imagemin-pngquant'),//минифицирует png
    cache = require('gulp-cache'),//кеширует файлы
    autoprefixer = require('gulp-autoprefixer'),//вставляет префиксы
    uncss = require('gulp-uncss'),//убирает неиспользующие стили
    csscomb = require('gulp-csscomb');//комбинирует красиво стили




//sass
gulp.task('sass', function () {
    return gulp.src('app/sass/*.scss')
        .pipe(sass())
        .pipe(uncss({
            html:['app/index.html']
        }))
        .pipe(autoprefixer(['last 15 versions',  'ie 8', 'ie 7'],{cascade:true}))
        .pipe(csscomb())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream:true}))
});

////////////////////////////////////////

//конкатенирует и сжимает скрипты
gulp.task('scripts', function () {
   return gulp.src([
       'app/libs/jquery/dist/jquery.min.js',
       'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
   ])
       .pipe(concat('libs.min.js'))//конкатенируем в один файл
       .pipe(uglify())//минимизируем
       .pipe(gulp.dest('app/js'));//выгружаем
});
//////////////////////////////////////////////////////


//для минификации и канкатенации библиотек css
gulp.task('css-libs', function () {
   return gulp.src('app/sass/*.scss')
       .pipe(sass())
       .pipe(uncss({
           html:['app/index.html']
       }))
       .pipe(autoprefixer(['last 15 versions',  'ie 8', 'ie 7'],{cascade:true}))
       .pipe(cssnano())
       .pipe(rename({suffix:'.min'}))
       .pipe(gulp.dest('app/css'))
});

/////////////////////////////////////////////




//browsersync
gulp.task('browserSync', function () {
    browserSync({
        server:{
            baseDir:'app'
        },
        notify:false
    });
});



////////////
gulp.task('clean', function () {
   return del.sync('dist');
});
////////
gulp.task('clear', function () {
   return cache.clearAll;
});
////////
//////////////////////////














//image
gulp.task('img', function () {
   return gulp.src('app/img/**/*')
       .pipe(cache(imagemin({interlaced:true,
       progressive:true,
           svgoPlugins:[{removeViewBox:false}],
           use:[pngquant()]
       })))
       .pipe(gulp.dest('dist/img'))
});
///////////////////////////////////////












//watcher
gulp.task('watch', ['browserSync', 'sass', 'scripts'], function () {
    gulp.watch('app/sass/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/*.js', browserSync.reload)
});






//build

gulp.task('buildingProject',['clean', 'img', 'sass', 'scripts'], function () {
    
    var buildCss = gulp.src(['app/css/main.css'])
        .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
    
    var buildJs = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));
    
    var buildHtml = gulp.src('app/*.html')
        .pipe (gulp.dest('dist'))
    
});

