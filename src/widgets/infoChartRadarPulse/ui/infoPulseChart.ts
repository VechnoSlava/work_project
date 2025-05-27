import {
	Axis,
	AxisScrollStrategies,
	AxisTickStrategies,
	ChartXY,
	ColorHEX,
	CustomTick,
	emptyFill,
	emptyLine,
	HeatmapScrollingGridSeriesIntensityValues,
	isHitHeatmap,
	NumericTickStrategy,
	PalettedFill,
	PointLineAreaSeries,
	SolidFill,
	SolidLine,
	TickStyle,
	ZoomBandChart,
} from '@lightningchart/lcjs'
import { lc } from '../../../shared/libs/lightingChart/lcjs'
import { platanTheme } from '../../../shared/libs/lightingChart/theme'
import { cursorGridStrokeStyle } from '../model/settingsInfoPulseChart'

export class InfoPulseChart {
	chartName: string
	timeChart: ChartXY | undefined
	spectrumChart: ChartXY | undefined
	intervalChart: ChartXY | undefined

	lineSeriesTimeChart: PointLineAreaSeries | undefined
	lineSeriesSpectrumChart: PointLineAreaSeries | undefined
	lineSeriesIntervalChart: PointLineAreaSeries | undefined

	axisXTimeChart: Axis | undefined
	axisYTimeChart: Axis | undefined
	axisXSpectrumChart: Axis | undefined
	axisYSpectrumChart: Axis | undefined
	axisXIntervalChart: Axis | undefined
	axisYIntervalChart: Axis | undefined

	constructor() {
		this.chartName = 'Графики информации импульса'
	}

	createInfoPulseChart(
		idContainerTimeChart: string,
		idContainerSpectrumChart: string,
		idContainerIntervalChart: string,
	) {
		/*------------ График осциллограммы ------------*/
		this.timeChart = lc
			.ChartXY({
				container: idContainerTimeChart,
				theme: platanTheme,
				defaultAxisX: { opposite: true },
			})
			.setTitle('Осциллограмма импульса')
			.setTitlePosition('center-top')
			.setPadding({ right: 5, left: 0, top: 0, bottom: 0 })
			.setTitleFont(font => font.setSize(16))
			.setTitleMargin(0)

		/*------------ Настройка взаимодействия с пользователем ------------*/
		this.timeChart.setUserInteractions({
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
		this.axisXTimeChart = this.timeChart
			.getDefaultAxisX()
			.setTitle('')
			.setUnits('нс')
			.setMarginAfterTicks(0)
			.setStrokeStyle(
				new SolidLine({
					thickness: 1,
					fillStyle: new SolidFill({ color: ColorHEX('#cfcfcf20') }),
				}),
			)

		/*------------ Настройка Оси Y ------------*/
		// this.axisYTimeChart = this.timeChart
		// 	.getDefaultAxisY()
		// 	.setDefaultInterval(state => ({
		// 		start: (state.dataMin ?? 0) - 5,
		// 		end: (state.dataMax ?? 0) + 12,
		// 	}))
		// 	.setStrokeStyle(emptyLine)
		// 	.setTickStrategy('Empty')
		// 	.setUserInteractions(undefined)

		/*-------------- Данные графика осциллограммы -----------------------------*/
		this.lineSeriesTimeChart = this.timeChart
			.addPointLineAreaSeries({ dataPattern: 'ProgressiveX' })
			.setName(`Осциллограмма импульса`)
			.setAreaFillStyle(emptyFill)
			.setPointFillStyle(emptyFill)
			.setStrokeStyle(stroke => stroke.setThickness(-1))

		/*---------- График спектра импульса -----------*/
		this.spectrumChart = lc
			.ChartXY({
				container: idContainerSpectrumChart,
				theme: platanTheme,
				defaultAxisX: { opposite: true },
			})
			.setTitle('Спектр импульса')
			.setTitlePosition('center-top')
			.setPadding({ right: 5, left: 0, top: 0, bottom: 0 })
			.setTitleFont(font => font.setSize(16))
			.setTitleMargin(0)

		/*------------ Настройка взаимодействия с пользователем ------------*/
		this.spectrumChart.setUserInteractions({
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
		/*-------------- Данные графика спектра -----------------------------*/
		this.lineSeriesSpectrumChart = this.spectrumChart
			.addPointLineAreaSeries({ dataPattern: 'ProgressiveX' })
			.setName(`Спектр импульса`)
			.setAreaFillStyle(emptyFill)
			.setPointFillStyle(emptyFill)
			.setStrokeStyle(stroke => stroke.setThickness(-1))

		/**----------- График интервалов импульса -------------*/
		this.intervalChart = lc
			.ChartXY({
				container: idContainerIntervalChart,
				theme: platanTheme,
				defaultAxisX: { opposite: true },
			})
			.setTitle('Интервалы импульсов')
			.setTitlePosition('center-top')
			.setPadding({ right: 5, left: 0, top: 0, bottom: 0 })
			.setTitleFont(font => font.setSize(16))
			.setTitleMargin(0)

		/*------------ Настройка взаимодействия с пользователем ------------*/
		this.intervalChart.setUserInteractions({
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
		/*-------------- Данные графика интервалов импульса -----------------------------*/
		this.lineSeriesIntervalChart = this.intervalChart
			.addPointLineAreaSeries({ dataPattern: 'ProgressiveX' })
			.setName(`Интервалы импульсов`)
			.setAreaFillStyle(emptyFill)
			.setPointFillStyle(emptyFill)
			.setStrokeStyle(stroke => stroke.setThickness(-1))

		console.log('create chart: ', this.chartName)
	}

	deleteInfoPulseChart() {
		console.log('delete chart: ', this.chartName)
		this.timeChart?.dispose()
		this.spectrumChart?.dispose()
		this.intervalChart?.dispose()
	}

	updateDataInfoPulseChart(data: any) {
		this.lineSeriesTimeChart?.clear()
		this.lineSeriesSpectrumChart?.clear()
		this.lineSeriesIntervalChart?.clear()
		// console.log('updateDataInfoPulseChart CLEANED')

		this.lineSeriesTimeChart?.appendJSON(data.Pulses.time[0], { x: 'x', y: 'y' })
		this.lineSeriesSpectrumChart?.appendJSON(data.Pulses.psd[0], { x: 'x', y: 'y' })
		this.lineSeriesIntervalChart?.appendJSON(data.Pulses.wobble[0], { x: 'x', y: 'y' })
		console.log('updateDataInfoPulseChart')
	}
}
export let infoPulseChart = new InfoPulseChart()
