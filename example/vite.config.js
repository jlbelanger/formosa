import { defineConfig } from 'vite';
import path from 'path';
import postcssPresetEnv from 'postcss-preset-env';
import react from '@vitejs/plugin-react'; // eslint-disable-line import/no-unresolved

export default defineConfig({
	build: {
		outDir: 'build',
	},
	css: {
		postcss: {
			plugins: [
				postcssPresetEnv,
			],
		},
	},
	plugins: [react()],
	resolve: {
		alias: {
			react: path.resolve(__dirname, '../node_modules/react'),
			'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
		},
	},
	server: {
		open: true,
		port: 3000,
	},
});
