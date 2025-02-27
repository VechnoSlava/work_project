import {
	Axis,
	ChartXY,
	ColorHEX,
	emptyLine,
	SegmentFigure,
	SegmentSeries,
	SolidFill,
	SolidLine,
} from '@lightningchart/lcjs'
import { lc } from '../../../shared/libs/lightingChart/lcjs'
import { platanTheme } from '../../../shared/libs/lightingChart/theme'
import dataTest from '../../../shared/dataTest/messageId_2.json'
import { setIntervalAxisX } from '../model/utils'

const mainStrokeStyle = new SolidLine({
	thickness: 5,
	fillStyle: new SolidFill({ color: ColorHEX('#02d6e5') }),
})

const selectedStrokeStyle = new SolidLine({
	thickness: 10,
	fillStyle: new SolidFill({ color: ColorHEX('#03d461') }),
})

export class RadarPulsesBarChart {
	chartName: string
	barChart: ChartXY | undefined
	segmentsSeries: SegmentSeries | undefined
	segments!: (SegmentFigure | undefined)[]
	axisX: Axis | undefined
	axisY: Axis | undefined
	originalDimensions: { startX: number; endX: number; startY: number; endY: number }[] = [] // Храним исходные размеры
	selectedIndex: number | null = null // Индекс выделенного сегмента

	constructor() {
		this.chartName = 'График импульсов РЛС'
	}

	createPulsesBarChart(idContainer: string) {
		this.barChart = lc
			.ChartXY({
				container: idContainer,
				theme: platanTheme,
			})
			.setTitle('График импульсов РЛС')
			.setPadding({ right: 5, left: 0, top: 1, bottom: 0 })
			.setTitleFont(font => font.setSize(16))
			.setTitleMargin({ top: 0, bottom: 0 })
			.setBackgroundStrokeStyle(emptyLine)

		/*------------ Настройка взаимодействия с пользователем ------------*/
		this.barChart.setUserInteractions({
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

		/*------------ Настройка Оси X ------------*/
		this.axisX = this.barChart
			.getDefaultAxisX()
			.setTitle('')
			.setMarginAfterTicks(0)
			.setStrokeStyle(emptyLine)
			.setTickStrategy('Empty')

		/*------------ Настройка Оси Y ------------*/
		this.axisY = this.barChart
			.getDefaultAxisY()
			.setDefaultInterval(state => ({
				start: state.dataMin,
				end: (state.dataMax ?? 0) + 100,
			}))
			.setStrokeStyle(emptyLine)
			.setTickStrategy('Empty')
			.setUserInteractions(undefined)

		/*-------------- Данные -----------------------------*/
		if (this.barChart) {
			this.segmentsSeries = this.barChart.addSegmentSeries()

			this.segments = dataTest?.Tads?.tadChart[0]?.data.map(point => {
				const segment = this.segmentsSeries?.add({
					startX: point.x,
					endX: point.x,
					startY: 0,
					endY: point.y,
				})

				// Сохраняем исходные размеры сегмента
				if (segment) {
					segment.setStrokeStyle(mainStrokeStyle)
					this.originalDimensions.push({
						startX: point.x,
						endX: point.x,
						startY: 0,
						endY: point.y,
					})
				}

				return segment
			})

			if (this.axisX && this.segmentsSeries) {
				setIntervalAxisX(this.axisX, this.segmentsSeries)
			}

			const hoveredPulse = (i: number) => {
				this.segments.forEach((bar, index) => {
					if (bar) {
						if (index === i) {
							// Увеличиваем высоту текущего сегмента
							bar.setDimensions({
								startX: this.originalDimensions[index].startX,
								endX: this.originalDimensions[index].endX,
								startY: this.originalDimensions[index].startY,
								endY: this.originalDimensions[index].endY * 1.1, // Увеличиваем высоту
							})
						} else {
							// Восстанавливаем исходные размеры для остальных сегментов
							bar.setDimensions(this.originalDimensions[index])
						}
					}
				})

				console.log(i)
			}

			const restoreOriginalDimensions = () => {
				this.segments.forEach((bar, index) => {
					if (bar) {
						bar.setDimensions(this.originalDimensions[index]) // Восстанавливаем исходные размеры
					}
				})
			}

			const clickHandler = (i: number) => {
				if (this.selectedIndex !== null) {
					// Восстанавливаем стиль предыдущего выделенного сегмента
					const previousSegment = this.segments[this.selectedIndex]
					if (previousSegment) {
						previousSegment.setStrokeStyle(mainStrokeStyle)
					}
				}

				// Выделяем новый сегмент
				const currentSegment = this.segments[i]
				if (currentSegment) {
					currentSegment.setStrokeStyle(selectedStrokeStyle)
					this.selectedIndex = i // Сохраняем индекс выделенного сегмента
				}

				// Выводим параметры сегмента в консоль
				const point = dataTest?.Tads?.tadChart[0]?.data[i]
				if (point) {
					console.log('Параметры сегмента:', {
						x: point.x,
						y: point.y,
					})
				}
			}

			this.segments.forEach((segment, i) => {
				if (segment) {
					segment.addEventListener('pointerenter', () => hoveredPulse(i))
					segment.addEventListener('pointerleave', restoreOriginalDimensions) // Восстанавливаем размеры при уходе курсора
					segment.addEventListener('click', () => clickHandler(i))
				}
			})
		}

		/*-------------------Cursor---------------------------*/
		this.barChart.setCursorFormatting((_, hit, hits) => {
			if (!hit || !hit.series) return undefined

			// Проверяем, что попадание произошло на сегмент
			if (hit.series instanceof SegmentSeries) {
				const xValue = hit.x // Значение по оси X
				const yValue = hit.y // Значение по оси Y

				return [
					[
						{
							text: `Параметры`,
							fillStyle: new SolidFill({ color: ColorHEX('#17dce3') }),
						},
					],
					[
						{
							text: `Время:`,
							fillStyle: new SolidFill({ color: ColorHEX('#63f7dc') }),
						},
						'',
						{
							text: xValue.toFixed(2),
							fillStyle: new SolidFill({ color: ColorHEX('#63f7dc') }),
						},
						{
							text: 'с',
							fillStyle: new SolidFill({ color: ColorHEX('#63f7dc') }),
						},
					],
					[
						{
							text: `Амплитуда:`,
							fillStyle: new SolidFill({ color: ColorHEX('#63f7dc') }),
						},
						'',
						{
							text: yValue.toFixed(2),
							fillStyle: new SolidFill({ color: ColorHEX('#63f7dc') }),
						},
						{
							text: 'дБ',
							fillStyle: new SolidFill({ color: ColorHEX('#63f7dc') }),
						},
					],
				]
			}

			return undefined
		})
		this.barChart.setCursor(cursor =>
			cursor
				.setTickMarkerXVisible(false)
				.setTickMarkerYVisible(false)
				.setGridStrokeXStyle(emptyLine)
				.setGridStrokeYStyle(emptyLine),
		)
	}

	deletePulsesBarChart() {
		console.log('delete chart:', this.chartName)
		this.barChart?.dispose()
	}
}
export let radarPulsesBarChart = new RadarPulsesBarChart()
