// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://molgenis.github.io',
	base: '/GCC/xK7mQ3docs',
	integrations: [
		starlight({
			title: 'MOLGENIS Docs',
			logo: {
				light: './src/assets/logo_blue.png',
				dark: './src/assets/logo_green.png',
				replacesTitle: true,
			},
			favicon: '/favicon.png',
			components: {
				ThemeProvider: './src/components/ThemeProvider.astro',
			},
			head: [
				{
					tag: 'meta',
					attrs: {
						name: 'robots',
						content: 'noindex, nofollow',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'apple-touch-icon',
						sizes: '180x180',
						href: '/GCC/xK7mQ3docs/apple-touch-icon.png',
					},
				},
			],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/molgenis' },
			],
			editLink: {
				baseUrl: 'https://github.com/molgenis/molgenis-docs/edit/main/',
			},
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: 'Home',
					link: '/',
				},
				{
					label: 'Data Catalogue',
					items: [
						{ label: 'Overview', slug: 'catalogue' },
						{ label: 'Getting Started', slug: 'catalogue/getting-started' },
						{ label: 'Scenarios', slug: 'catalogue/scenarios' },
						{
							label: 'How-To Guides',
							items: [
								{ label: 'Configuring Your Catalogue', slug: 'catalogue/howto-configure' },
							],
						},
					],
				},
				{
					label: 'Patient Registry',
					items: [
						{ label: 'Overview', slug: 'registry' },
						{ label: 'Scenarios', slug: 'registry/scenarios' },
					],
				},
				{
					label: 'Armadillo (DataSHIELD)',
					items: [
						{ label: 'Overview', slug: 'armadillo' },
						{ label: 'Getting Started', slug: 'armadillo/getting-started' },
						{ label: 'Scenarios', slug: 'armadillo/scenarios' },
					],
				},
				{
					label: 'Concepts',
					items: [
						{ label: 'The EMX2 Data Model', slug: 'concepts/emx2' },
						{ label: 'Choosing a Solution', slug: 'concepts/choosing' },
					],
				},
				{
					label: 'Platform',
					items: [
						{ label: 'Installation', slug: 'platform/installation' },
						{ label: 'APIs', slug: 'platform/apis' },
						{ label: 'Permissions & Security', slug: 'platform/permissions' },
					],
				},
			],
		}),
	],
});
