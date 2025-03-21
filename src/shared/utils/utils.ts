/*Форматеры для чисел и координат */
const numberFormatter = new Intl.NumberFormat('ru', {
	style: 'decimal',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
})

const coordsFormatter = new Intl.NumberFormat('ru', {
	style: 'decimal',
	minimumFractionDigits: 3,
	maximumFractionDigits: 6,
})

/**
 * Returns formatted number in Ru format.
 * @param num - input number in unknown format.
 */
function formatNumber(num: number) {
	return numberFormatter.format(num)
}

/**
 * Returns formatted coords in Ru format.
 * @param num - input coords (number format).
 */
function formatCoords(num: number) {
	return coordsFormatter.format(num)
}

/**
 * Returns date and time in Ru format.
 * @param dateTimeString Input string date and time in ISO format.
 */
function formatDateTimeRu(dateTimeString: string): string {
	const date = new Date(dateTimeString)
	const dateFormatter = new Intl.DateTimeFormat('ru', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
	const timeFormatter = new Intl.DateTimeFormat('ru', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	})
	const formattedDate = dateFormatter.format(date)
	const formattedTime = timeFormatter.format(date)
	return `${formattedDate}, ${formattedTime}`
}

/**
 * Return color HEX-format for radarTable.
 * @param seed Input id radar for generation.
 */
const generateDistinctColor = (seed: number): string => {
	const goldenRatio = 0.618033988749895
	const hue = (seed * goldenRatio * 360) % 360
	const saturation = 70
	const lightness = 60

	// Конвертация HSL в HEX
	const h = hue / 360
	const s = saturation / 100
	const l = lightness / 100

	let r: number, g: number, b: number

	if (s === 0) {
		r = g = b = l
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1
			if (t > 1) t -= 1
			if (t < 1 / 6) return p + (q - p) * 6 * t
			if (t < 1 / 2) return q
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
			return p
		}

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s
		const p = 2 * l - q

		r = hue2rgb(p, q, h + 1 / 3)
		g = hue2rgb(p, q, h)
		b = hue2rgb(p, q, h - 1 / 3)
	}

	const toHex = (x: number) => {
		const hex = Math.round(x * 255).toString(16)
		return hex.length === 1 ? '0' + hex : hex
	}

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

//RGBA
// const generateDistinctColor = (seed: number): string => {
// 	const goldenRatio = 0.618033988749895
// 	const hue = (seed * goldenRatio * 360) % 360

// 	// Конвертация HSL to RGB (упрощенная версия)
// 	const h = hue / 60
// 	const c = 0.7 // Насыщенность (70%)
// 	const l = 0.6 // Яркость (60%)
// 	const x = c * (1 - Math.abs((h % 2) - 1))

// 	let r = 0,
// 		g = 0,
// 		b = 0

// 	if (h >= 0 && h < 1) [r, g, b] = [c, x, 0]
// 	else if (h < 2) [r, g, b] = [x, c, 0]
// 	else if (h < 3) [r, g, b] = [0, c, x]
// 	else if (h < 4) [r, g, b] = [0, x, c]
// 	else if (h < 5) [r, g, b] = [x, 0, c]
// 	else [r, g, b] = [c, 0, x]

// 	// Коррекция яркости
// 	const m = l - c / 2
// 	r = Math.round((r + m) * 255)
// 	g = Math.round((g + m) * 255)
// 	b = Math.round((b + m) * 255)

// 	return `rgba(${r}, ${g}, ${b}, 1)`
// }
// HSL
// const generateDistinctColor = (seed: number): string => {
// 	// Используем золотое сечение для распределения оттенков
// 	const goldenRatio = 0.618033988749895
// 	const hue = (seed * goldenRatio * 360) % 360
// 	return `hsl(${hue}, 70%, 60%)`
// }
export { formatNumber, formatCoords, formatDateTimeRu, generateDistinctColor }
