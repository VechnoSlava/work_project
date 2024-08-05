import {
	AxisScrollStrategies,
	AxisTickStrategies,
	ColorHEX,
	DashedLine,
	emptyFill,
	emptyLine,
	FontSettings,
	ImageFill,
	SolidFill,
} from '@arction/lcjs'
import { lc } from '../../../shared/libs/lightingChart/lcjs'
import { platanTheme } from '../../../shared/libs/lightingChart/theme'
const threshold = 70
export const createSpectrum = (idContainerSpectrum: string, idContainerBand: string) => {
	/**Спектр-панорама */
	const panoramaSpectrumChart = lc
		.ChartXY({
			theme: platanTheme,
			container: idContainerSpectrum,
		})
		.setTitle('Панорама спектрального диапазона')
		.setTitlePosition('center-top')
		.setPadding({ right: 3, left: 3, top: 0, bottom: 0 })
		.setTitleFont(font => font.setSize(16))
		.setBackgroundFillStyle(new SolidFill({ color: ColorHEX('#112d49') }))
	// .setCursor(cursor => cursor.setGridStrokeXStyle(emptyLine).setGridStrokeYStyle(emptyLine))
	/*
	//Chart built-in interactions
	// panoramaSpectrumChart
	// 	.setMouseInteractionPan(false) //перемещение графика зажатой ПКМ
	// 	.setMouseInteractionWheelZoom(false) //управление зум с помощью колесика
	// 	.setMouseInteractionRectangleZoom(false) //увеличение масштаба зажатой ЛКМ вправо
	// 	.setMouseInteractionRectangleFit(false) //уменьшение масштаба зажатой ЛКМ влево

	// Disable all interactions
	// panoramaSpectrumChart.setMouseInteractionRectangleFit(false)
	*/

	//Двойной клик мыши по фону сбрасывает масштабирование
	panoramaSpectrumChart.onSeriesBackgroundMouseDoubleClick(() => {
		panoramaSpectrumChart.forEachAxis(axis => axis.fit())
	})

	//настройка оси X
	const axisX = panoramaSpectrumChart
		.getDefaultAxisX()
		.setTitle('Частота')
		.setTickStrategy(AxisTickStrategies.Time)
		.setScrollStrategy(AxisScrollStrategies.progressive)
		.setDefaultInterval(state => ({
			end: state.dataMax ?? 0,
			start: (state.dataMax ?? 0) - 15_000,
			stopAxisAfter: false,
		}))

	const axisY = panoramaSpectrumChart.getDefaultAxisY().setDefaultInterval({ start: 0, end: 100 })
	// .setMouseInteractions(false) //управление осью Y

	const eventSeries = panoramaSpectrumChart
		.addPointLineAreaSeries({ dataPattern: null })
		.setAreaFillStyle(emptyFill)
		.setStrokeStyle(emptyLine)
		.setAutoScrollingEnabled(false)
		.setCursorEnabled(false)
	// eventSeries.setPointAlignment({ x: 0, y: -1.1 }).setPointSize(0.8)

	const lineSeries = panoramaSpectrumChart
		.addPointLineAreaSeries({ dataPattern: 'ProgressiveX' })
		.setAreaFillStyle(emptyFill)
		.setMaxSampleCount(100_000)

	/**Полоса спектр-панорамы */
	const zoomBandChart = lc
		.ZoomBandChart({
			container: idContainerBand,
			theme: platanTheme,
		})
		.setTitle('')
		.setBackgroundFillStyle(new SolidFill({ color: ColorHEX('#112d49') }))

	zoomBandChart
		.add(eventSeries)
		.setAutoScrollingEnabled(false)
		.setPointAlignment({ x: 0, y: -1.1 })
		.setPointSize(0.5)
	zoomBandChart.add(lineSeries)
	zoomBandChart.getDefaultAxisY().setInterval({ start: 0, end: 100 })
	let yPrev = 50
	setInterval(() => {
		const x = performance.now()
		const y = yPrev + (Math.random() - 0.4)
		lineSeries.appendSample({ x, y })
		yPrev = y
		if (y > threshold) {
			yPrev *= Math.random()
			// Add automatically generated event indicator at X + Y location.
			eventSeries.appendSample({ x, y })
		}
	}, 1000 / 60)
}
