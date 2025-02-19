import { lightningChart } from '@lightningchart/lcjs'

export const lc = lightningChart({
	// Valid until 8/3/2025
	license:
		'0002-n4ma5JmRnEIh2lZfKk0qWSxTXmmhKwCImt2NiJ9KNcNVV/L18lzFx3Ycy7uVRYecspSqYJNQjdaSXNQxIdSfSazB-MEYCIQD4w7Q4nAoRbkRx9XR/EG/lMb6XbLVy+5pzxe6+mLi/+gIhAM6XYVmIUaWAiP05Lrw9NPJogGItPlnfwB9Wd6+i8Eet',
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
