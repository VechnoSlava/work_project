// Чистые геодезические функции — без зависимостей от React и Leaflet UI.

import { LatLng } from 'leaflet'
import { CoordFormat, DistUnit } from '../model/rulerTypes'

export const toDMS = (deg: number): string => {
	const d = Math.floor(Math.abs(deg))
	const mFloat = (Math.abs(deg) - d) * 60
	const m = Math.floor(mFloat)
	const s = ((mFloat - m) * 60).toFixed(1)
	return `${deg < 0 ? '-' : ''}${d}° ${m}′ ${s}″`
}

export const fmtCoord = (val: number, format: CoordFormat): string =>
	format === 'decimal' ? `${val.toFixed(6)}°` : toDMS(val)

export const haversine = (a: LatLng, b: LatLng): number => {
	const R = 6371000
	const dLat = ((b.lat - a.lat) * Math.PI) / 180
	const dLng = ((b.lng - a.lng) * Math.PI) / 180
	const sinDLat = Math.sin(dLat / 2)
	const sinDLng = Math.sin(dLng / 2)
	const h =
		sinDLat * sinDLat +
		Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * sinDLng * sinDLng
	return 2 * R * Math.asin(Math.sqrt(h))
}

/** Азимут от a к b в градусах [0, 360) */
export const bearing = (a: LatLng, b: LatLng): number => {
	const lat1 = (a.lat * Math.PI) / 180
	const lat2 = (b.lat * Math.PI) / 180
	const dLng = ((b.lng - a.lng) * Math.PI) / 180
	const y = Math.sin(dLng) * Math.cos(lat2)
	const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
	return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

/** Умное форматирование: км — метры до 1 км, нм/ми — всегда в своих единицах */
export const fmtDist = (meters: number, unit: DistUnit): string => {
	if (unit === 'km') {
		if (meters < 1000) return `${Math.round(meters)} м`
		return `${(meters / 1000).toFixed(3)} км`
	}
	if (unit === 'nm') return `${(meters / 1852).toFixed(4)} нм`
	return `${(meters / 1609.344).toFixed(4)} ми`
}
