import {
	Axis,
	AxisTickStrategies,
	ChartXY,
	ColorHEX,
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

const freqTickFormatter = (tickValue: number) => {
	return `${tickValue / 1_000_000_000} ГГц`
}

const tickNumFormatter = (tickValue: number): number => {
	return tickValue / 1_000_000_000
}

const calculateDivider = (start: number, end: number): number => {
	const range = end - start
	const dividers = [10e9, 1e9, 500e6, 200e6, 100e6, 50e6, 20e6, 10e6, 5e6, 2e6, 1e6]

	for (const divider of dividers) {
		if (Math.floor(range / divider) <= 10) {
			return divider
		}
	}
	return 1e6
}

const createTicks = (start: number, end: number, divider: number) => {
	const majorTicks: number[] = []
	const minorTicks: number[] = []
	const minorStep = divider / 5

	for (let i = Math.ceil(start / divider) * divider; i <= end; i += divider) {
		majorTicks.push(i)
	}

	for (let i = Math.ceil(start / minorStep) * minorStep; i <= end; i += minorStep) {
		if (!majorTicks.includes(i)) {
			minorTicks.push(i)
		}
	}
	return { majorTicks, minorTicks }
}

const startPointSpectrum = 1e9
const endPointSpectrum = 11e9
const startPointBand = 1e9
const endPointBand = 2e9

export class PanoramaSpectrumChart {
	chartName: string
	lineSeries: PointLineAreaSeries | undefined
	spectrumChart: ChartXY | undefined
	axisX: Axis | undefined
	axisY: Axis | undefined
	customTicks: CustomTick[] = []

	constructor() {
		this.chartName = 'Спектральная панорама'
	}

	createPanoramaChart(idContainerSpectrum: string) {
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
			.setTickStrategy(AxisTickStrategies.Numeric, (tickStrategy: NumericTickStrategy) =>
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
							.setTickStyle(
								new SolidLine({
									thickness: 1,
									fillStyle: new SolidFill({ color: ColorHEX('#636363ff') }),
								}),
							)
							.setTickLength(20)
							.setTickPadding(5),
					)
					.setMajorFormattingFunction(freqTickFormatter),
			)

		this.axisX.onIntervalChange((_, start, end) => {
			const divider = calculateDivider(start, end)
			const { majorTicks, minorTicks } = createTicks(start, end, divider)

			this.customTicks.forEach(tick => tick.dispose())
			majorTicks.forEach(pos => this.addCustomTickX(pos, false))
			minorTicks.forEach(pos => this.addCustomTickX(pos, true))
			// console.log(this.customTicks)
		})

		this.axisY = this.spectrumChart
			.getDefaultAxisY()
			.setDefaultInterval(state => ({
				start: (state.dataMin ?? 0) - 5,
				end: (state.dataMax ?? 0) + 10,
			}))
			.setMouseInteractions(false)
			.setChartInteractions(false)
			.setChartInteractionZoomByWheel(false)
			.setChartInteractionZoomByDrag(false)
			.setStrokeStyle(emptyLine)
			.setTickStrategy('Empty')

		this.lineSeries = this.spectrumChart
			.addPointLineAreaSeries({ dataPattern: 'ProgressiveX' })
			.setName(`Спектральная панорама`)
			.setAreaFillStyle(emptyFill)
			.setPointFillStyle(emptyFill)
			.appendJSON(spectrumData.points)
			.setStrokeStyle(stroke => stroke.setThickness(1))

		console.log('create chart: ', this.chartName)
	}

	addCustomTickX(pos: number, isMinor: boolean) {
		// this.clearCustomTics()

		const tick = this.axisX?.addCustomTick(
			isMinor ? UIElementBuilders.AxisTickMinor : UIElementBuilders.AxisTickMajor,
		)
		console.log(this.customTicks)

		if (tick) this.customTicks.push(tick)

		return tick
	}
}
export let spectrumPanoramaChart1 = new PanoramaSpectrumChart()
