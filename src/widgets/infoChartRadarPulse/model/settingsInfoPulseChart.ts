import { LUT, ColorRGBA, SolidLine, SolidFill, ColorHEX, ChartXY } from '@lightningchart/lcjs'

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

/*------------ Настройка взаимодействия с пользователем ------------*/
export const userInteractions = (chart: ChartXY) => {
	chart.setUserInteractions({
		pan: {
			rmb: false,
			lmb: false,
			mmb: { drag: {} },
			sensitivity: 1.5,
		},
		rectangleZoom: {
			lmb: {},
			rmb: false,
			mmb: false,
		},
		zoom: {
			rmb: {
				drag: {},
			},
			wheel: {},
		},
	})
}
// Форматеры
const GHz_FACTOR = 1_000_000
const NS_FACTOR = 1_000_000
const DB_FACTOR = 10

export const tickTextFormatter = (tickValue: number): string => {
	const roundedValue = Math.round((tickValue / GHz_FACTOR) * 1e6) / 1e6
	return `${roundedValue} МГц`
}

export const tickNumFormatter = (tickValue: number): number => {
	return tickValue / GHz_FACTOR
}

export const timeCursorFormatter = (tickValue: number): string => {
	// const roundedValue = Math.round((tickValue / NS_FACTOR) * 1e4)
	return `${tickValue} нс`
}
export const timeTickFormatter = (tickValue: number): string => {
	const roundedValue = Math.round((tickValue / NS_FACTOR) * 1e6)
	return `${roundedValue} нс`
}
export const powerNumFormatter = (tickValue: number): number => {
	return (tickValue / DB_FACTOR) * 10
}

// Стили

export const cursorGridStrokeStyle = new SolidLine({
	thickness: 1,
	fillStyle: new SolidFill({ color: ColorHEX('#a6a6a6') }),
})

export const cursorTextColor = new SolidFill({ color: ColorHEX('#63f7dc') })
