var gulp = require( 'gulp' ),
	clean = require( 'gulp-clean' ),
	concat = require( 'gulp-concat' ),
	uglify = require( 'gulp-uglify' ),
	gutil = require( 'gulp-util' ),
	filesize = require( 'gulp-filesize' ),
	less = require( 'gulp-less' ),
	path = require( 'path' ),
	mustache = require( 'gulp-mustache' );

var EXPRESS_PORT = 8000,
	EXPRESS_ROOT = __dirname + '/build',
	LIVERELOAD_PORT = 35729,
	lr;

function startExpress(){
	var express = require( 'express' ),
		app = express();

	app.use( require( 'connect-livereload' )() );
	app.use( express.static( EXPRESS_ROOT ) );
	app.listen( EXPRESS_PORT );
}

function startLivereload(){
	lr = require( 'tiny-lr' )();
	lr.listen( LIVERELOAD_PORT );
}

function notifyLivereload( event ){
	var fileName = require( 'path' ).relative( EXPRESS_ROOT, event.path );
	lr.changed({
		body: {
			files: [ fileName ]
		}
	});
}

gulp.task( 'default', [ 'build' ], function(){
	startExpress();
	startLivereload();
	gulp.watch( 'interface/**/*.{mustache,json}', ['tpl'] );
	gulp.watch( 'assets/less/**/*.less', ['css'] );
	gulp.watch( 'assets/js/**/*.js', ['js'] );
	gulp.watch( 'build/**/*.*', notifyLivereload );
});

gulp.task( 'clean', function(){
	return gulp.src( 'build', { read: false } )
		.pipe( clean() );
});

gulp.task( 'build', [ 'js', 'css', 'tpl' ] )

gulp.task( 'js', function(){
	return gulp.src( 'assets/js/**/*.js' )
		.pipe( concat( 'main.js' ) )
		.pipe( uglify() )
		.pipe( gulp.dest( 'build/assets/js' ) )
		.pipe( filesize() )
		.on( 'error', gutil.log );
});

gulp.task( 'css', function(){
	return gulp.src( 'assets/less/**/*.less' )
		.pipe( concat( 'main.css' ) )
		.pipe( less( {
			paths: [ path.join( __dirname, 'less', 'includes' ) ]
		}))
		.pipe( gulp.dest( 'build/assets/css' ) )
		.pipe( filesize() )
		.on( 'error', gutil.log );
});

gulp.task( 'tpl', function(){
	return gulp.src( 'interface/*.mustache')
		.pipe( mustache( 'interface/_data.json' ) )
		.pipe( gulp.dest( 'build' ) )
		.pipe( filesize() )
		.on( 'error', gutil.log )
});