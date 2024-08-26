import {
	AxisTickStrategies,
	ColorHEX,
	ColorRGBA,
	emptyFill,
	emptyLine,
	ImageFill,
	LUT,
	PalettedFill,
	SolidFill,
	SolidLine,
	synchronizeAxisIntervals,
	Themes,
	TickStyle,
} from '@arction/lcjs'
import { lc } from '../../../shared/libs/lightingChart/lcjs'
import { platanTheme } from '../../../shared/libs/lightingChart/theme'
import spectrumData from '../../../shared/dataTest/message.json'
import { ISpectrumPanorama } from '../../../shared/webSocket/IWebSocket'

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

//Границы окна панорамы 1ГГц - 2ГГц
const startPointBand = 1e9
const endPointBand = 2e9

console.log(spectrumData.points.length)
console.log(spectrumData.psd.length)

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

console.log(minX)

const freqTickFormatter = (tickValue: number) => {
	return `${tickValue / 1_000_000_000} ГГц`
}

export const createSpectrumPanoramaChart = (
	idContainerSpectrum: string,
	idContainerBand: string,
	idContainerHeatMap: string,
) => {
	/**Спектр-панорама */
	const spectrumChart = lc
		.ChartXY({
			theme: platanTheme,
			container: idContainerSpectrum,
			defaultAxisX: { opposite: true },
		})
		.setTitle('Панорама спектрального диапазона')
		.setTitlePosition('center-top')
		.setPadding({ right: 3, left: 3, top: 0, bottom: 0 })
		.setTitleFont(font => font.setSize(16))
		.setBackgroundFillStyle(new SolidFill({ color: ColorHEX('#112d49') }))

	//Двойной клик мыши по фону сбрасывает масштабирование
	spectrumChart.onSeriesBackgroundMouseDoubleClick(() => {
		spectrumChart.forEachAxis(axis => axis.fit())
	})

	//настройка оси X
	const axisX = spectrumChart
		.getDefaultAxisX()
		.setTitle('')
		.setMarginAfterTicks(0)
		.setStrokeStyle(emptyLine)
		.setDefaultInterval({ start: startPointBand, end: endPointBand })
		.setInterval({ start: minX, end: maxX })
		.setMouseInteractions(false)

		// Configure NumericTickStrategy (настройка разметки оси X)
		.setTickStrategy(AxisTickStrategies.Numeric, tickStrategy =>
			tickStrategy
				.setTickStyle((tickStyle: TickStyle) =>
					tickStyle
						.setLabelFillStyle(new SolidFill({ color: ColorHEX('#c4c4c4') }))
						.setLabelFont(font => font.setWeight(400).setSize(14))
						.setGridStrokeStyle(
							new SolidLine({
								thickness: 1,
								fillStyle: new SolidFill({ color: ColorHEX('#cfcfcf20') }),
							}),
						)
						.setTickLength(0)
						.setTickPadding(5),
				)

				.setMajorFormattingFunction(tickPosition => freqTickFormatter(tickPosition))
				.setMajorTickStyle((tickStyle: TickStyle) =>
					tickStyle.setLabelFont(font => font.setWeight(400).setSize(14)),
				)

				.setMinorFormattingFunction(tickPosition => freqTickFormatter(tickPosition))
				.setMinorTickStyle((tickStyle: TickStyle) =>
					tickStyle.setLabelFont(font => font.setWeight(400).setSize(12)),
				),
		)

	//настройка разметки оси X
	// const tickX = axisX.addCustomTick().setValue(2)

	// .setTextFormatter(value => freqFormatter(value))
	// .setMarker(
	// 	marker =>
	// 		marker
	// 			.setTextFont(font => font.setSize(isMinor ? 10 : 12))
	// 			.setTextFillStyle(new SolidFill({ color: ColorRGBA(255, 255, 255, 255) })),
	// 	// .setTextFillStyle(new SolidFill({ color: ColorRGBA(255, 255, 255, 255) }))
	// )

	//Синхронизация осей частоты
	// synchronizeAxisIntervals(spectrumChart.getDefaultAxisX(), axisX)

	const axisY = spectrumChart
		.getDefaultAxisY()
		.setDefaultInterval({ start: -5, end: 120 })
		.setMouseInteractions(false) //управление осью Y
		.setChartInteractions(false)
		.setChartInteractionZoomByWheel(false)
		.setChartInteractionZoomByDrag(false)
		.setStrokeStyle(
			new SolidLine({ thickness: 1, fillStyle: new SolidFill({ color: ColorHEX('#cfcfcf20') }) }),
		)

	const lineSeries = spectrumChart
		.addPointLineAreaSeries({ dataPattern: 'ProgressiveX' })
		.setAreaFillStyle(emptyFill)
		.setPointFillStyle(emptyFill)
		.add(spectrumData.points)

	/**Окно видимой части спектр-панорамы */
	const zoomBandChart = lc
		.ZoomBandChart({
			container: idContainerBand,
			theme: platanTheme,
		})
		.setTitle('')
		.setSeriesBackgroundStrokeStyle(emptyLine)
		.setBackgroundFillStyle(new SolidFill({ color: ColorHEX('#112d49') }))
	zoomBandChart.add(lineSeries)

	const axisBandX = zoomBandChart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.Empty)

	/** Водопад тепловой карты */
	const watterfall = lc
		.ChartXY({
			theme: platanTheme,
			container: idContainerHeatMap,
		})
		.setTitle('')
		.setTitlePosition('center-top')
		.setPadding({ right: 3, left: 3, top: 0, bottom: 0 })
		.setBackgroundFillStyle(new SolidFill({ color: ColorHEX('#112d49') }))

	const heatmapSeries = watterfall
		.addHeatmapScrollingGridSeries({
			scrollDimension: 'rows',
			resolution: 1024 * 12,
			start: { x: 0, y: 0 },
			step: { x: 1, y: 1 },
		})
		// .setFillStyle(new SolidFill({ color: ColorHEX('#ff6a00') }))
		.setWireframeStyle(emptyLine)
		.setFillStyle(new PalettedFill({ lut: WFPalette }))

	heatmapSeries.addIntensityValues([spectrumData.psd])
	const axisWatterFallX = watterfall.getDefaultAxisX()
	// .setScrollStrategy(AxisScrollStrategies.fitting)
	// synchronizeAxisIntervals(spectrumChart.getDefaultAxisX(), axisWatterFallX)
	// Связка масштабирования спектра и тепловой карты
	// axisX.onIntervalChange((start, end) => {
	// 	heatmapChart.getDefaultAxisX().setInterval(start, end)
	// })
}
