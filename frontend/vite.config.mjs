// vite.config.js pre-ready for React
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import viteImagemin from 'vite-plugin-imagemin';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssDiscardComments from 'postcss-discard-comments';

export default defineConfig({
	plugins: [
		postcssDiscardComments({
			removeAll: true,
		}),
		react(),
		viteImagemin({
			gifsicle: {optimizationLevel: 7},
			optipng: {optimizationLevel: 7},
			svgo: {
				plugins: [{removeViewBox: false}],
			},
			mozjpeg: {quality: 65},
			webp: {quality: 65},
		}),
	],
	// root: 'public',  // Main folder to src
	publicDir: 'public',
	build: {
		minify: 'terser',
		terserOptions: {
			format: {
				comments: false,
			},
			compress: {
				drop_console: true,
			},
		},
		outDir: '../www',
		emptyOutDir: true, // Clear folder before build
		treeshake: true, //Make sure you don't use unnecessary dependencies and your code is cleaned of unused functions and libraries.
	},
	server: {
		port: 5000, // Specified port for dev
		strictPort: true, // finish task on port if busy
		hmr: {
			overlay: true, // Shows error full screen
		},
	},
	resolve: {
		alias: {
			'@': '/src', // alias @ for routes staring from 'src',
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler', // or "modern"
			},
		},
		postcss: {
			plugins: [
				autoprefixer,
				cssnano({preset: 'default'}), // Minify CSS
			],
		},
	},
});
