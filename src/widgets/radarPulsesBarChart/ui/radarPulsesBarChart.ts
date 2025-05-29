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
import { addSelectedPulse, IRadarsState } from '../../pulsesGridTable'
import { useAppDispatch } from '../../../app/store/hooks'

const mainStrokeStyle = (colors: string[], numSer: number) => {
	return new SolidLine({
		thickness: 5,
		fillStyle: new SolidFill({ color: ColorHEX(`${colors[numSer]}`) }),
	})
}

const selectedStrokeStyle = () =>
	new SolidLine({
		thickness: 10,
		fillStyle: new SolidFill({ color: ColorHEX('#f1f3f0') }),
	})

// const resizingAxisY = (stateYMax: number | undefined) => {
// 	stateYMax ?? 0

// 	stateYMax * 0.2
// }

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
	colorsSeries: string[] | undefined

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

		console.log('create chart: ', this.chartName)
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
			// console.log('This Pulse already hovered!')
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
		// console.log(`Hovered pulse${this.hoveredSegment ? '1' : '2'}`, numSer, numPul)
	}

	leavedPulse(segment: SegmentFigure, numSer: number, numPul: number) {
		if (!this.hoveredSegment || segment !== this.hoveredSegment) {
			// console.log('False leave')
			return
		}

		const dim = segment.getDimensions()
		segment.setDimensions({ ...dim, endY: dim.endY / 1.1 })
		this.leavedSegment = segment
		this.hoveredSegment = undefined
		// console.log('Leaved pulse', numSer, numPul)
	}

	clickPulse(segment: SegmentFigure, numSer: number, numPul: number, colorsSeries: string[]) {
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

		const selectedRadars = store.getState().radarsTable.selectedRadars
		if (!selectedRadars[numSer]) {
			console.error('Радар не найден для серии:', numSer)
			return
		}

		store.dispatch(
			addSelectedPulse({
				id: numPul,
				radar: selectedRadars[numSer].uid,
			}),
		)

		// console.log('Selected pulse', numSer, numPul, colorsSeries[numSer])
		// console.log('Selected pulse INFO', selectedRadars[numSer].uid)
	}

	clickPulseFromTable(numSer: number, numPul: number | null, colorsSeries: string[]) {
		if (numSer === -1 || !this.segmentsSeries?.[numSer]) {
			console.log('Неверный индекс серии:', numSer)
			return
		}
		if (numPul === null) {
			console.log('Импульса с таким индексом не найдено:', numPul)
			return
		}
		if (!this.segments?.[numSer]?.[numPul]) {
			console.log(`Импульс ${numPul} не найден в серии ${numSer}`)
			return
		}
		const segment = this.segments[numSer][numPul]

		if (this.selectedSegment && this.selectedSegment !== segment) {
			const prevSerIndex = this.segments.findIndex(arr => arr.includes(this.selectedSegment!))
			if (prevSerIndex > -1) {
				this.selectedSegment.setStrokeStyle(mainStrokeStyle(colorsSeries, prevSerIndex))
			}
		}
		segment.setStrokeStyle(selectedStrokeStyle())
		this.selectedSegment = segment

		const dim = segment.getDimensions()
		this.axisX?.setInterval({
			start: dim.startX - dim.startX * 0.00008,
			end: dim.startX + dim.startX * 0.00008,
			animate: 500,
		})
		// console.log('Selected pulse from table:', numSer, numPul, colorsSeries[numSer])
	}

	selectPulseFromTable(dataSelectedPulse: IRadarsState['selectedPulse']) {
		const { id, radar } = dataSelectedPulse
		const colorsSeries = store.getState().radarsTable.selectedRadars.map(radar => radar.color)
		const radarsIds = store.getState().radarsTable.selectedRadars.map(radar => radar.uid)
		const indexRadarSeries = radarsIds.indexOf(radar)
		if (indexRadarSeries === -1) {
			// console.log(`Радар с UID ${radar} не найден в выбранных радарах`)
			return
		}
		this.clickPulseFromTable(indexRadarSeries, id, colorsSeries)
	}

	updateSegmentSeries() {
		if (this.barChart) {
			// Clear data chart
			this.segments?.forEach(arr => arr.forEach(segment => segment.dispose()))
			this.segments = []
			this.segmentsSeries?.forEach(series => series.clear())
			this.segmentsSeries?.forEach(series => series.dispose())
			this.segmentsSeries = []

			// Add data chart
			const tadChart = store.getState().serverConnection.tads.tadChart
			const colorsSeries = store.getState().radarsTable.selectedRadars.map(radar => radar.color)
			// console.log(colorsSeries)

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

		setIntervalAxisX(this.axisX!, this.segmentsSeries)
		this.axisY?.setDefaultInterval(state => ({
			start: state.dataMin,
			end: (state.dataMax ?? 0) * 1.2,
		}))
		console.log('updateRadarPulsesBarChart')
	}
}
export let radarPulsesBarChart = new RadarPulsesBarChart()
