import {
	Axis,
	AxisTickStrategies,
	ChartXY,
	ColorHEX,
	ColorRGBA,
	CustomTick,
	emptyFill,
	emptyLine,
	NumericTickStrategy,
	PointLineAreaSeries,
	SolidFill,
	SolidLine,
	TickMarker,
	TickStyle,
	UIElementBuilders,
} from '@lightningchart/lcjs'
import { lc } from '../../../shared/libs/lightingChart/lcjs'
import { platanTheme } from '../../../shared/libs/lightingChart/theme'
import spectrumData from '../../../shared/dataTest/message.json'

/*Форматирование */
const freqTickFormatter = (tickValue: number) => {
	return `${tickValue / 1_000_000_000} ГГц`
}
const freqNumFormatter = (tickValue: number) => {
	return tickValue / 1_000_000_000
}

export class PanoramaSpectrumChart {
	// idContainerSpectrum: string
	// idContainerZoomBand: string
	// idContainerHeatMap: string
	chartName: string
	lineSeries: PointLineAreaSeries | undefined
	spectrumChart: ChartXY | undefined
	axisX: Axis | undefined
	axisY: Axis | undefined
	customTicks: CustomTick[] | undefined

	constructor() {
		this.chartName = 'Спектральная панорама'
	}

	createPanoramaChart(
		idContainerSpectrum: string,
		// idContainerZoomBand: string,
		// idContainerHeatMap: string,
	) {
		// Ширина спектральной панорамы 1ГГц - 11ГГц
		const startPointSpectrum = 1e9
		const endPointSpectrum = 11e9

		// Ширина окна панорамы 1ГГц - 2ГГц
		const startPointBand = 1e9
		const endPointBand = 2e9

		// this.deleteChart()

		this.spectrumChart = lc
			.ChartXY({
				container: idContainerSpectrum,
				theme: platanTheme,
				defaultAxisX: { opposite: true },
			})
			.setTitle('Панорама спектрального диапазона')
			.setTitlePosition('center-top')
			.setPadding({ right: 3, left: 0, top: 0, bottom: 2 })
			.setTitleFont(font => font.setSize(16))

		//Двойной клик мыши по фону сбрасывает масштабирование
		this.spectrumChart.onSeriesBackgroundMouseDoubleClick(() => {
			this.spectrumChart?.forEachAxis(axis => axis.fit())
		})

		//настройка оси X
		this.axisX = this.spectrumChart
			.getDefaultAxisX()
			.setTitle('')
			.setUnits('ГГц')
			.setMarginAfterTicks(0)
			.setStrokeStyle(
				new SolidLine({ thickness: 1, fillStyle: new SolidFill({ color: ColorHEX('#cfcfcf20') }) }),
			)
			.setDefaultInterval({ start: startPointBand, end: endPointBand })
			.setIntervalRestrictions({
				startMin: startPointSpectrum,
				startMax: endPointSpectrum,
				endMin: startPointSpectrum,
				endMax: endPointSpectrum,
			})
			.setMouseInteractions(false)

		// Configure NumericTickStrategy (настройка разметки оси X)
		// .setTickStrategy(AxisTickStrategies.Numeric, (tickStrategy: NumericTickStrategy) =>
		// 	tickStrategy
		// 		.setTickStyle((tickStyle: TickStyle) =>
		// 			tickStyle
		// 				.setLabelFillStyle(new SolidFill({ color: ColorHEX('#c4c4c4') }))
		// 				.setLabelFont(font => font.setWeight(400).setSize(14))
		// 				.setGridStrokeStyle(emptyLine)
		// 				// Сетка оси AxisX
		// 				.setGridStrokeStyle(
		// 					new SolidLine({
		// 						thickness: 1,
		// 						fillStyle: new SolidFill({ color: ColorHEX('#cfcfcf20') }),
		// 					}),
		// 				)
		// 				.setTickStyle(
		// 					new SolidLine({
		// 						thickness: 1,
		// 						fillStyle: new SolidFill({ color: ColorHEX('#636363ff') }),
		// 					}),
		// 				)
		// 				.setTickLength(20)
		// 				.setTickPadding(5),
		// 		)

		// 		.setMajorFormattingFunction(tickPosition => freqTickFormatter(tickPosition))
		// 		.setMajorTickStyle((tickStyle: TickStyle) =>
		// 			tickStyle
		// 				.setLabelFont(font => font.setWeight(400).setSize(14))
		// 				.setLabelAlignment(-1.3)
		// 				.setTickLength(-18)
		// 				.setTickPadding(0),
		// 		)

		// 		.setMinorFormattingFunction(tickPosition => freqTickFormatter(tickPosition))
		// 		.setMinorTickStyle((tickStyle: TickStyle) =>
		// 			tickStyle
		// 				.setLabelFont(font => font.setWeight(400).setSize(12))
		// 				.setLabelAlignment(-1.5)
		// 				.setTickLength(-14)
		// 				.setTickPadding(0),
		// 		),
		// )

		this.axisX.setTickStrategy(AxisTickStrategies.Numeric, strategy =>
			strategy.setCursorFormatter((value, range, locale) => freqNumFormatter(value).toFixed(3)),
		)

		this.axisX.onIntervalChange((_: Axis, start, end) => {
			// this.createTicksInRangeX(start, end)
			const divider = calculateDivider(start, end) // Определяем оптимальный делитель
			const { majorTicks, minorTicks } = createTicks(start, end, divider) // Генерируем отметки

			// Удаляем старые кастомные отметки
			this.customTicks?.forEach(tick => tick.dispose())
			this.customTicks = []

			// Добавляем новые основные отметки
			majorTicks.forEach(pos => this.addCustomTickX(pos, false))

			// Добавляем новые мелкие отметки
			minorTicks.forEach(pos => this.addCustomTickX(pos, true))
		})

		const calculateDivider = (start: number, end: number): number => {
			const range = end - start // Текущий диапазон графика
			const dividers = [1e9, 500e6, 200e6, 100e6, 50e6, 20e6, 10e6, 5e6, 2e6, 1e6] // Возможные делители

			for (const divider of dividers) {
				if (Math.floor(range / divider) <= 10) {
					// Ограничиваем максимальное количество отметок (например, до 10)
					return divider
				}
			}

			return 1e6 // Минимальный делитель по умолчанию
		}
		const createTicks = (start: number, end: number, divider: number) => {
			const majorTicks: number[] = []
			const minorTicks: number[] = []
			const minorStep = divider / 5 // Например, 5 мелких отметок между основными

			// Генерация основных отметок
			for (let i = Math.ceil(start / divider) * divider; i <= end; i += divider) {
				majorTicks.push(i)
			}

			// Генерация мелких отметок
			for (let i = Math.ceil(start / minorStep) * minorStep; i <= end; i += minorStep) {
				if (!majorTicks.includes(i)) {
					minorTicks.push(i)
				}
			}

			return { majorTicks, minorTicks }
		}

		this.axisY = this.spectrumChart
			.getDefaultAxisY()
			.setDefaultInterval(state => ({
				start: (state.dataMin ?? 0) - 5,
				end: (state.dataMax ?? 0) + 10,
			}))
			.setMouseInteractions(false) //управление осью Y
			.setChartInteractions(false)
			.setChartInteractionZoomByWheel(false)
			.setChartInteractionZoomByDrag(false)
			.setStrokeStyle(emptyLine)
			.setTickStrategy('Empty')

		//-------Курсор----------------------------------------------------------------
		this.spectrumChart.setCursorFormatting((_, hit, hits) => {
			return [
				[
					{
						text: `Параметры:`,
						fillStyle: new SolidFill({ color: ColorHEX('#17e380') }),
					},
				],
				// [hit.series], // returning a series will display the series color and its name automatically.
				[
					{
						text: `Частота`,
						fillStyle: new SolidFill({ color: ColorHEX('#63f7dc') }),
					},
					,
					'',
					{
						text: hit.axisX.formatValue(hit.x),
						fillStyle: new SolidFill({ color: ColorHEX('#63f7dc') }),
					},
					{
						text: `ГГц`,
						fillStyle: new SolidFill({ color: ColorHEX('#63f7dc') }),
					},
				],
				[
					{
						text: `Амплитуда`,
						fillStyle: new SolidFill({ color: ColorHEX('#63f7dc') }),
					},
					,
					'',
					{
						text: hit.y.toFixed(2),
						fillStyle: new SolidFill({ color: ColorHEX('#63f7dc') }),
					},
					{
						text: 'дБ',
						fillStyle: new SolidFill({ color: ColorHEX('#63f7dc') }),
					},
				],
			]
		})
		this.spectrumChart.setCursor(cursor =>
			cursor
				.setTickMarkerXVisible(false)
				.setTickMarkerYVisible(false)
				.setGridStrokeXStyle(
					new SolidLine({ thickness: 1, fillStyle: new SolidFill({ color: ColorHEX('#a6a6a6') }) }),
				)
				.setGridStrokeYStyle(
					new SolidLine({ thickness: 1, fillStyle: new SolidFill({ color: ColorHEX('#a6a6a6') }) }),
				),
		)
		//----------------------------------------------------------------------------
		// Сброс масштаба при двойном клике
		// 	const resetAxisXY = () => {
		// 	this.axisX?.fit()
		// 	this.axisY?.fit()
		// }
		// this.spectrumChart.onBackgroundMouseDoubleClick(resetAxisXY)
		// this.spectrumChart.onSeriesBackgroundMouseDoubleClick(resetAxisXY)
		//----------------------------------------------------------------------------
		/**Данные */
		this.lineSeries = this.spectrumChart
			.addPointLineAreaSeries({ dataPattern: 'ProgressiveX' })
			.setName(`Спектральная панорама`)
			.setAreaFillStyle(emptyFill)
			.setPointFillStyle(emptyFill)
			.appendJSON(spectrumData.points)
			.setStrokeStyle(stroke => stroke.setThickness(1))

		//-----------------------------------------------------------------------------

		console.log('create chart: ', this.chartName)
	}

	/*
	deleteChart() {
		console.log('delete chart: ', this.chartName)
		this.chart?.dispose()
		this.axisX?.dispose()
		this.axisY?.dispose()
		this.spectrum?.dispose()
		this.marker?.marker.dispose()
		this.chart = undefined
		this.axisX = undefined
		this.axisY = undefined
		this.spectrum = undefined
		this.marker = undefined
		store.dispatch(
			updateChartState({
				[this.chartName]: {
					show: false,
					chartWidth: 0,
					axisInterval: [0, 0],
				},
			}),
		)
	}

	updateSpectrum(fStart: number, fStep: number, spectrum: Int8Array, metadataList: Array<string>) {
		if (this.chart && this.spectrum) {
			this.spectrum.clear()
			this.spectrum.addArrayY(
				// @ts-ignore - Флаг для игнорирования ошибки, которая находится на одну строку ниже.
				// LCJS умеет работать с бинарными массивами, просто разработчики забыли добавить
				// в метод addArrayY типизацию: arrayY: number[] | TypedArray
				spectrum,
				fStep / 1e6,
				fStart / 1e6,
			)

			this.addMetadata(metadataList)
		}
	}
		*/
	addCustomTickX = (pos: number, isMinor: boolean) => {
		this.axisX?.setTickStrategy(AxisTickStrategies.Empty)
		const tickX = this.axisX?.addCustomTick(
			isMinor ? UIElementBuilders.AxisTickMinor : UIElementBuilders.AxisTickMajor,
		)
		// Проверить, что tick не undefined
		if (tickX) {
			this.customTicks?.push(tickX)
			console.log(this.customTicks)
		}

		return tickX
	}

	// createTicksInRangeX = (start: number, end: number) => {
	// 	// this.clearCustomTics()
	// 	console.log(`start value: ${start}, end value : ${end}`)
	// 	let divider = 500_000_000
	// 	for (let i = 100_000_000_000; i > 1; i = i / 10) {
	// 		if (Math.floor((end - start) / i)) {
	// 			divider = i / 2
	// 			break
	// 		}
	// 	}

	// 	const numMajorInterval = 3
	// 	const numMinorInterval = 5

	// 	const majorTickInterval = Math.ceil((end - start) / (numMajorInterval * divider)) * divider
	// 	for (
	// 		let majorTickPos = start - (start % majorTickInterval);
	// 		majorTickPos <= end;
	// 		majorTickPos += majorTickInterval
	// 	) {
	// 		if (majorTickPos >= start) {
	// 			this.addCustomTickX(majorTickPos, false)
	// 		}
	// 	}

	// 	let minorTickInterval = Math.floor(majorTickInterval / (numMinorInterval * 10)) * 10
	// 	for (
	// 		let minorTickPos = start - (start % minorTickInterval);
	// 		minorTickPos <= end;
	// 		minorTickPos += minorTickInterval
	// 	) {
	// 		if (minorTickPos >= start && minorTickPos % majorTickInterval !== 0) {
	// 			this.addCustomTickX(minorTickPos, true)
	// 		}
	// 	}
	// }

	// clearCustomTics() {
	// 	if (this.customTicks) {
	// 		while (this.customTicks.length > 0) {
	// 			const tic = this.customTicks.pop()
	// 			tic?.dispose()
	// 		}
	// 	}
	// }
}

export let spectrumPanoramaChart1 = new PanoramaSpectrumChart()
