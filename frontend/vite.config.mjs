// vite.config.js pre-ready for React
import {defineConfig} from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
// import viteImagemin from 'vite-plugin-imagemin';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssDiscardComments from 'postcss-discard-comments';

export default defineConfig({
	plugins: [
		postcssDiscardComments({
			removeAll: true,
		}),
		react(),
	],
	optimizeDeps: {
		include: ['@material/web/switch/switch.js'],
	},
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
		proxy: {
			'/api': {
				target: 'http://localhost:3000', // (Express)
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/api/, ''), // delete `/api` from URL
			},
		},
	},
	resolve: {
		alias: {
			'@': '/src', // alias @ for routes staring from 'src',
			'@material/switch': path.resolve(__dirname, 'node_modules/@material/web/switch'),
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
