import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				secure: false,
			},
		},
	},
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					// 1. Keep your existing manual chunks logic
					if (id.includes('firebase')) return 'firebase-vendor';
					if (id.includes('quill') || id.includes('lodash-es')) return 'editor-vendor';

					// 2. Split core UI and React engine
					// This pulls the heavy lifting out of index.js
					if (id.includes('node_modules')) {
						if (id.includes('react') || id.includes('radix-ui') || id.includes('lucide-react')) {
							return 'vendor-core';
						}
					}
				},
			},
		},
	},
});
