import { useEffect, useRef, useState } from 'react'
import { CircleMarker, Polygon, useMap, useMapEvents } from 'react-leaflet'

interface PolygonEditorProps {
	area: { name: string; latLng: { lat: number; lng: number }[][] }
	onSave: (points: { lat: number; lng: number }[]) => void
	onCancel: () => void
}

export const PolygonEditor = ({ area, onSave, onCancel }: PolygonEditorProps) => {
	const map = useMap()
	const [editPoints, setEditPoints] = useState(area.latLng[0].map(p => ({ ...p })))
	const draggingIndexRef = useRef<number | null>(null)

	// Центрируем карту на редактируемой области
	useEffect(() => {
		const lats = area.latLng[0].map(p => p.lat)
		const lngs = area.latLng[0].map(p => p.lng)
		map.setView(
			[(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lngs) + Math.max(...lngs)) / 2],
			map.getZoom(),
		)
	}, [])

	useMapEvents({
		mousemove(e) {
			if (draggingIndexRef.current !== null && e.originalEvent.buttons === 1) {
				const idx = draggingIndexRef.current
				setEditPoints(prev => {
					const next = [...prev]
					next[idx] = { lat: e.latlng.lat, lng: e.latlng.lng }
					return next
				})
			}
		},
		mouseup() {
			draggingIndexRef.current = null
			map.dragging.enable()
		},
	})

	// Кнопки «Применить» / «Отмена» поверх карты через DOM
	useEffect(() => {
		const container = map.getContainer()
		const div = document.createElement('div')
		div.style.cssText =
			'position:absolute;bottom:40px;left:50%;transform:translateX(-50%);z-index:1000;display:flex;gap:8px;pointer-events:all;'

		const cancelBtn = document.createElement('button')
		cancelBtn.textContent = 'Отмена'
		cancelBtn.style.cssText =
			'padding:6px 16px;border-radius:4px;border:1px solid rgba(255,255,255,0.2);background:rgba(9,30,47,0.88);color:#c8d6df;cursor:pointer;font-size:13px;'
		cancelBtn.onclick = onCancel

		const saveBtn = document.createElement('button')
		saveBtn.textContent = 'Применить'
		saveBtn.style.cssText =
			'padding:6px 16px;border-radius:4px;border:none;background:#4fc3f7;color:#fff;cursor:pointer;font-size:13px;font-weight:500;'
		saveBtn.onclick = () => onSave(editPoints)

		div.appendChild(cancelBtn)
		div.appendChild(saveBtn)
		container.appendChild(div)

		return () => {
			container.removeChild(div)
		}
	}, [editPoints, onSave, onCancel])

	return (
		<>
			<Polygon
				positions={editPoints.map(p => [p.lat, p.lng])}
				pathOptions={{ color: '#ffb74d', fillOpacity: 0.2, dashArray: '6 4' }}
			/>
			{editPoints.map((p, i) => (
				<CircleMarker
					key={i}
					center={[p.lat, p.lng]}
					radius={7}
					pathOptions={{ color: '#ffb74d', fillColor: '#fff', fillOpacity: 1, weight: 2 }}
					eventHandlers={{
						mousedown() {
							draggingIndexRef.current = i
							map.dragging.disable()
						},
					}}
				/>
			))}
		</>
	)
}
