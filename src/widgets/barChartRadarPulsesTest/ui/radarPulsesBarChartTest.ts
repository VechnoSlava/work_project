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
import { store } from '../../../app/store/store'

const mainStrokeStyle = new SolidLine({
	thickness: 5,
	fillStyle: new SolidFill({ color: ColorHEX('#008697') }),
})

const selectedStrokeStyle = new SolidLine({
	thickness: 10,
	fillStyle: new SolidFill({ color: ColorHEX('#00fc15') }),
})

export class RadarPulsesBarChartTest {
	chartName: string
	barChart: ChartXY | undefined
	axisX: Axis | undefined
	axisY: Axis | undefined
	cursor: CursorXY | undefined

	segmentsSeries1: SegmentSeries | undefined
	segmentsSeries2: SegmentSeries | undefined
	segments1!: (SegmentFigure | undefined)[]
	segments2!: (SegmentFigure | undefined)[]
	hoveredSegment: SegmentFigure | undefined
	selectedSegment: SegmentFigure | undefined
	selectedIndex: number | undefined
	hoveredIndex: number | undefined

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

	clickPulse(segment: SegmentFigure, indexTad: number) {
		if (segment !== this.selectedSegment) {
			const previousSegment = this.selectedSegment
			previousSegment?.setStrokeStyle(mainStrokeStyle)
		}

		segment.setStrokeStyle(selectedStrokeStyle)
		this.selectedSegment = segment
		console.log('Selected pulse', indexTad)
	}

	hoveredPulse(segment: SegmentFigure, indexTad: number) {
		if (this.hoveredSegment === segment) {
			console.log('This Pulse already hovered!')
			return
		}

		const dimensions = segment.getDimensions()
		dimensions.endY = dimensions.endY + 100
		segment.setDimensions(dimensions)
		this.hoveredSegment = segment
		console.log('Hovered pulse', indexTad)
	}

	leavedPulse(segment: SegmentFigure, indexTad: number) {
		if (segment !== this.hoveredSegment) {
			console.log('This is not the pulse!')
			return
		}

		if (segment === this.hoveredSegment) {
			const dimensions = segment.getDimensions()
			dimensions.endY = dimensions.endY - 100
			segment.setDimensions(dimensions)
			this.hoveredSegment = undefined
			console.log('Leaved pulse', indexTad)
		}
	}

	updateSegmentSeries() {
		if (this.barChart) {
			this.segments1?.forEach(segment => segment?.dispose())
			this.segments2?.forEach(segment => segment?.dispose())
			this.segments1 = []
			this.segments2 = []
			this.segmentsSeries1?.dispose()
			this.segmentsSeries2?.dispose()

			const tadChart = store.getState().serverConnection.tads.tadChart

			this.segmentsSeries1 = this.barChart.addSegmentSeries().setName('Series1')
			this.segments1 = tadChart[0]?.data.map((point, index) => {
				const segment = this.segmentsSeries1?.add({
					startX: point.x,
					endX: point.x,
					startY: 0,
					endY: point.y,
				})

				// //@ts-ignore
				// Object.assign(segment, { indexSegment: index })

				segment?.addEventListener('click', () => this.clickPulse(segment, index))
				segment?.addEventListener('pointerenter', () => this.hoveredPulse(segment, index))
				segment?.addEventListener('pointerleave', () => this.leavedPulse(segment, index))
				return segment
			})
			this.segmentsSeries2 = this.barChart.addSegmentSeries().setName('Series2')
			this.segments2 = tadChart[1]?.data.map((point, index) => {
				const segment = this.segmentsSeries2?.add({
					startX: point.x + 2500,
					endX: point.x + 2500,
					startY: 0,
					endY: point.y,
				})
				segment?.addEventListener('click', () => this.clickPulse(segment, index))
				segment?.addEventListener('pointerenter', () => this.hoveredPulse(segment, index))
				segment?.addEventListener('pointerleave', () => this.leavedPulse(segment, index))
				return segment
			})
		}
	}
}
export let radarPulsesBarChartTest = new RadarPulsesBarChartTest()
