import { defineConfig, presetUno } from 'unocss';
import transformerVariantGroup from '@unocss/transformer-variant-group';

export default defineConfig({
	content: {
		filesystem: ['**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}'],
	},
	shortcuts: [
		[/^l-(.*)$/, ([, c]) => `left-${c}`],
		[/^r-(.*)$/, ([, c]) => `right-${c}`],
		[/^t-(.*)$/, ([, c]) => `top-${c}`],
		[/^b-(.*)$/, ([, c]) => `bottom-${c}`],
		[/^x-(.*)$/, ([, c]) => `translate-x-${c}`],
		[/^y-(.*)$/, ([, c]) => `translate-y-${c}`],
	],
	transformers: [transformerVariantGroup()],
	presets: [presetUno()],
});
