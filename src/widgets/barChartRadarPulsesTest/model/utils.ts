import { Axis, SegmentSeries } from '@lightningchart/lcjs'

/**
 * Функция для масштабирования оси X по имеющимся данным на графике
 * @param axis Масштабируемая ось
 * @param series Данные
 */
export const setIntervalAxisX = (axis: Axis, series: SegmentSeries) => {
	const AXIS_PADDING_FACTOR = 6
	const minPoint = series.getXMin()
	const maxPoint = series.getXMax()
	if (minPoint === undefined || maxPoint === undefined || minPoint === maxPoint) {
		console.warn('Недостаточно данных для масштабирования оси X')
		return
	}
	const shiftAxisOver = (maxPoint - minPoint) / AXIS_PADDING_FACTOR
	const startValue = minPoint - shiftAxisOver
	const endValue = maxPoint + shiftAxisOver
	axis.setDefaultInterval({ start: startValue, end: endValue }).setIntervalRestrictions({
		startMin: startValue,
		startMax: endValue,
		endMin: startValue,
		endMax: endValue,
	})
}
