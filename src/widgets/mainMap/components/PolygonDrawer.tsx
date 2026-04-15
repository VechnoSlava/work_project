import { useEffect, useRef, useState } from 'react'
import { CircleMarker, Marker, Polygon, Popup, useMapEvents } from 'react-leaflet'
import { LatLng } from 'leaflet'

interface PolygonDrawerProps {
	onComplete: (points: LatLng[], name: string) => void
	onCancel: () => void
}

export const PolygonDrawer = ({ onComplete, onCancel }: PolygonDrawerProps) => {
	const [points, setPoints] = useState<LatLng[]>([])
	const [pendingPoints, setPendingPoints] = useState<LatLng[] | null>(null)
	const [popupPos, setPopupPos] = useState<LatLng | null>(null)
	const [nameInput, setNameInput] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)
	const markerRef = useRef<any>(null)

	useEffect(() => {
		if (popupPos && markerRef.current) {
			setTimeout(() => {
				markerRef.current?.openPopup()
				inputRef.current?.focus()
			}, 100)
		}
	}, [popupPos])

	useMapEvents({
		click(e) {
			if (pendingPoints) return
			setPoints(prev => [...prev, e.latlng])
		},
		dblclick(e) {
			e.originalEvent.preventDefault()
			if (pendingPoints) return
			if (points.length >= 3) {
				setPendingPoints(points.slice(0, -1))
				setPopupPos(e.latlng)
				setPoints([])
			}
		},
	})

	const handleSave = () => {
		if (!pendingPoints || !nameInput.trim()) return
		onComplete(pendingPoints, nameInput.trim())
		setPendingPoints(null)
		setPopupPos(null)
		setNameInput('')
	}

	const handleCancel = () => {
		setPendingPoints(null)
		setPopupPos(null)
		setNameInput('')
		onCancel()
	}

	return (
		<>
			{points.length >= 2 && (
				<Polygon
					positions={points.map(p => [p.lat, p.lng])}
					pathOptions={{ color: '#4fc3f7', dashArray: '6 4', fillOpacity: 0.15 }}
				/>
			)}
			{points.map((p, i) => (
				<CircleMarker
					key={i}
					center={[p.lat, p.lng]}
					radius={5}
					pathOptions={{ color: '#4fc3f7', fillColor: '#fff', fillOpacity: 1, weight: 2 }}
				/>
			))}
			{pendingPoints && pendingPoints.length >= 3 && (
				<>
					<Polygon
						positions={pendingPoints.map(p => [p.lat, p.lng])}
						pathOptions={{ color: '#4fc3f7', fillOpacity: 0.25 }}
					/>
					{pendingPoints.map((p, i) => (
						<CircleMarker
							key={i}
							center={[p.lat, p.lng]}
							radius={5}
							pathOptions={{ color: '#4fc3f7', fillColor: '#fff', fillOpacity: 1, weight: 2 }}
						/>
					))}
				</>
			)}
			{popupPos && (
				<Marker ref={markerRef} position={popupPos} opacity={0}>
					<Popup autoClose={false} closeOnClick={false} closeButton={false} minWidth={220}>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
							<span style={{ fontWeight: 500, fontSize: 13, color: '#111' }}>Название области</span>
							<input
								ref={inputRef}
								value={nameInput}
								onChange={e => setNameInput(e.target.value)}
								onKeyDown={e => {
									if (e.key === 'Enter') handleSave()
									if (e.key === 'Escape') handleCancel()
								}}
								placeholder="Введите название..."
								style={{
									padding: '4px 8px',
									border: '1px solid #ccc',
									borderRadius: 4,
									fontSize: 13,
									outline: 'none',
									color: '#111',
									width: '100%',
									boxSizing: 'border-box',
								}}
							/>
							<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
								<button
									onClick={handleCancel}
									style={{
										fontSize: 12,
										cursor: 'pointer',
										padding: '4px 10px',
										borderRadius: 4,
										border: '1px solid #ccc',
										background: '#fff',
										color: '#555',
									}}
								>
									Отмена
								</button>
								<button
									onClick={handleSave}
									disabled={!nameInput.trim()}
									style={{
										fontSize: 12,
										cursor: nameInput.trim() ? 'pointer' : 'not-allowed',
										padding: '4px 10px',
										background: '#4fc3f7',
										border: 'none',
										borderRadius: 4,
										color: '#fff',
										opacity: nameInput.trim() ? 1 : 0.5,
									}}
								>
									Применить
								</button>
							</div>
						</div>
					</Popup>
				</Marker>
			)}
		</>
	)
}
