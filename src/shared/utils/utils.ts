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

export { formatNumber, formatCoords, formatDateTimeRu }
