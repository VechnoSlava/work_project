import { lc } from '../../../shared/libs/lightingChart/lcjs'
import { platanTheme } from '../../../shared/libs/lightingChart/theme'
import spectrumData from '../../../shared/dataTest/message.json'
import { ISpectrumPanorama } from '../../../shared/webSocket/IWebSocket'
import {
	LUT,
	ColorRGBA,
	SolidFill,
	ColorHEX,
	SolidLine,
	AxisTickStrategies,
	NumericTickStrategy,
	TickStyle,
	emptyLine,
	emptyFill,
	AxisScrollStrategies,
	PalettedFill,
} from '@lightningchart/lcjs'
import { log } from 'console'

// Цветовая палитра для теплового водопада
const WFPalette = new LUT({
	steps: [
		{ value: 0, color: ColorRGBA(53, 154, 208, 0) },
		{ value: 255 * 0.2, color: ColorRGBA(53, 154, 208, 255 * 0.2) },
		{ value: 255 * 0.4, color: ColorRGBA(53, 154, 208, 255 * 0.4) },
		{ value: 255 * 0.6, color: ColorRGBA(53, 154, 208, 255 * 0.6) },
		{ value: 255 * 0.8, color: ColorRGBA(53, 154, 208, 255 * 0.8) },
		{ value: 255, color: ColorRGBA(53, 154, 208, 255) },
	],
	interpolate: true,
})

// Ширина окна панорамы 1ГГц - 2ГГц
const startPointBand = 1e9
const endPointBand = 2e9

const totalPoint = 12 * 1024
/**
 * Нахождение минимальных и максимальных значений спектра
 * @param arr - принимаемый массив значений спектра
 */
function findMinMaxValues1(arr: Array<ISpectrumPanorama>) {
	let maxX = -Infinity
	let maxY = -Infinity
	let minX = Infinity
	let minY = Infinity

	for (let i = 0; i < arr.length; i++) {
		if (arr[i].x > maxX) maxX = arr[i].x
		if (arr[i].y > maxY) maxY = arr[i].y
		if (arr[i].x < minX) minX = arr[i].x
		if (arr[i].y < minY) minY = arr[i].y
	}

	return { maxX, maxY, minX, minY }
}

const { minX, maxX, minY, maxY } = findMinMaxValues1(spectrumData.points)

console.log(minX, maxX, minY, maxY)

const freqTickFormatter = (tickValue: number) => {
	return `                ${tickValue / 1_000_000_000} ГГц`
}
const freqNumFormatter = (tickValue: number) => {
	return tickValue / 1_000_000_000
}
//--------------------------------------------------------------------------
export const createSpectrumPanoramaChart = (
	idContainerSpectrum: string,
	idContainerBand: string,
	idContainerHeatMap: string,
) => {
	//------------------------------------------------------------------------
	/**Спектр-панорама */
	const spectrumChart = lc
		.ChartXY({
			theme: platanTheme,
			container: idContainerSpectrum,
			defaultAxisX: { opposite: true },
		})
		.setTitle('Панорама спектрального диапазона')
		.setTitlePosition('center-top')
		.setPadding({ right: 3, left: 0, top: 0, bottom: 2 })
		.setTitleFont(font => font.setSize(16))
	// .setBackgroundFillStyle(new SolidFill({ color: ColorHEX('#112d49') }))

	//Двойной клик мыши по фону сбрасывает масштабирование
	spectrumChart.onSeriesBackgroundMouseDoubleClick(() => {
		spectrumChart.forEachAxis(axis => axis.fit())
	})

	//настройка оси X
	const axisX = spectrumChart
		.getDefaultAxisX()
		.setTitle('')
		.setUnits('ГГц')
		.setMarginAfterTicks(0)
		.setStrokeStyle(
			new SolidLine({ thickness: 1, fillStyle: new SolidFill({ color: ColorHEX('#cfcfcf20') }) }),
		)
		.setDefaultInterval({ start: startPointBand, end: endPointBand })
		.setInterval({ start: minX, end: maxX })
		.setMouseInteractions(false)

		// Configure NumericTickStrategy (настройка разметки оси X)
		.setTickStrategy(AxisTickStrategies.Numeric, (tickStrategy: NumericTickStrategy) =>
			tickStrategy
				.setTickStyle((tickStyle: TickStyle) =>
					tickStyle
						.setLabelFillStyle(new SolidFill({ color: ColorHEX('#c4c4c4') }))
						.setLabelFont(font => font.setWeight(400).setSize(14))
						.setGridStrokeStyle(emptyLine)
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
								fillStyle: new SolidFill({ color: ColorHEX('#636363ff') }),
							}),
						)
						.setTickLength(20)
						.setTickPadding(5),
				)

				.setMajorFormattingFunction(tickPosition => freqTickFormatter(tickPosition))
				.setMajorTickStyle((tickStyle: TickStyle) =>
					tickStyle
						.setLabelFont(font => font.setWeight(400).setSize(14))
						.setTickLength(-18)
						.setTickPadding(0),
				)

				.setMinorFormattingFunction(tickPosition => freqTickFormatter(tickPosition))
				.setMinorTickStyle((tickStyle: TickStyle) =>
					tickStyle
						.setLabelFont(font => font.setWeight(400).setSize(12))
						.setTickLength(-14)
						.setTickPadding(0),
				),
		)

	axisX.setTickStrategy(AxisTickStrategies.Numeric, strategy =>
		strategy.setCursorFormatter((value, range, locale) => freqNumFormatter(value).toFixed(3)),
	)

	const axisY = spectrumChart
		.getDefaultAxisY()
		.setDefaultInterval({ start: -5, end: 120 })
		.setMouseInteractions(false) //управление осью Y
		.setChartInteractions(false)
		.setChartInteractionZoomByWheel(false)
		.setChartInteractionZoomByDrag(false)
		.setStrokeStyle(emptyLine)
		.setTickStrategy('Empty')

	//-------Курсор----------------------------------------------------------------
	spectrumChart.setCursorFormatting((_, hit, hits) => {
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
	spectrumChart.setCursor(cursor =>
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
	/**Данные */
	const lineSeries = spectrumChart
		.addPointLineAreaSeries({ dataPattern: 'ProgressiveX' })
		.setName(`Спектральная панорама`)
		.setAreaFillStyle(emptyFill)
		.setPointFillStyle(emptyFill)
		// .add(spectrumData.points)
		.appendJSON(spectrumData.points)
		// .appendJSON(panoramaSpectrumData.get() as unknown as { [key: string]: number }[])
		.setStrokeStyle(stroke => stroke.setThickness(-1))

	//-----------------------------------------------------------------------------
	/**Окно видимой части спектр-панорамы */
	const zoomBandChart = lc
		.ZoomBandChart({
			container: idContainerBand,
			theme: platanTheme,
		})
		.setTitle('')
		.setPadding({ right: 3, left: 0, top: 0, bottom: 0 })
		.setSeriesBackgroundStrokeStyle(emptyLine)
		// .setBackgroundFillStyle(new SolidFill({ color: ColorHEX('#112d49') }))
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
	zoomBandChart.add(lineSeries)

	const axisBandX = zoomBandChart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.Empty)

	//-----------------------------------------------------------------------------
	/** Водопад тепловой карты */
	const watterfall = lc
		.ChartXY({
			theme: platanTheme,
			container: idContainerHeatMap,
		})
		.setTitle('')
		.setTitlePosition('center-top')
		.setPadding({ right: 3, left: 0, top: 0, bottom: 0 })
		.setBackgroundStrokeStyle(emptyLine)
		// .setBackgroundFillStyle(new SolidFill({ color: ColorHEX('#112d49') }))
		.setMouseInteractions(false) //Отключение действий мыши

	const axisXWF = watterfall
		.getDefaultAxisX()
		.setMouseInteractions(false) //управление осью X
		.setChartInteractions(false)
		.setStrokeStyle(emptyLine)
		// 	// .setAnimationZoom(undefined)
		.setTickStrategy(AxisTickStrategies.Empty)
		.setInterval({ start: 0, end: totalPoint, stopAxisAfter: true })

	const axisYWF = watterfall
		.getDefaultAxisY()
		.setChartInteractions(false)
		.setMouseInteractions(false) //управление осью Y
		.setStrokeStyle(emptyLine)
		.setScrollStrategy(undefined)
		.setAnimationZoom(undefined)
		.setScrollStrategy(AxisScrollStrategies.progressive)
		.setTickStrategy(AxisTickStrategies.Empty)

	const heatmapSeries = watterfall
		.addHeatmapScrollingGridSeries({
			scrollDimension: 'rows',
			resolution: 1024 * 12,
		})
		.setWireframeStyle(emptyLine)
		.setFillStyle(new PalettedFill({ lut: WFPalette }))
		.setWireframeStyle(emptyLine)

	heatmapSeries.addIntensityValues([spectrumData.psd])
}
