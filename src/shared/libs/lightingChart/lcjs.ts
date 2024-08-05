import { lightningChart } from '@arction/lcjs'

export const lc = lightningChart({
	// Valid until 15/03/2024
	license:
		'0002-n4og2qUEgC6VgJvI1q8/aqe6hqXfKwCLIOOxHIgwgZiT1g4X529OLq7Qtbgve7sJrvgeOl7HcTSHb1/Y+RjhShb/-MEQCIEa3i+fOlLW4WKbQ2wNSu0PG0mWEK0agBgFqenq8XG2BAiB6H8X14CvUnu5vd+SpvMYtJkka1/HGxZxvWDNDrQL0tw==',
	licenseInformation: {
		appTitle: 'LightningChart JS Trial',
		company: 'LightningChart Ltd.',
	},
	// warnings: false,
	sharedContextOptions: {
		useIndividualCanvas: true,
		useStackingOrder: false,
		// devicePixelRatio: true,
		// noCanvasStyles: true,
	},
})
