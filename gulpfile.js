var gulp = require( 'gulp' ),
	clean = require( 'gulp-clean' ),
	concat = require( 'gulp-concat' ),
	uglify = require( 'gulp-uglify' ),
	gutil = require( 'gulp-util' ),
	filesize = require( 'gulp-filesize' ),
	less = require( 'gulp-less' ),
	path = require( 'path' );

var EXPRESS_PORT = 8000,
	EXPRESS_ROOT = __dirname,
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

gulp.task( 'default', function(){
	startExpress();
	startLivereload();
	gulp.watch( 'assets/less/**/*.less', ['css'] );
	gulp.watch( 'assets/js/**/*.js', ['js'] );
	gulp.watch( 'build/**/*.*', notifyLivereload );
});

gulp.task( 'clean', function(){
	return gulp.src( 'build', { read: false } )
		.pipe( clean() );
});

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
		.pipe( gulp.dest( 'build/css' ) )
		.pipe( filesize() )
		.on( 'error', gutil.log );
});