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
	PointLineSeries,
	SolidFill,
	SolidLine,
	TickStyle,
	ZoomBandChart,
} from '@lightningchart/lcjs'
import { lc } from '../../../shared/libs/lightingChart/lcjs'
import { platanTheme } from '../../../shared/libs/lightingChart/theme'
import spectrumData from '../../../shared/dataTest/message.json'
import { tickNumFormatter, tickTextFormatter } from '../model/settingsSpectrumPanorama'

export class PanoramaSpectrumChart {
	chartName: string
	lineSeries: PointLineAreaSeries | undefined
	spectrumChart: ChartXY | undefined
	zoomBandChart: ZoomBandChart | undefined
	axisX: Axis | undefined
	axisY: Axis | undefined
	axisBandX: Axis | undefined
	customTicks: CustomTick[] = []

	constructor() {
		this.chartName = 'Спектральная панорама'
	}

	createPanoramaChart(
		idContainerSpectrum: string,
		idContainerZoomBand: string,
		idContainerHeatMap: string,
	) {
		const startPointSpectrum = 1e9
		const endPointSpectrum = 11e9
		const startPointBand = 1e9
		const endPointBand = 2e9

		this.spectrumChart = lc
			.ChartXY({
				container: idContainerSpectrum,
				theme: platanTheme,
				defaultAxisX: { opposite: true },
			})
			.setTitle('Панорама спектрального диапазона')
			.setTitlePosition('center-top')
			.setPadding({ right: 5, left: -5, top: 0, bottom: 0 })
			.setTitleFont(font => font.setSize(16))
			.setTitleMargin({ top: 0, bottom: 0 })

		this.spectrumChart.onSeriesBackgroundMouseDoubleClick(() => {
			this.spectrumChart?.forEachAxis(axis => axis.fit())
		})

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
			.setIntervalRestrictions({
				startMin: startPointSpectrum,
				startMax: endPointSpectrum,
				endMin: startPointSpectrum,
				endMax: endPointSpectrum,
			})
			.setMouseInteractions(false)
			// Configure NumericTickStrategy (настройка разметки оси X)
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
			.setTickStrategy(AxisTickStrategies.Numeric, strategy =>
				strategy.setCursorFormatter((value, range, locale) => tickNumFormatter(value).toFixed(3)),
			)

		this.axisY = this.spectrumChart
			.getDefaultAxisY()
			.setDefaultInterval(state => ({
				start: (state.dataMin ?? 0) - 5,
				end: (state.dataMax ?? 0) + 12,
			}))
			.setMouseInteractions(false)
			.setChartInteractions(false)
			.setChartInteractionZoomByWheel(false)
			.setChartInteractionZoomByDrag(false)
			.setStrokeStyle(emptyLine)
			.setTickStrategy('Empty')

		//------Курсор--------------------------------------------------
		this.spectrumChart.setCursorFormatting((_, hit, hits) => {
			return [
				[
					{
						text: `Параметры:`,
						fillStyle: new SolidFill({ color: ColorHEX('#17dce3') }),
					},
				],
				// [hit.series], // Имя LineSeries
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
		/*---------- Окно видимой части спектр-панорамы -----------*/
		this.zoomBandChart = lc
			.ZoomBandChart({
				container: idContainerZoomBand,
				theme: platanTheme,
			})
			.setTitle('')
			.setPadding({ right: 5, left: -5, top: 0, bottom: 0 })
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
			console.error('Line series is not initialized yet.')
		}
		// this.zoomBandChart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.Empty)

		/*-------------- Данные -----------------------------*/
		this.lineSeries = this.spectrumChart
			.addPointLineAreaSeries({ dataPattern: 'ProgressiveX' })
			.setName(`Спектральная панорама`)
			.setAreaFillStyle(emptyFill)
			.setPointFillStyle(emptyFill)
			.setStrokeStyle(stroke => stroke.setThickness(1))

		this.lineSeries.appendJSON(spectrumData.points)

		console.log(this.lineSeries)

		console.log('create chart: ', this.chartName)
	}

	// updateData(data:any){
	// 	this.lineSeries?.appendJSON(data)
	// 	this.zoomBandChart?.add(this.lineSeries)
	// }
}
export let spectrumPanoramaChart1 = new PanoramaSpectrumChart()
