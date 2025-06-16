import {
	SolidLine,
	SolidFill,
	ColorHEX,
	ChartXY,
	Axis,
	PointLineAreaSeries,
} from '@lightningchart/lcjs'

/**--- Настройка взаимодействия с пользователем ---*/
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

/**--- Сброс масштабирования графика ---*/
export const setIntervalTimeAxisXY = (
	axisX: Axis,
	axisY: Axis,
	seriesArray: PointLineAreaSeries,
) => {
	const boundariesSeries = seriesArray.getBoundaries()
	const {
		min: { x: minX, y: minY },
		max: { x: maxX, y: maxY },
	} = boundariesSeries
	axisX.setInterval({ start: minX, end: maxX, animate: 500 })
	axisY.setInterval({ start: minY, end: maxY * 1.3, animate: 500 })
	axisX.setIntervalRestrictions({ startMin: minX, endMax: maxX })
	axisY.setIntervalRestrictions({ startMin: minY, endMax: maxY * 1.3 })
}
/**--- Сброс масштабирования графика ---*/
export const setIntervalSpectrumAxisXY = (
	axisX: Axis,
	axisY: Axis,
	seriesArray: PointLineAreaSeries,
) => {
	const boundariesSeries = seriesArray.getBoundaries()
	const {
		min: { x: minX, y: minY },
		max: { x: maxX, y: maxY },
	} = boundariesSeries
	axisX.setInterval({ start: minX, end: maxX, animate: 500 })
	axisY.setInterval({ start: minY * 1.1, end: maxY * 1.2, animate: 500 })
	axisX.setIntervalRestrictions({ startMin: minX, endMax: maxX })
	axisY.setIntervalRestrictions({ startMin: minY * 1.1, endMax: maxY * 1.2 })
}
