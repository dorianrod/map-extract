const path = require('path');

var VERSION			= '1.0.0'; //Version de la release
var G_ENV_VAR 		= "development";//development //production; => WEBPACK => code minified ou non, source map, envoi a sentry etc
var isDebug 	= G_ENV_VAR == "development"; //isLocal;

module.exports = {
	isProd: !isDebug,
	isDebug: isDebug,
	version: VERSION,
	edgeDebugCompatible: false,
	devserver_dir: path.resolve(__dirname, "./dev_server"),
}