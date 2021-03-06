module.exports = {
    mode: 'development',

    entry: "./src/index.tsx",

    output: {
        filename: "bundle.js",
        chunkFilename: '[name].bundle.js',
        path: __dirname + "/public/scripts"
    },

    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

            // Process CSS and SASS with 'typings-for-css-modules'
            { test: /\.css$/, loader: 'typings-for-css-modules-loader?modules' },
            { test: /\.scss$/, loader: 'typings-for-css-modules-loader?modules&sass' },

            // Process SVG with 'svg-inline-loader'
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },

            // Process SCSS with 'saas-loader'
            {
                test: /\.(scss)$/,
                use: [{
                    loader: 'style-loader', // inject CSS to page
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS modules
                }, {
                    loader: 'postcss-loader', // Run post css actions
                    options: {
                        plugins: function () { // post css plugins, can be exported to postcss.config.js
                            return [
                                require('precss'),
                                require('autoprefixer')
                            ];
                        }
                    }
                }, {
                    loader: 'sass-loader' // compiles Sass to CSS
                }]
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
    }
};