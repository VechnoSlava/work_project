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
import {
	cursorGridStrokeStyle,
	tickNumFormatter,
	tickTextFormatter,
	WFPalette,
} from '../model/settingsSpectrumPanorama'

export class PanoramaSpectrumChart {
	chartName: string
	spectrumChart: ChartXY | undefined
	zoomBandChart: ZoomBandChart | undefined
	waterfall: ChartXY | undefined
	lineSeries: PointLineAreaSeries | undefined
	heatmapSeries: HeatmapScrollingGridSeriesIntensityValues | undefined
	axisX: Axis | undefined
	axisY: Axis | undefined
	axisBandX: Axis | undefined
	axisXWF: Axis | undefined
	axisYWF: Axis | undefined
	customTicks: CustomTick[] = []

	constructor() {
		this.chartName = 'Спектральная панорама'
	}

	createPanoramaChart(
		idContainerSpectrum: string,
		idContainerZoomBand: string,
		idContainerHeatMap: string,
	) {
		const startPointBand = 1e9
		const endPointBand = 3e9

		/*------------ График панорамы ------------*/
		this.spectrumChart = lc
			.ChartXY({
				container: idContainerSpectrum,
				theme: platanTheme,
				defaultAxisX: { opposite: true },
			})
			.setTitle('Панорама спектрального диапазона')
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
		/*------------ Настройка Оси X ------------*/
		this.axisX = this.spectrumChart
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
			.setDefaultInterval({ start: startPointBand, end: endPointBand })

		// Configure NumericTickStrategy (настройка разметки оси X)
		this.axisX
			.setTickStrategy(AxisTickStrategies.Numeric, (tickStrategy: NumericTickStrategy) =>
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
			.setTickStrategy(AxisTickStrategies.Numeric, (tickStrategy: NumericTickStrategy) =>
				tickStrategy.setCursorFormatter((value, range, locale) =>
					tickNumFormatter(value).toFixed(3),
				),
			)

		/*------------ Настройка Оси Y ------------*/
		this.axisY = this.spectrumChart
			.getDefaultAxisY()
			.setDefaultInterval(state => ({
				start: (state.dataMin ?? 0) - 5,
				end: (state.dataMax ?? 0) + 12,
			}))
			.setStrokeStyle(emptyLine)
			.setTickStrategy('Empty')
			.setUserInteractions(undefined)

		/*------------- Настройка Курсора ------------------------*/
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
						text: `Параметры`,
						fillStyle: new SolidFill({ color: ColorHEX('#17dce3') }),
					},
				],
				// [hit.series], // Имя LineSeries
				[
					{
						text: `Частота:`,
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
						text: `Амплитуда:`,
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

		/*-------------- Данные -----------------------------*/
		this.lineSeries = this.spectrumChart
			.addPointLineAreaSeries({ dataPattern: 'ProgressiveX' })
			.setName(`Спектральная панорама`)
			.setAreaFillStyle(emptyFill)
			.setPointFillStyle(emptyFill)
			.setStrokeStyle(stroke => stroke.setThickness(-1))

		/*---------- Окно видимой части спектр-панорамы -----------*/
		this.zoomBandChart = lc
			.ZoomBandChart({
				container: idContainerZoomBand,
				theme: platanTheme,
			})
			.setTitle('')
			.setPadding({ right: 5, left: 0, top: 0, bottom: 0 })
			.setSeriesBackgroundStrokeStyle(emptyLine)
			.setSplitterStrokeStyle(
				new SolidLine({
					thickness: 1,
					fillStyle: new SolidFill({ color: ColorHEX('#1f5961') }),
				}),
			)
			.setDefocusOverlayFillStyle(new SolidFill({ color: ColorHEX('#00000049') }))
			.setKnobSize({ x: 6, y: 20 })
			.setKnobFillStyle(new SolidFill({ color: ColorHEX('#00d6d6') }))
			.setKnobStrokeStyle(
				new SolidLine({ thickness: 1, fillStyle: new SolidFill({ color: ColorHEX('#1f5961') }) }),
			)

		if (this.lineSeries) {
			this.zoomBandChart?.add(this.lineSeries)
		} else {
			console.log('Line series is not initialized yet.')
		}
		this.axisBandX = this.zoomBandChart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.Empty)

		/**----------- Водопад тепловой карты -------------*/
		this.waterfall = lc
			.ChartXY({
				container: idContainerHeatMap,
				theme: platanTheme,
			})
			.setTitle('')
			.setPadding({ right: 5, left: 0, top: 0, bottom: 0 })
			.setBackgroundStrokeStyle(emptyLine)

		this.waterfall.setUserInteractions(undefined)

		this.axisXWF = this.waterfall
			.getDefaultAxisX()
			.setStrokeStyle(emptyLine)
			.setAnimationZoom(undefined)
			.setTickStrategy(AxisTickStrategies.Empty)

		this.axisYWF = this.waterfall
			.getDefaultAxisY()
			.setDefaultInterval(state => ({
				start: (state.dataMax ?? 0) - 100,
				end: state.dataMax ?? 0,
				stopAxisAfter: false,
			}))
			.setStrokeStyle(emptyLine)
			.setAnimationZoom(undefined)
			.setTickStrategy(AxisTickStrategies.Empty)
			.setScrollStrategy(AxisScrollStrategies.progressive)

		this.heatmapSeries = this.waterfall
			.addHeatmapScrollingGridSeries({
				scrollDimension: 'rows',
				resolution: 1024 * 12,
			})
			.setFillStyle(new PalettedFill({ lut: WFPalette }))
			.setWireframeStyle(emptyLine)
			.setDataCleaning({ minDataPointCount: 1000 })
			.setName('Тест')

		this.waterfall?.setCursor(cursor =>
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

		this.waterfall.setCursorFormatting((_, hit, hits) => {
			if (!isHitHeatmap(hit)) return undefined
			// `hit` is for a heatmap series
			return [
				[
					{
						text: `СПМ`,
						fillStyle: new SolidFill({ color: ColorHEX('#17dce3') }),
					},
				],
				[
					{
						text: `Отсчет по оси X:`,
						fillStyle: new SolidFill({ color: ColorHEX('#63f7dc') }),
					},
					'',
					{
						text: hit.column.toFixed(0),
						fillStyle: new SolidFill({ color: ColorHEX('#63f7dc') }),
					},
				],
				[
					{
						text: `Отсчет по оси Y:`,
						fillStyle: new SolidFill({ color: ColorHEX('#63f7dc') }),
					},
					'',
					{
						text: hit.row.toFixed(0),
						fillStyle: new SolidFill({ color: ColorHEX('#63f7dc') }),
					},
				],
				[
					{
						text: `Интенсивность:`,
						fillStyle: new SolidFill({ color: ColorHEX('#63f7dc') }),
					},
					'',
					{
						text: hit.intensity.toFixed(3),
						fillStyle: new SolidFill({ color: ColorHEX('#63f7dc') }),
					},
				],
			]
		})

		console.log('create chart: ', this.chartName)
	}

	deletePanoramaChart() {
		console.log('delete chart: ', this.chartName)
		this.spectrumChart?.dispose()
		this.zoomBandChart?.dispose()
		this.waterfall?.dispose()
	}

	updateData(data: any) {
		this.lineSeries?.clear()
		// const arrX = data.points.map((point: any) => point.x)
		// const arrY = data.points.map((point: any) => point.y)
		// this.lineSeries?.addArraysXY(arrX, arrY)
		this.lineSeries?.appendJSON(data.points, { x: 'x', y: 'y' })
		this.heatmapSeries?.addIntensityValues([data.psd])
		console.log('updateDataPanorama')
	}
}
export let spectrumPanoramaChart = new PanoramaSpectrumChart()
