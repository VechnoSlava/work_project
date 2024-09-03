import {
	AxisScrollStrategies,
	AxisTickStrategies,
	ColorHEX,
	ColorRGBA,
	emptyFill,
	emptyLine,
	LUT,
	NumericTickStrategy,
	PalettedFill,
	SolidFill,
	SolidLine,
	synchronizeAxisIntervals,
	TickStyle,
} from '@arction/lcjs'
import { lc } from '../../../shared/libs/lightingChart/lcjs'
import { platanTheme } from '../../../shared/libs/lightingChart/theme'
import spectrumData from '../../../shared/dataTest/message.json'
import { ISpectrumPanorama } from '../../../shared/webSocket/IWebSocket'

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

const freqTickFormatter = (tickValue: number) => {
	return `${tickValue / 1_000_000_000} ГГц`
}
const freqNumFormatter = (tickValue: number) => {
	return tickValue / 1_000_000_000
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
						// .setGridStrokeStyle(
						// 	new SolidLine({
						// 		thickness: 1,
						// 		fillStyle: new SolidFill({ color: ColorHEX('#cfcfcf20') }),
						// 	}),
						// )
						.setTickStyle(
							new SolidLine({
								thickness: 1,
								fillStyle: new SolidFill({ color: ColorHEX('#636363ff') }),
							}),
						)
						.setTickLength(0)
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

	axisX.setTickStrategy(AxisTickStrategies.Numeric, ticks =>
		ticks.setCursorFormatter((value, range, locale) => freqNumFormatter(value).toFixed(3)),
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
		.setTickStrategy(AxisTickStrategies.Numeric, tickStrategy =>
			tickStrategy.setTickStyle((tickStyle: TickStyle) =>
				tickStyle
					.setLabelFillStyle(emptyFill)
					.setLabelFont(font => font.setWeight(400).setSize(14))
					.setGridStrokeStyle(emptyLine)
					// .setGridStrokeStyle(
					// 	new SolidLine({
					// 		thickness: 1,
					// 		fillStyle: new SolidFill({ color: ColorHEX('#cfcfcf20') }),
					// 	}),
					// )
					.setTickLength(0)
					.setTickPadding(5),
			),
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
		.setPadding({ right: 3, left: 3, top: 4, bottom: 4 })
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
		.setBackgroundStrokeStyle(emptyLine)
		.setBackgroundFillStyle(new SolidFill({ color: ColorHEX('#112d49') }))
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
		// .setTickStrategy(AxisTickStrategies.Time)
		// .setInterval({ start: -30 * 1000, end: 0 })
		.setScrollStrategy(AxisScrollStrategies.progressive)
		.setTickStrategy(AxisTickStrategies.Empty)

	const heatmapSeries = watterfall
		.addHeatmapScrollingGridSeries({
			scrollDimension: 'rows',
			resolution: 1024 * 12,
			start: { x: 0, y: 0 },
			step: { x: 1, y: 1 },
		})
		.setWireframeStyle(emptyLine)
		.setFillStyle(new PalettedFill({ lut: WFPalette }))
		// .setDataCleaning({
		// 	minDataPointCount: 1000,
		// })
		.setWireframeStyle(emptyLine)
	heatmapSeries.addIntensityValues([spectrumData.psd])
}
