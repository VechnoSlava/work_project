import {
	Axis,
	AxisTickStrategies,
	ChartXY,
	ColorHEX,
	emptyFill,
	emptyLine,
	NumericTickStrategy,
	PointLineAreaSeries,
	SolidFill,
	SolidLine,
	TickStyle,
} from '@lightningchart/lcjs'
import { lc } from '../../../shared/libs/lightingChart/lcjs'
import { platanTheme } from '../../../shared/libs/lightingChart/theme'
import {
	cursorGridStrokeStyle,
	cursorTextColor,
	setIntervalSpectrumAxisXY,
	setIntervalTimeAxisXY,
	tickTextFormatter,
	timeTickFormatter,
	userInteractions,
} from '../model/settingsInfoPulseChart'
import { IWebSocket } from '../../../shared/webSocket/IWebSocket'

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
			.setTitleFont(font => font.setSize(14))
			.setTitleMargin(0)

		/*--- Настройка взаимодействия с пользователем ---*/
		userInteractions(this.timeChart)
		/*------------ Настройка Оси X ------------*/
		this.axisXTimeChart = this.timeChart
			.getDefaultAxisX()
			.setTitle('')
			// .setUnits('нс')
			.setMarginAfterTicks(0)
			.setStrokeStyle(
				new SolidLine({
					thickness: 1,
					fillStyle: new SolidFill({ color: ColorHEX('#cfcfcf20') }),
				}),
			)
		// .setStrokeStyle(emptyLine)

		// Configure NumericTickStrategy (настройка разметки оси X)
		this.axisXTimeChart.setTickStrategy(
			AxisTickStrategies.Numeric,
			(tickStrategy: NumericTickStrategy) =>
				tickStrategy
					.setTickStyle((tickStyle: TickStyle) =>
						tickStyle
							.setLabelFillStyle(new SolidFill({ color: ColorHEX('#c4c4c4') }))
							.setLabelFont(font => font.setSize(12))
							// Сетка оси AxisX
							.setGridStrokeStyle(
								new SolidLine({
									thickness: 1,
									fillStyle: new SolidFill({ color: ColorHEX('#cfcfcf20') }),
								}),
							)
							.setTickStyle(
								new SolidLine({
									thickness: 1,
									fillStyle: new SolidFill({ color: ColorHEX('#aaaaaaff') }),
								}),
							),
					)
					.setMajorTickStyle((tickStyle: TickStyle) =>
						tickStyle
							.setLabelFont(font => font.setWeight(400).setSize(14))
							.setLabelAlignment(-1.2)
							.setTickLength(-18)
							.setTickPadding(0),
					)
					.setMinorTickStyle((tickStyle: TickStyle) =>
						tickStyle
							.setLabelFont(font => font.setWeight(400).setSize(12))
							.setLabelAlignment(-1.2)
							.setTickLength(-13)
							.setTickPadding(2),
					)
					.setMajorFormattingFunction(tickPosition => timeTickFormatter(tickPosition))
					.setMinorFormattingFunction(tickPosition => timeTickFormatter(tickPosition)),
		)
		// .setTickStrategy(AxisTickStrategies.Numeric, (tickStrategy: NumericTickStrategy) =>
		// 	tickStrategy.setCursorFormatter((value, range, locale) => timeCursorFormatter(value)),
		// )
		/*------------ Настройка Оси Y ------------*/
		this.axisYTimeChart = this.timeChart
			.getDefaultAxisY()
			.setStrokeStyle(emptyLine)
			.setTickStrategy('Empty')
			.setUserInteractions(undefined)

		/*------------- Настройка Курсора ------------------------*/
		this.timeChart.setCursor(cursor =>
			cursor
				.setTickMarkerXVisible(false)
				.setTickMarkerYVisible(false)
				.setGridStrokeXStyle(cursorGridStrokeStyle)
				.setGridStrokeYStyle(cursorGridStrokeStyle),
		)
		this.timeChart.setCursorFormatting((_, hit, hits) => {
			return [
				[
					{
						text: 'Амплитуда:',
						fillStyle: cursorTextColor,
					},

					'',
					{
						text: hit.y.toFixed(2),
						fillStyle: cursorTextColor,
					},
					{
						text: 'дБ',
						fillStyle: cursorTextColor,
					},
				],
				[
					{
						text: `Время:`,
						fillStyle: cursorTextColor,
					},
					,
					'',
					{
						text: hit.axisX.formatValue(hit.x),
						fillStyle: cursorTextColor,
					},
					{
						text: 'нс',
						fillStyle: cursorTextColor,
					},
				],
			]
		})

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
			.setTitleFont(font => font.setSize(14))
			.setTitleMargin(0)
		/*--- Настройка взаимодействия с пользователем ---*/
		userInteractions(this.spectrumChart)
		/*------------ Настройка Оси X ------------*/
		this.axisXSpectrumChart = this.spectrumChart
			.getDefaultAxisX()
			.setTitle('')
			.setUnits('ГГц')
			.setMarginAfterTicks(0)
			.setStrokeStyle(
				new SolidLine({
					thickness: 1,
					fillStyle: new SolidFill({ color: ColorHEX('#cfcfcf20') }),
				}),
			)

		// Configure NumericTickStrategy (настройка разметки оси X)
		this.axisXSpectrumChart.setTickStrategy(
			AxisTickStrategies.Numeric,
			(tickStrategy: NumericTickStrategy) =>
				tickStrategy
					.setTickStyle((tickStyle: TickStyle) =>
						tickStyle
							.setLabelFillStyle(new SolidFill({ color: ColorHEX('#c4c4c4') }))
							.setLabelFont(font => font.setSize(14))
							// Сетка оси AxisX
							.setGridStrokeStyle(emptyLine)
							.setGridStrokeStyle(
								new SolidLine({
									thickness: 1,
									fillStyle: new SolidFill({ color: ColorHEX('#cfcfcf20') }),
								}),
							)
							.setTickStyle(
								new SolidLine({
									thickness: 1,
									fillStyle: new SolidFill({ color: ColorHEX('#aaaaaaff') }),
								}),
							),
					)
					.setMajorTickStyle((tickStyle: TickStyle) =>
						tickStyle
							.setLabelFont(font => font.setWeight(400).setSize(14))
							.setLabelAlignment(-1.2)
							.setTickLength(-18)
							.setTickPadding(0),
					)
					.setMinorTickStyle((tickStyle: TickStyle) =>
						tickStyle
							.setLabelFont(font => font.setWeight(400).setSize(12))
							.setLabelAlignment(-1.2)
							.setTickLength(-14)
							.setTickPadding(0),
					)
					.setMajorFormattingFunction(tickPosition => tickTextFormatter(tickPosition))
					.setMinorFormattingFunction(tickPosition => tickTextFormatter(tickPosition)),
		)
		/*------------ Настройка Оси Y ------------*/
		this.axisYSpectrumChart = this.spectrumChart
			.getDefaultAxisY()
			.setStrokeStyle(emptyLine)
			.setTickStrategy('Empty')
			.setUserInteractions(undefined)

		/*--- Данные графика спектра ---*/
		this.lineSeriesSpectrumChart = this.spectrumChart
			.addPointLineAreaSeries({ dataPattern: 'ProgressiveX' })
			.setName(`Спектр импульса`)
			.setAreaFillStyle(emptyFill)
			.setPointFillStyle(emptyFill)
			.setStrokeStyle(stroke => stroke.setThickness(-1))
		/*--- Настройка Курсора ---*/
		this.spectrumChart.setCursor(cursor =>
			cursor
				.setTickMarkerXVisible(false)
				.setTickMarkerYVisible(false)
				.setGridStrokeXStyle(cursorGridStrokeStyle)
				.setGridStrokeYStyle(cursorGridStrokeStyle),
		)
		this.spectrumChart.setCursorFormatting((_, hit, hits) => {
			return [
				[
					{
						text: `Амплитуда:`,
						fillStyle: cursorTextColor,
					},
					,
					'',
					{
						text: hit.y.toFixed(2),
						fillStyle: cursorTextColor,
					},
					{
						text: 'дБ',
						fillStyle: cursorTextColor,
					},
				],
				[
					{
						text: `Частота:`,
						fillStyle: cursorTextColor,
					},
					,
					'',
					{
						text: hit.axisX.formatValue(hit.x),
						fillStyle: cursorTextColor,
					},
					{
						text: `ГГц`,
						fillStyle: cursorTextColor,
					},
				],
			]
		})

		/*--- График интервалов импульса ---*/
		this.intervalChart = lc
			.ChartXY({
				container: idContainerIntervalChart,
				theme: platanTheme,
				defaultAxisX: { opposite: false },
			})
			.setTitle('График интервалов импульсов')
			.setTitlePosition('center-top')
			.setPadding({ right: 5, left: 0, top: 0, bottom: 0 })
			.setTitleFont(font => font.setSize(14))
			.setTitleMargin(0)
			.setUserInteractions(undefined)

		/*------------ Настройка Оси X ------------*/
		this.axisXIntervalChart = this.intervalChart
			.getDefaultAxisX()
			.setMarginAfterTicks(0)
			.setStrokeStyle(emptyLine)
			.setTickStrategy('Empty')

		this.axisYIntervalChart = this.intervalChart
			.getDefaultAxisY()
			.setStrokeStyle(emptyLine)
			.setTickStrategy('Empty')
			.setUserInteractions(undefined)
		/*--- Настройка курсора ---*/
		this.intervalChart.setCursor(cursor =>
			cursor
				.setTickMarkerXVisible(false)
				.setTickMarkerYVisible(false)
				.setGridStrokeXStyle(cursorGridStrokeStyle)
				.setGridStrokeYStyle(cursorGridStrokeStyle),
		)
		/*--- Данные графика интервалов импульса ---*/
		this.lineSeriesIntervalChart = this.intervalChart
			.addPointLineAreaSeries({ dataPattern: 'ProgressiveX' })
			.setName(`Интервалы импульсов`)
			.setAreaFillStyle(emptyFill)
			.setPointFillStyle(emptyFill)
			.setStrokeStyle(stroke => stroke.setThickness(-1))

		console.log('create chart: ', this.chartName)
	}

	cleanInfoPulseChart() {
		this.lineSeriesTimeChart?.clear()
		this.lineSeriesSpectrumChart?.clear()
		this.lineSeriesIntervalChart?.clear()
		// console.log('CLEANED chart: ', this.chartName)
		// console.log(
		// 	this.lineSeriesTimeChart,
		// 	this.lineSeriesSpectrumChart,
		// 	this.lineSeriesIntervalChart,
		// )
	}

	deleteInfoPulseChart() {
		this.lineSeriesTimeChart?.clear()
		this.lineSeriesSpectrumChart?.clear()
		this.lineSeriesIntervalChart?.clear()
		this.timeChart?.dispose()
		this.spectrumChart?.dispose()
		this.intervalChart?.dispose()
		console.log('delete chart: ', this.chartName)
	}

	updateDataInfoPulseChart(data: IWebSocket['pulseInfo']) {
		this.lineSeriesTimeChart?.clear()
		this.lineSeriesSpectrumChart?.clear()
		this.lineSeriesIntervalChart?.clear()

		this.lineSeriesTimeChart?.appendJSON(data.Pulses.time[0], { x: 'x', y: 'y' })
		this.lineSeriesSpectrumChart?.appendJSON(data.Pulses.psd[0], { x: 'x', y: 'y' })
		this.lineSeriesIntervalChart?.appendJSON(data.Pulses.wobble[0], { x: 'x', y: 'y' })

		if (this.axisYTimeChart && this.axisXTimeChart && this.lineSeriesTimeChart) {
			setIntervalTimeAxisXY(this.axisXTimeChart, this.axisYTimeChart, this.lineSeriesTimeChart)
		}

		if (this.axisYSpectrumChart && this.axisXSpectrumChart && this.lineSeriesSpectrumChart) {
			setIntervalSpectrumAxisXY(
				this.axisXSpectrumChart,
				this.axisYSpectrumChart,
				this.lineSeriesSpectrumChart,
			)
		}

		console.log('updateDataInfoPulseChart')
	}
}
export let infoPulseChart = new InfoPulseChart()
