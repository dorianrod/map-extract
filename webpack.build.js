const config            = require('./webpack.common.js');
const path              = require('path');
let getConfiguration    = config.getConfiguration;

module.exports          = getConfiguration({
	devServer: {
		directory: "dev",
		contentBase: path.resolve(config.devserver_dir, './dev'),
		port: 8282
	},
	clean: true,
	bundleAnalyse: false,
	staticCopy: "dev"
});