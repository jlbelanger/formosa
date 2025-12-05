import { defineConfig } from 'vite';
import path from 'path';
import postcssMixins from 'postcss-mixins';
import postcssPresetEnv from 'postcss-preset-env';
import react from '@vitejs/plugin-react'; // eslint-disable-line import/no-unresolved
import svgr from 'vite-plugin-svgr';

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.jsx'),
			name: 'formosa',
			formats: ['es'],
		},
		rollupOptions: {
			external: ['react', 'react-dom'],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
				},
			},
		},
	},
	css: {
		postcss: {
			plugins: [
				postcssMixins,
				postcssPresetEnv,
			],
		},
	},
	plugins: [
		react(),
		svgr(),
	],
});
