import { lightningChart } from '@arction/lcjs'

export const lc = lightningChart({
	// Valid until 15/03/2024
	license:
		'0002-n65yLpFb+shmkxbsFULPlcxaRj6KKwCvcheFQ/nHcosV4836F5Alzm5L4Jx9j49W1B7tKdPjstl3kDQ4OYO0bkQL-MEYCIQDvkwklUkOjLVyjX7nhMqG8fRKf8lHdUX0RmD3vn3/UNAIhAJVu/9KZ+/rJed8YS+IZCH0hJWdP9hLISg22sEZaycF1',
	licenseInformation: {
		appTitle: 'LightningChart JS Trial',
		company: 'LightningChart Ltd.',
	},
	// warnings: false,
	sharedContextOptions: {
		useIndividualCanvas: false,
		// useStackingOrder: false,
		// devicePixelRatio: true,
		// noCanvasStyles: true,
	},
})
