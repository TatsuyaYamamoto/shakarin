var gulp 		= require('gulp');
var imagemin 	= require('gulp-imagemin');
var concat		= require('gulp-concat');
var uglify 		= require('gulp-uglify');
var plumber 	= require('gulp-plumber');
var webserver	= require('gulp-webserver');
var header		= require('gulp-header');
var gutil		= require( 'gulp-util' );
var ftp			= require( 'vinyl-ftp' );

var license		= require('./src/license/license.json').join('\n');
var config		= require('./config.secret.json');

// ------------------------------------------------------------------

gulp.task('hello', function(){
	console.log("（・８・）");
})

// コマンド -------------------------------------------------

gulp.task('default', ['watch', 'webserver']);

/* 開発用パッケージング */
gulp.task('package', ['html_development', 'js_development', 'img', 'css', 'lib', 'sound'])

/* 本番用パッケージング */
gulp.task('package_production', ['html_production', 'js_production', 'img', 'css', 'lib', 'sound'])

// タスクモジュール-------------------------------------------------

/* 監視タスク　*/
gulp.task('watch', function(){
	gulp.watch('./src/js/*', ['js_development']);
	gulp.watch('./src/**/*.html', ['js_development']);
})


/* ローカルサーバーの起動 */
gulp.task('webserver', function(){
	gulp.src('./dist')
		.pipe(
			webserver({
				host: 'localhost',
				livereload: true
			}))
})



/* 開発サーバーへアップロード */
gulp.task('deploy_dev', function () {

    var conn = ftp.create({
        host:     config.ftp_dev.connect.host,
        user:     config.ftp_dev.connect.user,
        password: config.ftp_dev.connect.password,
        parallel: 2,
        log:      gutil.log
    });

    var globs = [
        'dist/**/*'
    ];

    return gulp.src( globs, { base: 'dist/', buffer: false } )
        .pipe( conn.newer(config.ftp_dev.remotePath) ) // only upload newer files
        .pipe( conn.dest(config.ftp_dev.remotePath) );

} );

// files: src --> dist -------------------------------------------------
/* HTML */
// html files: src --> dist
gulp.task('html_development', function(){
	gulp.src('./src/html/development/*.html')
		.pipe(gulp.dest('./dist'));
});

gulp.task('html_production', function(){
	gulp.src('./src/html/production/*.html')
		.pipe(gulp.dest('./dist'));
});


/* Javascript */
// js files: src --> dist
gulp.task('js_development', function(){
	gulp.src('./src/js/*')
		.pipe(plumber())
		.pipe(gulp.dest('./dist/js/'));

})

gulp.task('js_production', function(){
	gulp.src('./src/js/*')
		.pipe(plumber())
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(header(license))
		.pipe(gulp.dest('./dist/js/'));

})

// lib files: src --> dist
gulp.task('lib', function(){
	gulp.src('./src/lib/**/*')
		.pipe(gulp.dest('./dist/lib/'));
})

// css files: src --> dist
gulp.task('css', function(){
	gulp.src('./src/css/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/css/'));
})

// img files: src --> dist
gulp.task('img', function(){
	gulp.src('./src/img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/img/'));
})


// img files: src --> dist
gulp.task('sound', function(){
	gulp.src('./src/sound/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/sound/'));
})

