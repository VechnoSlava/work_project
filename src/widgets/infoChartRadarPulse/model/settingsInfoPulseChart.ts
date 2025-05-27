import { LUT, ColorRGBA, SolidLine, SolidFill, ColorHEX } from '@lightningchart/lcjs'

// Цветовая палитра для теплового водопада
export const WFPalette = new LUT({
	steps: [
		{ value: 0, color: ColorRGBA(53, 154, 208, 0) },
		{ value: 255 * 0.2, color: ColorRGBA(53, 154, 208, 255 * 0.2) },
		{ value: 255 * 0.4, color: ColorRGBA(53, 154, 208, 255 * 0.4) },
		{ value: 255 * 0.6, color: ColorRGBA(53, 154, 208, 255 * 0.6) },
		{ value: 255 * 0.8, color: ColorRGBA(53, 154, 208, 255 * 0.8) },
		{ value: 255, color: ColorRGBA(53, 154, 208, 255) },
	],
	interpolate: true,
})

// Форматеры
const GHz_FACTOR = 1_000_000_000

export const tickTextFormatter = (tickValue: number): string => {
	const roundedValue = Math.round((tickValue / GHz_FACTOR) * 1e6) / 1e6
	return `${roundedValue} ГГц`
}

export const tickNumFormatter = (tickValue: number): number => {
	return tickValue / GHz_FACTOR
}

// Стили

export const cursorGridStrokeStyle = new SolidLine({
	thickness: 1,
	fillStyle: new SolidFill({ color: ColorHEX('#a6a6a6') }),
})
