import { ColorHEX } from '@lightningchart/lcjs'
import { makeCustomTheme } from '@lightningchart/lcjs-themes'

export const platanTheme = makeCustomTheme({
	isDark: true,
	gradients: false,
	effects: true,
	fontFamily: 'Segoe UI, -apple-system, Verdana, Helvetica',
	backgroundColor: ColorHEX('#082740ff'),
	textColor: ColorHEX('#f0f0ecff'),
	dataColors: [
		ColorHEX('#1edcf6'),
		ColorHEX('#01e971'),
		ColorHEX('#a7f500'),
		ColorHEX('#4e4bec'),
		ColorHEX('#d83b70'),
		ColorHEX('#485b15'),
		ColorHEX('#ffa200'),
		ColorHEX('#bd4200'),
		ColorHEX('#0e4e36'),
	],
	axisColor: ColorHEX('#dbd9d9ff'),
	gridLineColor: ColorHEX('#4d4747ff'),
	uiBackgroundColor: ColorHEX('#1e2239ff'),
	uiBorderColor: ColorHEX('#716f6fff'),
	dashboardSplitterColor: ColorHEX('#133458ff'),
})
