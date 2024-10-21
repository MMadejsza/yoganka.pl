// vite.config.js pre-ready for React
import {defineConfig} from 'vite';
// import react from '@vitejs/plugin-react';
import {resolve} from 'path';

export default defineConfig({
	//   plugins: [react()],
	// root: 'public',  // Main folder to src
	publicDir: 'public',
	build: {
		outDir: '../www', // Folder, do którego będą trafiać zbudowane pliki, np. dla wrzucenia na serwer.
		emptyOutDir: true, // Clear folder before build
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
			'@': '/src', // alias @ for routes staring from 'src'
		},
	},
	optimizeDeps: {
		include: ['glide'], // add glide to bundling
	  },
});
