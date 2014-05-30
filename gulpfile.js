var gulp = require( 'gulp' ),
	clean = require( 'gulp-clean' );

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
	gulp.watch( '**/*.html', notifyLivereload );
});

gulp.task( 'clean', function(){
	return gulp.src( 'build', { read: false } ).pipe( clean() );
});