var path = require('path');

const SRC_DIR = path.resolve(__dirname, 'src');
const OUT_DIR = path.resolve(__dirname, 'target');

module.exports = {

    entry: path.join(SRC_DIR, 'jsx', 'index.jsx'),
    output: {
        path: OUT_DIR,
        filename: 'index.js',
        libraryTarget: 'commonjs2'
    },
    module: {

        rules: [

            // JSX files are loaded with babel
            {
                test: /\.jsx$/,
                include: path.join(SRC_DIR, 'jsx'),
                use: {
                    loader: 'babel-loader'
                }
            },

            // CSS files are treated as modules
            {
                test: /\.css$/,
                include: path.join(SRC_DIR, "css"),
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'}
                ]
            }

        ]

    }

};
