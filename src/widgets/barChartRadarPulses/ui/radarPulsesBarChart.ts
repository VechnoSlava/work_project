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

const mouseEnterBarHandler = (bar: SegmentFigure) => {
	bar.setStrokeStyle(selectedStrokeStyle)
}
const mouseLeaveBarHandler = (bar: SegmentFigure) => {
	bar.setStrokeStyle(mainStrokeStyle)
}

const clickHandler = (i: number) => {
	console.log('индекс импульса:', i)
}
export class RadarPulsesBarChart {
	chartName: string
	barChart: ChartXY | undefined
	segmentsSeries: SegmentSeries | undefined
	segments!: (SegmentFigure | undefined)[]
	axisX: Axis | undefined
	axisY: Axis | undefined

	constructor() {
		this.chartName = 'График импульсов РЛС'
	}

	createPulsesBarChart(idContainer: string) {
		this.barChart = lc
			.ChartXY({
				container: idContainer,
				theme: platanTheme,
			})
			// .setCursorMode(undefined)
			.setTitle('График импульсов РЛС')
			.setPadding({ right: 5, left: 0, top: 1, bottom: 0 })
			.setTitleFont(font => font.setSize(16))
			.setTitleMargin({ top: 0, bottom: 0 })
			.setBackgroundStrokeStyle(emptyLine)

		this.axisX = this.barChart
			.getDefaultAxisX()
			.setTitle('')
			.setMarginAfterTicks(0)
			// .setMouseInteractions(false)
			.setStrokeStyle(emptyLine)
			.setTickStrategy('Empty')

		this.axisY = this.barChart
			.getDefaultAxisY()
			.setDefaultInterval(state => ({
				start: state.dataMin,
				end: (state.dataMax ?? 0) + 100,
			}))
			// .setMouseInteractions(false)
			// .setChartInteractions(false)
			// .setChartInteractionZoomByWheel(false)
			// .setChartInteractionZoomByDrag(false)
			.setStrokeStyle(emptyLine)
			.setTickStrategy('Empty')

		/*-------------- Данные -----------------------------*/
		if (this.barChart) {
			this.segmentsSeries = this.barChart.addSegmentSeries()

			this.segments = dataTest?.Tads?.tadChart[0]?.data.map(point => {
				return this.segmentsSeries?.add({
					startX: point.x,
					endX: point.x,
					startY: 0,
					endY: point.y,
				})
			})

			const selectedPulse = (i: number) => {
				this.segments.forEach((bar, index) => {
					if (bar) {
						bar.setStrokeStyle(index === i ? selectedStrokeStyle : mainStrokeStyle)
					}
				})
				console.log(i)
			}

			this.segments.forEach((segment, i) => {
				if (segment) {
					segment.addEventListener('pointerenter', () => selectedPulse(i))
					segment.addEventListener('click', () => clickHandler(i))
				}
			})

			if (this.axisX && this.segmentsSeries) {
				setIntervalAxisX(this.axisX, this.segmentsSeries)
			}
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
