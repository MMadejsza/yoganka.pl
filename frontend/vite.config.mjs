// vite.config.js pre-ready for React
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
// import viteImagemin from 'vite-plugin-imagemin';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssDiscardComments from 'postcss-discard-comments';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname);
  console.log('🕔 TIME:', new Date());
  console.log('🔥 VITE_BACKEND_URL (after dotenv) =', env.VITE_BACKEND_URL);
  console.log('🔥 BUILD MODE:', mode);
  console.log('🔥 VITE_BASE_PATH from env:', env.VITE_BASE_PATH);

  return {
    base: env.VITE_BASE_PATH || '/',
    define: {
      'process.env': env,
    },
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
          drop_console: mode === 'prod' ? true : false,
        },
      },
      outDir: mode === 'prod' ? '../www-prod' : '../www-demo',
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
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        '@': '/src', // alias @ for routes staring from 'src',
        '@material/switch': path.resolve(
          __dirname,
          'node_modules/@material/web/switch'
        ),
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
          cssnano({ preset: 'default' }), // Minify CSS
        ],
      },
    },
  };
});
