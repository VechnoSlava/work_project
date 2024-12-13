class ChartSpectrumChan {
	chan: 0 | 1
	chartName: 'spectrumChan0' | 'spectrumChan1'
	chart: ChartXY | undefined
	axisX: Axis | undefined
	axisY: Axis | undefined
	spectrum: AreaSeriesPositive | undefined
	marker: IMarker | undefined
	metadataList: Array<UIElement> | undefined

	constructor(chan: 0 | 1) {
		this.chan = chan
		this.chartName = `spectrumChan${chan}`
	}

	createChart(theme: string, idContainer: string) {
		let chartAxisLimit = [...store.getState().commonData.chartAxisLimits[this.chartName]]
		if (chartAxisLimit[0] === 0 && chartAxisLimit[1] === 0) {
			return
		}

		chartAxisLimit[0] = chartAxisLimit[0] / 1e6
		chartAxisLimit[1] = chartAxisLimit[1] / 1e6

		this.deleteChart()

		this.chart = lc
			.ChartXY({
				container: idContainer,
				theme: theme === 'dark' ? Themes.turquoiseHexagon : Themes.light,
			})
			.setTitle('')
			.setPadding({ right: 1, left: 0, top: 10 })
			.setMouseInteractionWheelZoom(false)
			.setMouseInteractionRectangleZoom(false)
			.setMouseInteractionRectangleFit(false)

		this.axisX = this.chart
			.getDefaultAxisX()
			.setTitle('')
			.setAnimationsEnabled(false)
			.setNibMousePickingAreaSize(0)
			.setDefaultInterval({ start: chartAxisLimit[0], end: chartAxisLimit[1] })
			.setIntervalRestrictions({
				startMin: chartAxisLimit[0],
				startMax: chartAxisLimit[1],
				endMin: chartAxisLimit[0],
				endMax: chartAxisLimit[1],
			})

		this.axisX.onAxisInteractionAreaMouseDoubleClick(axis => {
			// Без задержки очень медленно изменяет масштаб оси
			setTimeout(() => {
				axis.fit()
			}, 100)
		})

		let timer: NodeJS.Timer
		this.axisX.onIntervalChange((axis: Axis, start: number, end: number) => {
			clearTimeout(timer)
			timer = setTimeout(() => {
				store.dispatch(
					updateChartState({
						[this.chartName]: {
							axisInterval: [start * 1e6, end * 1e6] as [number, number],
						},
					}),
				)
			}, 500)
		})

		this.axisY = this.chart
			.getDefaultAxisY()
			.setTitle('')
			.setThickness(store.getState().appData.view.maxWidth ? 0 : 50)
			.setNibMousePickingAreaSize(0)

		const resetAxisXY = () => {
			this.axisX?.fit()
			this.axisY?.fit()
		}

		this.chart.onBackgroundMouseDoubleClick(resetAxisXY)
		this.chart.onSeriesBackgroundMouseDoubleClick(resetAxisXY)

		// const legendBox = chart.addLegendBox(HorizontalLegendBoxBuilders);

		this.spectrum = this.chart
			.addAreaSeries({ type: AreaSeriesTypes.Positive, baseline: -30 })
			.setName('Sp')
			.setCursorInterpolationEnabled(false)
			.setCursorResultTableFormatter((tableBuilder, series, position, high, low) => {
				return tableBuilder
					.addRow(`F:`, '', position.toFixed(1), '', 'МГц')
					.addRow(`P:`, '', high.toFixed(1), '', 'дБ')
			})

		this.spectrum.onMouseDoubleClick(resetAxisXY)
		// legendBox.add(areaSpectrum)

		// =====================================================
		// =================== markerSpectrum ==================
		this.marker = {
			marker: this.spectrum.addMarker(SeriesMarkerBuilder).setVisible(false),

			isOn: false,
			setOn: (newState: boolean) => {
				if (!this.chart || !this.marker?.marker || !this.axisX) return

				this.marker.isOn = newState
				if (newState) {
					const currentInterval = this.axisX.getInterval()
					this.marker.marker
						.setPosition({
							x: (currentInterval.start + currentInterval.end) / 2,
							y: 0,
						})
						.setVisible(true)
				} else {
					this.marker.marker.setVisible(false)
				}
			},
		}

		let show = store.getState().appData.view.chartSpectrumChan
		if (window.innerWidth < 500) {
			show &&= store.getState().appData.view.displayedChan === this.chan
		}

		store.dispatch(
			updateChartState({
				[this.chartName]: {
					show: show,
					chartWidth: this.getChartWidth(),
					axisInterval: [chartAxisLimit[0] * 1e6, chartAxisLimit[1] * 1e6],
					metadata: false,
				},
			}),
		)

		console.log('create chart: ', this.chartName)
	}

	addMetadata(metadataList: Array<string>) {
		if (!this.chart) return

		if (this.metadataList) {
			for (let i = 0; i < this.metadataList.length; i++) {
				this.metadataList[i].dispose()
			}
		}

		this.metadataList = []
		for (let i = 0; i < metadataList.length; i++) {
			this.metadataList[i] = this.chart
				.addUIElement(UIElementBuilders.TextBox)
				.setOrigin({ x: 1, y: 1 })
				.setMouseInteractions(false)
				.setPosition({ x: 100, y: 90 - 6 * i })
				.setText(metadataList[i])
		}
	}

	getChartWidth() {
		if (!this.chart || !this.axisY) return
		console.log('getChartWidth getSizePixels', this.chart.getSizePixels().x)
		console.log('getChartWidth getPadding', this.chart.getPadding().left)
		console.log('getChartWidth getPadding', this.chart.getPadding().right)
		return (
			this.chart.getSizePixels().x -
			this.chart.getPadding().left -
			this.chart.getPadding().right -
			(this.axisY.getThickness().max ?? 0)
		)
	}

	setMaxWidth(state: boolean) {
		if (this.axisY) {
			if (state) {
				this.axisY.setThickness(0)
			} else {
				this.axisY.setThickness(50)
			}
		}
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
