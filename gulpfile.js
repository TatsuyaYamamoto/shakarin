var gulp 		= require('gulp');
var imagemin 	= require('gulp-imagemin');
var cssmin 		= require('gulp-minify-css');
var concat		= require('gulp-concat');		// ファイルを１つにまとめる
var uglify 		= require('gulp-uglify');		// minify js
var plumber 	= require('gulp-plumber');
var webserver	= require('gulp-webserver');
var header		= require('gulp-header');
var gutil		= require('gulp-util');
var ftp			= require('vinyl-ftp');
var del 		= require('del');				// ファイル削除
var runSequence = require('run-sequence');		// タスクを非同期に実行する

var license		= require('./src/license/license.json').join('\n');
var config		= require('./config.secret.json');

// ------------------------------------------------------------------

gulp.task('hello', function(){
	console.log("（・８・）");
})
/**
HOW TO USE

- default
	- local server起動(Live reload)
- dist
	- dist dirにパッケージング
	- srcのコピー
	- development用のindex.htmlを使用する
- package
	- pacage dirにパッケージング
	- 本番用にconcat, minifyしたもの
	- production用のindex.htmlを使用する
- deploy_dev
	- 開発用サーバにdistパッケージをデプロイ
- deploy_dev_package
	- 開発用サーバにpackageパッケージをデプロイ

*/
// コマンド -------------------------------------------------

gulp.task('default', ['watch', 'webserver']);

/* 開発用パッケージング */
gulp.task('dist', function(){
	runSequence(
		'del_dist',
		[
			'dist_html', 
			'dist_js', 
			'dist_img', 
			'dist_css', 
			'dist_lib', 
			'dist_sound'
		]);
})

/* 本番用パッケージング */
gulp.task('package', function(){
	runSequence(
		'del_package',
		[
			'package_html', 
			'package_js', 
			'package_img', 
			'package_css', 
			'package_lib', 
			'package_sound'
		]);	
})

// タスクモジュール-------------------------------------------------

/* 監視タスク　*/
gulp.task('watch', function(){
	gulp.watch('./src/js/*', ['dist_js']);
	gulp.watch('./src/**/*.html', ['dist_js']);
})

/* ローカルサーバー */
gulp.task('webserver', function(){
	gulp.src('./dist')
		.pipe(
			webserver({
				host: 'localhost',
				livereload: true
			}))
})



/* 開発サーバーへアップロード */
// dist --> dev env.
gulp.task('deploy_dev', function () {
	deploy('dist/')
});
// package --> dev env.
gulp.task('deploy_dev_package', function () {
	deploy('package/')
});
function deploy(products){
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
    return gulp.src( globs, { base: products, buffer: false } )
        .pipe(conn.newer(config.ftp_dev.remotePath)) // only upload newer files
        .pipe(conn.dest(config.ftp_dev.remotePath));
}


// files: src --> dist or package dir-------------------------------------------------
/* HTML */
// html files: src --> dist
gulp.task('dist_html', function(){
	gulp.src('./src/html/development/*.html')
		.pipe(gulp.dest('./dist'));
});
// html files: src --> package
gulp.task('package_html', function(){
	gulp.src('./src/html/production/*.html')
		.pipe(gulp.dest('./package'));
});


/* Javascript */
// js files: src --> dist
gulp.task('dist_js', function(){
	gulp.src('./src/js/*')
		.pipe(plumber())
		.pipe(gulp.dest('./dist/js/'));

})
// js files: src --> package
gulp.task('package_js', function(){
	gulp.src('./src/js/**/*')
		.pipe(plumber())
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(header(license))
		.pipe(gulp.dest('./package/'));

})

/* lib */
// lib files: src --> dist
gulp.task('dist_lib', function(){
	gulp.src('./src/lib/**/*')
		.pipe(gulp.dest('./dist/lib/'));
})
// lib files: src --> package
gulp.task('package_lib', function(){
	gulp.src('./src/lib/**/*')
		.pipe(gulp.dest('./package/lib/'));
})

/* css */
// css files: src --> dist
gulp.task('dist_css', function(){
	gulp.src('./src/css/**/*')
		.pipe(gulp.dest('./dist/css/'));
})
// css files: src --> package
gulp.task('package_css', function(){
	gulp.src('./src/css/**/*')
		.pipe(concat('main.min.css'))
		.pipe(cssmin())
		.pipe(gulp.dest('./package/css/'));
})

/* image */
// img files: src --> dist
gulp.task('dist_img', function(){
	gulp.src('./src/img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/img/'));
})
// img files: src --> package
gulp.task('package_img', function(){
	gulp.src('./src/img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./package/img/'));
})

/* sound */
// img files: src --> dist
gulp.task('dist_sound', function(){
	gulp.src('./src/sound/**/*')
		.pipe(gulp.dest('./dist/sound/'));
})
// img files: src --> package
gulp.task('package_sound', function(){
	gulp.src('./src/sound/**/*')
		.pipe(gulp.dest('./package/sound/'));
})

/* delete */
gulp.task('del_dist', function(){
	del(['dist'], "");
});
gulp.task('del_package', function(){
	del(['package'], "");
}); 

