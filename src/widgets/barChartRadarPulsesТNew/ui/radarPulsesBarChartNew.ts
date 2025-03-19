import {
	Axis,
	ChartXY,
	ColorHEX,
	ColorRGBA,
	CursorXY,
	emptyLine,
	SegmentFigure,
	SegmentSeries,
	SolidFill,
	SolidLine,
	UIOrigins,
} from '@lightningchart/lcjs'
import { lc } from '../../../shared/libs/lightingChart/lcjs'
import { platanTheme } from '../../../shared/libs/lightingChart/theme'
import dataTest from '../../../shared/dataTest/messageId_2.json'
import { setIntervalAxisX } from '../model/utils'
import { store } from '../../../app/store/store'
import { log } from 'console'

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
	// segmentsSeries: SegmentSeries[] | undefined
	// segments: SegmentFigure[][] | undefined
	segmentsSeries1: SegmentSeries | undefined
	segmentsSeries2: SegmentSeries | undefined

	segments1!: (SegmentFigure | undefined)[]
	segments2!: (SegmentFigure | undefined)[]

	hoveredSegment: SegmentFigure | undefined
	selectedSegment: SegmentFigure | undefined

	axisX: Axis | undefined
	axisY: Axis | undefined
	originalDimensions: { startX: number; endX: number; startY: number; endY: number }[][] = [] // Храним исходные размеры
	// selectedIndex: [number, number] | undefined // Индекс выделенного сегмента
	// hoveredIndex: [number, number] | undefined
	selectedIndex: number | undefined // Индекс выделенного сегмента
	hoveredIndex: number | undefined
	leavedIndex: number | undefined
	targetIndex: number | undefined
	cursor: CursorXY | undefined

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

	// hoveredPulse (numSer: number, numPul: number) {
	// 	if(this.segments) {
	// 		this.segments[numSer].forEach((bar, index) => {
	// 			if (bar) {
	// 				if (index === numPul) {
	// 					// Увеличиваем высоту текущего сегмента
	// 					bar.setDimensions({
	// 						startX: this.originalDimensions[numSer][index].startX,
	// 						endX: this.originalDimensions[numSer][index].endX,
	// 						startY: this.originalDimensions[numSer][index].startY,
	// 						endY: this.originalDimensions[numSer][index].endY * 1.1,
	// 					})
	// 				} else {
	// 					// Восстанавливаем исходные размеры для остальных сегментов
	// 					bar.setDimensions(this.originalDimensions[numSer][index])
	// 				}
	// 			}
	// 		})
	// 	}

	// clickHandler  (i: number)  {
	// 	if (this.selectedIndex !== null) {
	// 		// Восстанавливаем стиль предыдущего выделенного сегмента
	// 		const previousSegment = this.segments[this.selectedIndex]
	// 		if (previousSegment) {
	// 			previousSegment.setStrokeStyle(mainStrokeStyle)
	// 		}
	// 	}
	//
	// 	// Выделяем новый сегмент
	// 	const currentSegment = this.segments[i]
	// 	if (currentSegment) {
	// 		currentSegment.setStrokeStyle(selectedStrokeStyle)
	// 		this.selectedIndex = i
	// 	}
	//
	// 	// Выводим параметры сегмента в консоль
	// 	const point = dataTest?.Tads?.tadChart[0]?.data[i]
	// 	const obj = dataTest?.Tads?.tadTable[0]?.data[i]
	// 	if (point) {
	// 		console.log('Количество импульсов:', dataTest.Tads.tadChart[0].data.length)
	// 		console.log('Количество объектов:', dataTest.Tads.tadTable[0].data.length)
	//
	// 		console.log('Параметры сегмента:', {
	// 			x: point.x,
	// 			y: point.y,
	// 		})
	//
	// 		console.log('Параметры объекта:', {
	// 			drill: obj.drill_id,
	// 			freq: obj.freq,
	// 			id: obj.id,
	// 			amp: obj.pulse_amplitude,
	// 			pulseLength: obj.pulse_length,
	// 			radar: obj.radar,
	// 		})
	// 	}
	// }

	/*
	hoveredPulse (segment: SegmentFigure, numSer: number, numPul: number){
		if(this.segments && !this.hoveredIndex) {
			const segment = this.segments[numSer][numPul]
			const dimensions = segment.getDimensions()
			dimensions.endY = dimensions.endY + 100
			segment.setDimensions(dimensions)
		}
		this.hoveredIndex = [numSer, numPul]
		console.log("hoveredPulse", numSer, numPul)
	}

	leavedPulse(segment: SegmentFigure, numSer: number, numPul: number){
		if(this.segments && this.hoveredIndex) {
			if(this.hoveredIndex.every((el, index) => el === [numSer, numPul][index])){
				const segment = this.segments[numSer][numPul]
				const dimensions = segment.getDimensions()
				dimensions.endY = dimensions.endY - 100
				segment.setDimensions(dimensions)
				this.hoveredIndex = undefined
			}
		}
		console.log("leavedPulse", numSer, numPul)
	}

	clickHandler(segment: SegmentFigure, numSer: number, numPul: number){
		if(this.segments){
			if (this.selectedIndex){
				const [prevNumSer, prevNumPul] = this.selectedIndex

				const previousSegment = this.segments[prevNumSer][prevNumPul]
				previousSegment.setStrokeStyle(mainStrokeStyle)
			}
			const segment = this.segments[numSer][numPul]
			segment.setStrokeStyle(selectedStrokeStyle)
			this.selectedIndex = [numSer, numPul]
			console.log("clickHandler", numSer, numPul)
		}
	}
		*/

	clickHandler1(segment: SegmentFigure, indexTad: number) {
		if (segment !== this.selectedSegment) {
			const previousSegment = this.selectedSegment
			previousSegment?.setStrokeStyle(mainStrokeStyle)
		}

		segment.setStrokeStyle(selectedStrokeStyle)
		this.selectedSegment = segment
		console.log('SelectedSegment', indexTad)
		console.log(segment)

		const clickSegment = this.segments1[indexTad]
		console.log(clickSegment === this.hoveredSegment, segment === this.hoveredSegment)
	}

	hoveredPulse(segment: SegmentFigure, indexTad: number) {
		if (this.hoveredSegment === segment) {
			console.log('Already hovered pulse')
			return
		}

		const dimensions = segment.getDimensions()
		dimensions.endY = dimensions.endY + 100
		segment.setDimensions(dimensions)
		this.hoveredSegment = segment
		console.log('Hovered pulse', indexTad)

		// if (this.hoveredIndex == indexTad) {
		// 	console.log(this.hoveredIndex, indexTad)
		// 	console.log('target', this.targetIndex)
		// 	return
		// }

		// if (indexTad !== this.hoveredIndex) {
		// 	const pulse = this.segments1[indexTad]
		// 	if (pulse) {
		// 		const dimensions = pulse?.getDimensions()
		// 		dimensions.endY = dimensions.endY + 100
		// 		pulse.setDimensions(dimensions)
		// 		this.hoveredIndex = indexTad
		// 		this.leavedIndex = undefined
		// 		this.targetIndex = indexTad
		// 		console.log('hoveredPulse', indexTad)
		// 		console.log('hover target', this.targetIndex)
		// 	}
		// }
	}

	leavedPulse(segment: SegmentFigure, indexTad: number) {
		if (segment !== this.hoveredSegment) {
			console.log('не тот сегмент!')
			return
		}

		if (segment === this.hoveredSegment) {
			const dimensions = segment.getDimensions()
			dimensions.endY = dimensions.endY - 100
			segment.setDimensions(dimensions)
			this.hoveredSegment = undefined
			console.log('Leaved pulse', indexTad)
		}

		// if (this.leavedIndex == indexTad) {
		// 	console.log(this.leavedIndex, indexTad)
		// 	return
		// }

		// if (segment && indexTad) {
		// 	const pulse = this.segments1[indexTad]
		// 	if (pulse) {
		// 		const dimensions = pulse.getDimensions()
		// 		dimensions.endY = dimensions.endY - 100
		// 		segment.setDimensions(dimensions)
		// 		this.leavedIndex = indexTad
		// 		this.hoveredIndex = undefined
		// 	}
		// }
		// console.log('leavedPulse', indexTad)
	}

	updateSegmentSeries() {
		if (this.barChart) {
			/*
			this.segments?.forEach(arr => arr.forEach(segment => segment.dispose()))
			this.segments = []
			this.segmentsSeries?.forEach(series => series.dispose())
			this.segmentsSeries = []

			const tadChart = store.getState().serverConnection.tads.tadChart

			*/

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

				/*
				//@ts-ignore
				Object.assign(segment, { indexSegment: index })
				*/
				segment?.addEventListener('click', () => this.clickHandler1(segment, index))
				segment?.addEventListener('pointerenter', () => this.hoveredPulse(segment, index))
				segment?.addEventListener('pointerleave', () => this.leavedPulse(segment, index))

				// segment?.addEventListener('click', () => this.clickHandler(this.segments1, index))
				// segment?.addEventListener('pointerenter', () => this.hoveredPulse(index))
				// segment?.addEventListener('pointerleave', ()=> this.leavedPulse(segment, i,j))
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

				segment?.addEventListener('click', () => this.clickHandler1(segment, index))
				segment?.addEventListener('pointerenter', () => this.hoveredPulse(segment, index))
				segment?.addEventListener('pointerleave', () => this.leavedPulse(segment, index))

				return segment
			})

			/*
			for (let i = 0; i < tadChart.length; i++){
				const segmentsSeries = this.barChart.addSegmentSeries()
				segmentsSeries.setName(`Series ${i}`)

				const segments = tadChart[i].data.map((point, j) => {
					const segment = segmentsSeries.add({
						startX: point.x + i * 2500,
						endX: point.x + i * 2500,
						startY: 0,
						endY: point.y,
					})



					segment.addEventListener('click', () => this.clickHandler(segment, i, j))
					segment.addEventListener('pointerenter', () => this.hoveredPulse(segment, i,j))
					segment.addEventListener('pointerleave', ()=> this.leavedPulse(segment, i,j))
					

					// segment.addEventListener('click', (event, info) => {
					// 	console.log('click', i, j, event, info)
					// 	const dimensions = info.figure.getDimensions()
					// 	dimensions.endY = dimensions.endY + 100
					// 	info.figure.setDimensions(dimensions)
					// 	info.figure.setStrokeStyle(selectedStrokeStyle)
					// })
					// segment.addEventListener('pointerenter', () => console.log("hoveredPulse", i, j))
					// segment.addEventListener('pointerleave', ()=> console.log("leavedPulse", i, j))

					// Применяем изначальный стиль к сегменту
					// segment.setStrokeStyle(mainStrokeStyle)

					return segment

				})

				this.segments.push(segments)
				this.segmentsSeries.push(segmentsSeries)
			}

			// this.segments.forEach((arr, i) => arr.forEach((segment, j) => {
			// 	segment.addEventListener('click', () => this.clickHandler(segment, i, j))
			// 	segment.addEventListener('pointerenter', () => this.hoveredPulse(segment, i,j))
			// 	segment.addEventListener('pointerleave', ()=> this.leavedPulse(segment, i,j))
			// }))
*/
		}
	}
}
export let radarPulsesBarChartNew = new RadarPulsesBarChartNew()
