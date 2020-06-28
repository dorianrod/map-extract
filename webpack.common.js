const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const merge = require('webpack-merge');
const weblog = require('webpack-log');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin')
const {extend} = require('lodash');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const log = weblog({ name: 'wds' }) // webpack-dev-server

const config = require('./webpack.variable.js');

const {
    edgeDebugCompatible,
    G_ENV_VAR,
    devserver_dir,
    isDebug: debug
} = config;

var cssLoaders = debug ? [
    {
        loader: MiniCssExtractPlugin.loader,
        options: {
            reloadAll: false,
            hmr: false
        },
    },
    { 
        loader: 'css-loader', 
        options: {  
            sourceMap: false,
        }
    },
    { 
        loader: 'postcss-loader', 
        options: {
            sourceMap: false,
            plugins: (loader) => [
                require('autoprefixer')
            ]
        } 
    }, 
    {
        loader: 'less-loader',
        options: {
            lessOptions: {
                strictMath: true,
            },
            sourceMap: false
        }
    }
] : [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
          hmr: false,
          reloadAll: false
      },
    },
    { 
        loader: 'css-loader', 
        options: {  
            sourceMap: false
        }
    },
    {
        loader: "clean-css-loader",
        options: {
            level: 1
        }
    },
    { 
        loader: 'postcss-loader', 
        options: {
            sourceMap: false,
            plugins: (loader) => [
                require('autoprefixer')
            ]
        } 
    }, 
    {
        loader: 'less-loader',
        options: {
            sourceMap: false,
            lessOptions: {
                strictMath: true,
            }
        }
    }
]

function getPlugins(options, entry) {
    if(!options) options = {};

    let bundleAnalyse   = options.bundleAnalyse;
    let writeLive       = options.writeLive;
    let clean           = options.clean;
    let staticCopy      = options.staticCopy;
    
    if(!options.cssName) {
        options.cssName = options.hashed ? "[name].[contenthash].css" : "[name].css";
    }

    let plugins = options.plugins || [];
    if(clean) {
        plugins.push(
            new CleanWebpackPlugin(),
        );
    }

    if(staticCopy) { 
        log.info("staticCopy enabled:");
        let param = [
            {
                flatten: true,
                from: path.resolve(staticCopy) + "/*.*",
                to: getOutputDirectory(options) + "/"
            } 
        ];
        log.info(param);
        plugins.push( new CopyWebpackPlugin(param))
        ;
    }

    if(!debug) {
        plugins = [...plugins, new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 100000
        })]
    }

    plugins = plugins.concat([
        new webpack.DefinePlugin(merge({
            'process.env.VERSION': JSON.stringify(config.version),
            'process.env.NODE_ENV': JSON.stringify(G_ENV_VAR)
        }, options.variables)),
        
        new webpack.ProvidePlugin({
            React: ['React']
        }),

        new MiniCssExtractPlugin({
            ignoreOrder: true,
            filename: options.cssName
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.NamedModulesPlugin()
    ]);

    if(bundleAnalyse) {
        plugins.push(new BundleAnalyzerPlugin({analyzerMode: 'static'}));
    }

    if(!options.devServer) {
        if(writeLive) {
            plugins.push(new WriteFilePlugin());
        }
    }

    if(options.pluginsEnd) {
        plugins = [...plugins, ...options.pluginsEnd];
    }

    plugins.push(new HtmlWebpackPlugin({
        template: './src/exportmap/index.html',
        hash: true,
        filename: 'index.html'
    }))

    return plugins;
}

function getModule(options) {
    if(!options) options = {};
    
    var loaderJS;
    if(!debug) {
        loaderJS = [
            {
                loader: 'babel-loader',
                
                options: {
                    cacheDirectory: './.build_cache/babel-loader',
                    presets: [
                        "@babel/preset-typescript",
                        "@babel/env", 
                        "@babel/react"
                    ],
                    plugins: [
                        "@babel/plugin-transform-flow-strip-types",
                        "@babel/transform-runtime", 
                        ["@babel/plugin-proposal-decorators", { "legacy": true }], 
                        ["@babel/plugin-proposal-class-properties", { "loose": true }],
                        "transform-remove-debugger", 
                        "transform-remove-console",
                        "transform-regenerator", 
                        "lodash"
                    ]
                }
            },
            {
                loader: 'webpack-strip-block',
                options: {
                    start: 'DEV_START',
                    end: 'DEV_END'
                }
            },
            {
                loader: 'webpack-strip-block',
                options: {
                    start: 'SITE_START',
                    end: 'SITE_END'
                }
            }
        ];
    } else {
        loaderJS = [
            {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: [
                        "@babel/preset-typescript",
                        ["@babel/env", {
                            "targets": {
                                ...(edgeDebugCompatible ? {edge: "44"} : {}),
                                "chrome": "81"
                            },
                            "useBuiltIns": "usage",
                        }],
                        
                        "@babel/react"
                    ],
                    plugins: [
                        "@babel/plugin-transform-flow-strip-types",
                        ["@babel/plugin-proposal-decorators", { "legacy": true }], 
                        ["@babel/plugin-proposal-class-properties", { "loose": true }],
                    ]
                }
            }
        ];
    }

    let rules = [];
 
    rules = [
        ...rules,
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {

                    }
                }
            ]
        },
        {
            test: /\.txt$/i,
            use: 'raw-loader',
        },
        {
            test: /\.(csv|tsv)$/,
            use: [
                'csv-loader'
            ]
        },
        {
            test: /\.xml$/,
            use: [
                'xml-loader'
            ]
        },
        {
            test: /\.(jsx|js)$/,
            exclude: /node_modules/,
            use: loaderJS
        },
        {
            test: /.*tojson.*\.svg/i,
            use: [{
                loader: 'svg-react-loader',
                options: {
                    raw: true
                }
            },
            {
                loader: 'image-webpack-loader',
                options: {
                    //bypassOnDebug: true, // webpack@1.x
                    disable: false //debug // webpack@2.x and newer
                }
            }]
        },
        {
            //test: /!((.+)?tojson(.+)?)\.svg/,
            test: /^((?!tojson).)+\.svg$/i,
            use: [{
                loader: 'svg-url-loader',
                options: {
                    disable: false,
                    stripdeclarations: true,
                    encoding: 'base64'
                }
            },
            {
                loader: 'image-webpack-loader',
                options: {
                    //bypassOnDebug: true, // webpack@1.x
                    disable: false // webpack@2.x and newer
                }
            }]
        },
        {
            test: /.*(relative).*\.(png|jpg|jpeg|gif|webp)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    useRelativePath: true
                }
            },
            {
                loader: 'image-webpack-loader'
            }]
        },
        {
            test: /\.(png|jpg|jpeg|gif|webp)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    useRelativePath: false
                }
            },
            {
                loader: 'image-webpack-loader',
                options: {
                    //bypassOnDebug: true, // webpack@1.x
                    disable: debug // webpack@2.x and newer
                }
            }]
        },
        {
            test: /\.(less|css)$/,
            use: cssLoaders
        }
    ];

    return {
        rules: rules
    };
}

function getAlias(options) {
    if(!options) options = {};
    let alias = options && options.alias;
    var allalias = merge({
        //defaults alias
    }, alias || {});
    return allalias;
}

function getOutputDirectory(options) {
    if(!options) options = {};
    let outputDirectory = options.outputDirectory;
    let devServer       = options.devServer;

    if(devServer && !outputDirectory) {
        let name = devServer && devServer.directory ? devServer.directory : devServer;
        outputDirectory = path.resolve(devserver_dir, './' + name)
    }

    return outputDirectory;
}

function getOptimisation(options) {
    if(!options) options = {};

    var optimisations = {
        moduleIds: options.hashed ? 'hashed' : undefined,
        splitChunks: options.splitChunks || {
            chunks: 'all',
            maxInitialRequests: 6,
            maxAsyncRequests: 6,
            minSize: 200000,
            minChunks: 1,
            cacheGroups: {
                default: false
            }
        }
    };

    if(!debug) {
        optimisations.minimizer = [
            new TerserPlugin({
                sourceMap: true,
                parallel: true,
                cache: './.build_cache/terser',
                terserOptions: {
                    ecma: undefined,
                    warnings: false,
                    mangle: true,
                    keep_classnames: true,
                    keep_fnames: true,
                    compress: {
                        drop_console: true,
                    },
                    output: {
                        comments: false
                    }
                }
            })
        ];
    }

    if(options.optimisations) {
        optimisations = extend(optimisations, options.optimisations);
    }

    if(!debug) return optimisations;
}

function getDevServer(options) {
    if(!options) options = {};
    let outputDirectory = getOutputDirectory(options);
    let devServer       = options.devServer;


    let write = options.writeLive;
    let writeToDisk = write === true ? true : (
        !write ? false : (
            write == "css" ? (
                function(filePath) {
                    return /\.css$/.test(filePath);
                }
            ) : false
        )
    )

    var devServerParam = devServer ? extend({
        writeToDisk: writeToDisk,
        watchContentBase: false,
        watchOptions: {
            aggregateTimeout: 2000,
            poll: 2000
        },
		contentBase: outputDirectory,
		hot: true,
		hotOnly:true,
		historyApiFallback: true,
	 	headers: {
			'Access-Control-Allow-Origin': '*'
		}
    }, typeof devServer == "object" ? devServer : {}) : undefined;

    if(devServerParam) delete devServerParam.directory;

    return devServerParam;
}

function getConfiguration(options) {
    if(!options) options = {};
    let outputDirectory = getOutputDirectory(options);

    let modules = options.modules || ["node_modules"];

    let entry = options.entry || {
        main: ['./src/exportmap/index.js']
    };

    let c = {
        entry: entry,
        mode: G_ENV_VAR,
        node: {
            fs: "empty"
        },
        stats: {
            builtAt: true
        },
        devServer: getDevServer(options),
        optimization: getOptimisation(options),
        output: {
            path: outputDirectory, //path.resolve(__dirname, 'build'),
            filename: options.hashed ? '[name].[contenthash].js' : '[name].min.js'
        },
        resolve: {
            modules: modules,
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            alias: getAlias(options)
        },
        devtool: options.devtool || (debug ? "cheap-module-source-map" : "source-map"),
        module: getModule(options),
        plugins: getPlugins(options, entry)
    };

    return c;
}

if(module.hot) {
    module.hot.decline(/\.css/);
}

module.exports = merge(config, {
    debug: debug,
    getAlias: getAlias,
    getDevServer: getDevServer,
    getConfiguration: getConfiguration,
    getModule: getModule,
    getPlugins: getPlugins,
    log: log
});