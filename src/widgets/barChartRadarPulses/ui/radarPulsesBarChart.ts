import {
	ChartXY,
	ColorHEX,
	emptyLine,
	RectangleSeries,
	SegmentSeries,
	SolidFill,
	SolidLine,
} from '@lightningchart/lcjs'
import { lc } from '../../../shared/libs/lightingChart/lcjs'
import { platanTheme } from '../../../shared/libs/lightingChart/theme'
import dataTest from '../../../shared/dataTest/messageId_2.json'

export class RadarPulsesBarChart {
	chartName: string
	barChart: ChartXY | undefined
	rectangleSeries: RectangleSeries | undefined
	segmentsSeries: SegmentSeries | undefined

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
			// .setPadding({ right: 5, left: 0, top: 0, bottom: 0 })
			// .setBarsMargin(0.2)
			// .setBackgroundStrokeStyle(emptyLine)

			.setTitleFont(font => font.setSize(16))
			.setTitleMargin({ top: 0, bottom: 0 })

		/*-------------- Данные -----------------------------*/
		this.segmentsSeries = this.barChart?.addSegmentSeries()
		dataTest.Tads.tadChart[0].data.forEach(point => {
			this.segmentsSeries
				?.add({
					startX: point.x,
					endX: point.x,
					startY: 0,
					endY: point.y,
				})
				.setStrokeStyle(
					new SolidLine({
						thickness: 2,
						fillStyle: new SolidFill({ color: ColorHEX('#fff') }),
					}),
				)
		})
	}
}
export let radarPulsesBarChart = new RadarPulsesBarChart()
