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
import { ISelectedColorsRadar } from '../../../shared/webSocket/IWebSocket'

const mainStrokeStyle = (colors: ISelectedColorsRadar[], numSer: number) => {
	return new SolidLine({
		thickness: 5,
		fillStyle: new SolidFill({ color: ColorHEX(`${colors[numSer].color}`) }),
	})
}

const selectedStrokeStyle = () =>
	new SolidLine({
		thickness: 10,
		fillStyle: new SolidFill({ color: ColorHEX('#f1f3f0') }),
	})

export class RadarPulsesBarChart {
	chartName: string
	barChart: ChartXY | undefined
	axisX: Axis | undefined
	axisY: Axis | undefined
	cursor: CursorXY | undefined

	segmentsSeries: SegmentSeries[] | undefined
	segments: SegmentFigure[][] | undefined
	hoveredSegment: SegmentFigure | undefined
	leavedSegment: SegmentFigure | undefined
	selectedSegment: SegmentFigure | undefined
	selectedIndex: [number, number] | undefined
	hoveredIndex: [number, number] | undefined
	colorsSeries: ISelectedColorsRadar[] | undefined

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
		if (this.barChart) {
			// Clear data chart
			this.segments?.forEach(arr => arr.forEach(segment => segment.dispose()))
			this.segments = []
			this.segmentsSeries?.forEach(series => series.dispose())
			this.segmentsSeries = []
			console.log('delete chart:', this.chartName)
			this.barChart.dispose()
		}
	}

	hoveredPulse(segment: SegmentFigure, numSer: number, numPul: number) {
		if (this.hoveredSegment === segment) {
			console.log('This Pulse already hovered!')
			return
		}

		const resetSegment = (s: SegmentFigure) => {
			const dim = s.getDimensions()
			s.setDimensions({ ...dim, endY: dim.endY / 1.1 })
		}

		const activateSegment = (s: SegmentFigure) => {
			const dim = s.getDimensions()
			s.setDimensions({ ...dim, endY: dim.endY * 1.1 })
			this.hoveredSegment = s
		}

		if (this.hoveredSegment) resetSegment(this.hoveredSegment)
		activateSegment(segment)
		this.leavedSegment = undefined
		console.log(`Hovered pulse${this.hoveredSegment ? '1' : '2'}`, numSer, numPul)
	}

	leavedPulse(segment: SegmentFigure, numSer: number, numPul: number) {
		if (!this.hoveredSegment || segment !== this.hoveredSegment) {
			console.log('False leave')
			return
		}

		const dim = segment.getDimensions()
		segment.setDimensions({ ...dim, endY: dim.endY / 1.1 })
		this.leavedSegment = segment
		this.hoveredSegment = undefined
		console.log('Leaved pulse', numSer, numPul)
	}

	clickPulse(
		segment: SegmentFigure,
		numSer: number,
		numPul: number,
		colorsSeries: ISelectedColorsRadar[],
	) {
		const resetPrevious = () => {
			if (this.selectedSegment && this.selectedSegment !== segment) {
				const serIndex = this.segments?.findIndex(arr => arr.includes(this.selectedSegment!)) ?? -1
				if (serIndex > -1) {
					this.selectedSegment.setStrokeStyle(mainStrokeStyle(colorsSeries, serIndex))
				}
			}
		}

		resetPrevious()
		segment.setStrokeStyle(selectedStrokeStyle())
		this.selectedSegment = segment
		console.log('Selected pulse', numSer, numPul, colorsSeries[numSer].color)
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
					segment.setStrokeStyle(mainStrokeStyle(colorsSeries, numSer))

					segment.addEventListener('click', () =>
						this.clickPulse(segment, numSer, numPul, colorsSeries),
					)
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
export let radarPulsesBarChart = new RadarPulsesBarChart()
