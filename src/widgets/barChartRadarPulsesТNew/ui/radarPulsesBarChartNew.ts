import {
	Axis,
	ChartXY,
	ColorHEX,
	CursorXY,
	emptyLine,
	SegmentFigure,
	SegmentSeries,
	SolidFill,
	SolidLine,
} from '@lightningchart/lcjs'
import { lc } from '../../../shared/libs/lightingChart/lcjs'
import { platanTheme } from '../../../shared/libs/lightingChart/theme'
import { setIntervalAxisX } from '../model/utils'
import { store } from '../../../app/store/store'

const mainStrokeStyle = new SolidLine({
	thickness: 5,
	fillStyle: new SolidFill({ color: ColorHEX('#008697') }),
})

const selectedStrokeStyle = new SolidLine({
	thickness: 10,
	fillStyle: new SolidFill({ color: ColorHEX('#00fc15') }),
})

export class RadarPulsesBarChartNew {
	chartName: string
	barChart: ChartXY | undefined
	axisX: Axis | undefined
	axisY: Axis | undefined
	cursor: CursorXY | undefined

	segmentsSeries: SegmentSeries[] | undefined
	segments: SegmentFigure[][] | undefined
	hoveredSegment: SegmentFigure | undefined
	selectedSegment: SegmentFigure | undefined
	selectedIndex: [number, number] | undefined
	hoveredIndex: [number, number] | undefined

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

		/*------------------- Cursor ---------------------------*/
		this.barChart.setCursorMode(undefined).setSeriesHighlightOnHover(false)
	}

	/*--------------- Dispose chart ------------------*/
	deletePulsesBarChart() {
		console.log('delete chart:', this.chartName)
		this.barChart?.dispose()
	}

	hoveredPulse(segment: SegmentFigure, numSer: number, numPul: number) {
		if (this.hoveredSegment === segment) {
			console.log('This Pulse already hovered!')
			return
		}

		const dimensions = segment.getDimensions()
		dimensions.endY = dimensions.endY + 100
		segment.setDimensions(dimensions)
		this.hoveredSegment = segment
		console.log('Hovered pulse', numSer, numPul)
	}

	leavedPulse(segment: SegmentFigure, numSer: number, numPul: number) {
		if (segment !== this.hoveredSegment) {
			console.log('This is not the pulse!')
			return
		}

		if (segment === this.hoveredSegment) {
			const dimensions = segment.getDimensions()
			dimensions.endY = dimensions.endY - 100
			segment.setDimensions(dimensions)
			this.hoveredSegment = undefined
			console.log('Leaved pulse', numSer, numPul)
		}
	}

	clickPulse(segment: SegmentFigure, numSer: number, numPul: number) {
		if (segment !== this.selectedSegment) {
			const previousSegment = this.selectedSegment
			previousSegment?.setStrokeStyle(mainStrokeStyle)
		}

		segment.setStrokeStyle(selectedStrokeStyle)
		this.selectedSegment = segment
		console.log('Selected pulse', numSer, numPul)
	}

	updateSegmentSeries() {
		if (this.barChart) {
			// Clear data chart
			this.segments?.forEach(arr => arr.forEach(segment => segment.dispose()))
			this.segments = []
			this.segmentsSeries?.forEach(series => series.dispose())
			this.segmentsSeries = []

			// Add data chart
			const tadChart = store.getState().serverConnection.tads.tadChart
			const colorsSeries = store.getState().radarsTable.selectedColorsRadars

			for (let numSer = 0; numSer < tadChart.length; numSer++) {
				const segmentsSeries = this.barChart.addSegmentSeries()
				segmentsSeries.setName(`Series ${numSer}`)

				const segments = tadChart[numSer].data.map((point, numPul) => {
					const segment = segmentsSeries.add({
						startX: point.x,
						endX: point.x,
						startY: 0,
						endY: point.y,
					})

					segment.addEventListener('click', () => this.clickPulse(segment, numSer, numPul))
					segment.addEventListener('pointerenter', () => this.hoveredPulse(segment, numSer, numPul))
					segment.addEventListener('pointerleave', () => this.leavedPulse(segment, numSer, numPul))

					return segment
				})

				this.segments.push(segments)
				this.segmentsSeries.push(segmentsSeries)
			}
		}
	}
}
export let radarPulsesBarChartNew = new RadarPulsesBarChartNew()
