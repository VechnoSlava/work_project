import { LatLng } from 'leaflet'

export type DistUnit = 'km' | 'nm' | 'mi'
export type CoordFormat = 'decimal' | 'dms'

export interface RulerPoint {
	latlng: LatLng
	distFromPrev: number // метров
	totalDist: number // метров
	angleToPrev: number | null // азимут от предыдущей точки, градусы
}

export interface RulerTrack {
	id: number
	points: RulerPoint[]
	finished: boolean
}
