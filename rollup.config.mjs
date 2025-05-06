import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import livereload from 'rollup-plugin-livereload';
import sass from 'rollup-plugin-sass';
import serve from 'rollup-plugin-serve';
import watch from 'rollup-plugin-watch';

const DIST = './dist';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'cjs', // Suitable for <script> tags in browsers
    },
    plugins: [
        sass({ output: 'dist/styles.css' }), // Output CSS to a file
        terser(), // Minify JavaScript
        copy({
            targets: [
                { src: 'src/index.html', dest: 'dist' },
            ]
        }),
        serve({ contentBase: DIST, port: 8080 }),
        watch({
            dir: "src",
            include: ["**/*.js", "**/*.scss", "**/*.html"],
        }),
        livereload({ watch: DIST, verbose: true, delay: 100 }), // Watch for changes in the dist directory
    ]
};