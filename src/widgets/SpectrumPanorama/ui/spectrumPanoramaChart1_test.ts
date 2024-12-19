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
}

export let spectrumPanoramaChart1 = new PanoramaSpectrumChart()
