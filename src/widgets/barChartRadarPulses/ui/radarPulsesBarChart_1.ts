import {
	Axis,
	ChartXY,
	ColorHEX,
	EllipseSeries,
	emptyFill,
	emptyLine,
	PointLineAreaSeries,
	RectangleSeries,
	SegmentSeries,
	SolidFill,
	SolidLine,
} from '@lightningchart/lcjs'
import { lc } from '../../../shared/libs/lightingChart/lcjs'
import { platanTheme } from '../../../shared/libs/lightingChart/theme'
import dataTest from '../../../shared/dataTest/messageId_2.json'
import { setIntervalAxisX } from '../model/utils'

export class RadarPulsesBarChart {
	chartName: string
	barChart: ChartXY | undefined
	rectangleSeries: RectangleSeries | undefined
	segmentsSeries: SegmentSeries | undefined
	ellipseSeries: EllipseSeries | undefined
	bubbleSeries: PointLineAreaSeries | undefined
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
			.setTitle('График импульсов РЛС')
			.setPadding({ right: 5, left: 0, top: 1, bottom: 0 })
			.setTitleFont(font => font.setSize(16))
			.setTitleMargin({ top: 0, bottom: 0 })
			.setBackgroundStrokeStyle(emptyLine)
			.setTitleFont(font => font.setSize(16))
			.setTitleMargin({ top: 0, bottom: 0 })

		this.axisX = this.barChart
			.getDefaultAxisX()
			.setTitle('')
			.setUnits('ГГц')
			.setMarginAfterTicks(0)
			.setStrokeStyle(emptyLine)
		// .setTickStrategy('Empty')

		this.axisY = this.barChart
			.getDefaultAxisY()
			.setDefaultInterval(state => ({
				start: state.dataMin,
				end: (state.dataMax ?? 0) + 10,
			}))
			.setStrokeStyle(emptyLine)
			.setTickStrategy('Empty')

		/*-------------- Данные -----------------------------*/
		this.segmentsSeries = this.barChart.addSegmentSeries().setHighlightOnHover(true)
		this.bubbleSeries = this.barChart
			.addPointLineAreaSeries({
				dataPattern: null,
				sizes: true,
			})
			.setStrokeStyle(emptyLine)
			.setAreaFillStyle(emptyFill)

		this.bubbleSeries?.appendJSON(dataTest.Tads.tadChart[0].data, { x: 'x', y: 'y' })

		dataTest.Tads.tadChart[0].data.forEach(point => {
			this.segmentsSeries?.add({
				startX: point.x,
				endX: point.x,
				startY: 0,
				endY: point.y,
			})
		})
		setIntervalAxisX(this.axisX, this.segmentsSeries)
	}
}
export let radarPulsesBarChart = new RadarPulsesBarChart()
