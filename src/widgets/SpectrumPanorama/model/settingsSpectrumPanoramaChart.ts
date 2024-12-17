// * Manage X Axis ticks with custom logic *
// Disable default X ticks.
const xAxis = chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.Empty)

const addCustomTickX = (pos, isMinor) => {
	const tick = xAxis
		.addCustomTick(isMinor ? UIElementBuilders.AxisTickMinor : UIElementBuilders.AxisTickMajor)
		// Set tick text.
		.setTextFormatter(() => String(pos))
		// Set tick location.
		.setValue(pos)
	customTicks.push(tick)
	return tick
}

// Create custom ticks on X Axis on realtime scrolling application.
let customTicks: any[] = []
const createTicksInRangeX = (start, end) => {
	// Major ticks every 1000 units.
	const majorTickInterval = 1000
	for (
		let majorTickPos = start - (start % majorTickInterval);
		majorTickPos <= end;
		majorTickPos += majorTickInterval
	) {
		if (majorTickPos >= start) {
			addCustomTickX(majorTickPos, false)
		}
	}
	// Major ticks every 100 units, but not at same interval as major ticks.
	const minorTickInterval = 100
	for (
		let minorTickPos = start - (start % minorTickInterval);
		minorTickPos <= end;
		minorTickPos += minorTickInterval
	) {
		if (minorTickPos >= start && minorTickPos % majorTickInterval !== 0) {
			addCustomTickX(minorTickPos, true)
		}
	}
}
// X range until which custom ticks are valid.
let customTicksPos = 0
xAxis.onIntervalChange((_, start, end) => {
	// Ensure new ticks are created.
	if (end > customTicksPos) {
		createTicksInRangeX(customTicksPos, end)
		customTicksPos = end
	}

	// Destroy ticks that are out of scrolling range.
	customTicks = customTicks.filter(tick => {
		if (tick.getValue() < start) {
			// Tick is out of view.
			tick.dispose()
			return false
		} else {
			return true
		}
	})
})

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
