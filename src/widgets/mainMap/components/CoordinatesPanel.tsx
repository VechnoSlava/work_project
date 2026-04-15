import { useState } from 'react'
import { useMapEvents } from 'react-leaflet'
import { CoordFormat } from '../model/rulerTypes'
import { fmtCoord } from '../lib/geoUtils'
import { PANEL_STYLE } from '../lib/mapStyles'

export const CoordinatesPanel = () => {
	const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
	const [format, setFormat] = useState<CoordFormat>('decimal')

	useMapEvents({
		mousemove(e) {
			setCoords({ lat: e.latlng.lat, lng: e.latlng.lng })
		},
		mouseout() {
			setCoords(null)
		},
	})

	return (
		<div
			style={{
				...PANEL_STYLE,
				position: 'absolute',
				bottom: 12,
				left: 12,
				zIndex: 1000,
				display: 'flex',
				alignItems: 'center',
				gap: 8,
				padding: '4px 10px',
			}}
		>
			<span style={{ fontSize: 12, color: '#c8d6df', fontFamily: 'monospace', minWidth: 160 }}>
				{coords ? `Ш: ${fmtCoord(coords.lat, format)}` : 'Ш: —'}
			</span>
			<span style={{ fontSize: 12, color: '#8f8f8f' }}>|</span>
			<span style={{ fontSize: 12, color: '#c8d6df', fontFamily: 'monospace', minWidth: 160 }}>
				{coords ? `Д: ${fmtCoord(coords.lng, format)}` : 'Д: —'}
			</span>
			<button
				onClick={() => setFormat(f => (f === 'decimal' ? 'dms' : 'decimal'))}
				style={{
					marginLeft: 4,
					background: 'rgba(255,255,255,0.08)',
					border: '1px solid rgba(255,255,255,0.15)',
					borderRadius: 3,
					color: '#4fc3f7',
					fontSize: 11,
					padding: '2px 7px',
					cursor: 'pointer',
					whiteSpace: 'nowrap',
				}}
			>
				{format === 'decimal' ? 'ГМС' : 'DD'}
			</button>
		</div>
	)
}
