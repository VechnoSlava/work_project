// Утилиты для линейки: иконка подписи и пересчёт точек трека.

import L, { LatLng, DivIcon } from 'leaflet'
import { RulerPoint, RulerTrack, DistUnit } from '../model/rulerTypes'
import { haversine, bearing, fmtDist } from './geoUtils'

/** DivIcon с подписью точки линейки */
export const makeRulerIcon = (p: RulerPoint, isFirst: boolean, unit: DistUnit): DivIcon => {
	const coordsLat = `ш: ${p.latlng.lat.toFixed(5)}°`
	const coordLng = `д: ${p.latlng.lng.toFixed(5)}°`

	const segLine =
		isFirst || p.distFromPrev === 0
			? ''
			: `<div style="color:#c8d6df">▲ ${fmtDist(p.distFromPrev, unit)}</div>`
	const angleLine =
		isFirst || p.angleToPrev === null
			? ''
			: `<div style="color:#a0c8d8">⊾ ${p.angleToPrev.toFixed(1)}°</div>`
	const totalLine = `<div style="color:#ffb74d;font-weight:600">Σ ${fmtDist(p.totalDist, unit)}</div>`

	const html = `
<div style="
	background:rgba(9,30,47,0.93);
	border:1px solid rgba(255,255,255,0.22);
	border-radius:4px;
	padding:4px 8px;
	font-size:11px;
	font-family:monospace;
	color:#4fc3f7;
	line-height:1.25;
	width:max-content;
	max-width:180px;
	box-sizing:border-box;
	pointer-events:none;
	filter:drop-shadow(0 1px 3px rgba(0,0,0,0.6));
">
	<div>${coordsLat}</div>
	<div>${coordLng}</div>
	${angleLine}${segLine}${totalLine}
</div>`

	return L.divIcon({ className: '', iconAnchor: [0, 0], iconSize: undefined, html })
}

/**
 * Пересчитывает distFromPrev, totalDist и angleToPrev для всех точек трека
 * начиная с pointIdx (после перемещения точки).
 */
export const recalcTrackPoints = (
	track: RulerTrack,
	pointIdx: number,
	newLatLng: LatLng,
): RulerPoint[] => {
	const pts = track.points.map(p => ({ ...p }))
	pts[pointIdx] = { ...pts[pointIdx], latlng: newLatLng }

	// Пересчёт от pointIdx до конца
	const startFrom = pointIdx === 0 ? 1 : pointIdx
	for (let i = startFrom; i < pts.length; i++) {
		const prev = pts[i - 1]
		const dist = haversine(prev.latlng, pts[i].latlng)
		pts[i] = {
			...pts[i],
			distFromPrev: dist,
			totalDist: prev.totalDist + dist,
			angleToPrev: bearing(prev.latlng, pts[i].latlng),
		}
	}

	return pts
}
