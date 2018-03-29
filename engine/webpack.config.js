var path = require('path');

module.exports = {
    entry: './src/engine.ts',
    module: {
        rules: [
            {
                test:/\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },

    output: {
        path: path.resolve( __dirname, '../website/BlockPusher/Scripts/' ),
        filename: 'blockpusher.js',
    },

    watch: true
}