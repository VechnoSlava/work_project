import {
	AxisScrollStrategies,
	AxisTickStrategies,
	ColorHEX,
	DashedLine,
	emptyFill,
	emptyLine,
	ImageFill,
	SolidFill,
} from '@arction/lcjs'
import { lc } from '../../../shared/libs/lightingChart/lcjs'
import { platanTheme } from '../../../shared/libs/lightingChart/theme'

export const createSpectrum = (divContainer: HTMLDivElement) => {
	const containerChart1 = document.createElement('div')
	const containerChart2 = document.createElement('div')
	divContainer.append(containerChart1)
	divContainer.append(containerChart2)

	containerChart1.style.width = '100%'
	containerChart1.style.height = '70%'
	containerChart2.style.width = '100%'
	containerChart2.style.height = '30%'

	const threshold = 70
	const chart = lc
		.ChartXY({
			theme: platanTheme,
			container: containerChart1,
		})
		.setTitle('Спектр сигнала')
		.setTitlePosition('center-top')
		.setPadding(0)

		.setMouseInteractions(false)
		.setBackgroundFillStyle(new SolidFill({ color: ColorHEX('#112d49') }))

	const timeAxis = chart
		.getDefaultAxisX()
		.setTickStrategy(AxisTickStrategies.Time)
		.setScrollStrategy(AxisScrollStrategies.progressive)
		.setDefaultInterval(state => ({
			end: state.dataMax ?? 0,
			start: (state.dataMax ?? 0) - 15_000,
			stopAxisAfter: false,
		}))
	const axisY = chart.getDefaultAxisY().setDefaultInterval({ start: 0, end: 100 })

	const eventSeries = chart
		.addPointLineAreaSeries({ dataPattern: null })
		.setAreaFillStyle(emptyFill)
		.setStrokeStyle(emptyLine)
		.setAutoScrollingEnabled(false)
		.setCursorEnabled(false)
	const warningImage = new Image()
	warningImage.crossOrigin = ''
	warningImage.src = document.head.baseURI + 'examples/assets/0054/warning.png'
	eventSeries
		.setPointFillStyle(new ImageFill({ source: warningImage }))
		.setPointAlignment({ x: 0, y: -1.1 })
		.setPointSize(0.8)

	const lineSeries = chart
		.addPointLineAreaSeries({ dataPattern: 'ProgressiveX' })
		.setAreaFillStyle(emptyFill)
		.setMaxSampleCount(100_000)
	axisY
		.addConstantLine()
		.setValue(threshold)
		.setStrokeStyle(stroke => new DashedLine({ fillStyle: stroke.getFillStyle() }))

	const zoomBandChart = lc.ZoomBandChart({ container: containerChart2, theme: platanTheme })
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

// //Settings font and color
// .setTitleFont(
// 	new FontSettings({
// 		family: 'sans-serif',
// 		size: 16,
// 		weight: 'normal',
// 		style: 'normal',
// 	}),
// )

// const chart2 = lc
// 	.ChartXY({
// 		container: idContainer,
// 	})
// 	.setTitle('Спектр сигнала 2')
// 	.setTitlePosition('center-top')
// 	.setPadding(0)
// 	.setMouseInteractions(false)
