import { Axis, SegmentSeries } from '@lightningchart/lcjs'

// /**
//  * Функция для масштабирования оси X по имеющимся данным на графике
//  * @param axis Масштабируемая ось
//  * @param series Данные
//  */
// export const setIntervalAxisX = (axis: Axis, series: SegmentSeries) => {
// 	const AXIS_PADDING_FACTOR = 6
// 	const minPoint = series.getXMin()
// 	const maxPoint = series.getXMax()
// 	if (minPoint === undefined || maxPoint === undefined || minPoint === maxPoint) {
// 		console.log('Недостаточно данных для масштабирования оси X')
// 		return
// 	}
// 	const shiftAxisOver = (maxPoint - minPoint) / AXIS_PADDING_FACTOR
// 	const startValue = minPoint - shiftAxisOver
// 	const endValue = maxPoint + shiftAxisOver
// 	axis.setDefaultInterval({ start: startValue, end: endValue }).setIntervalRestrictions({
// 		startMin: startValue,
// 		startMax: endValue,
// 		endMin: startValue,
// 		endMax: endValue,
// 	})
// }

/**
 * Функция для масштабирования оси X по имеющимся данным на графике
 * @param axis Масштабируемая ось
 * @param seriesArray Массив данных
 */
export const setIntervalAxisX = (axis: Axis, seriesArray: SegmentSeries[] | undefined) => {
	const AXIS_PADDING_FACTOR = 10

	if (!seriesArray || seriesArray.length === 0) {
		// console.log('Недостаточно данных для масштабирования оси X')
		return
	}

	// Находим общие минимум и максимум
	let globalMin: number | undefined = undefined
	let globalMax: number | undefined = undefined

	for (const series of seriesArray) {
		const minPoint = series.getXMin()
		const maxPoint = series.getXMax()

		if (minPoint !== undefined && (globalMin === undefined || minPoint < globalMin)) {
			globalMin = minPoint
		}

		if (maxPoint !== undefined && (globalMax === undefined || maxPoint > globalMax)) {
			globalMax = maxPoint
		}
	}

	if (globalMin === undefined || globalMax === undefined || globalMin === globalMax) {
		console.log('Недостаточно данных для масштабирования оси X')
		return
	}

	const shiftAxisOver = (globalMax - globalMin) / AXIS_PADDING_FACTOR
	const startValue = globalMin - shiftAxisOver
	const endValue = globalMax + shiftAxisOver

	axis.setDefaultInterval({ start: startValue, end: endValue }).setIntervalRestrictions({
		startMin: startValue,
		startMax: endValue,
		endMin: startValue,
		endMax: endValue,
	})
}
