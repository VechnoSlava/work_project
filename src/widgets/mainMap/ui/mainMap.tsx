import styles from './mainMap.module.css'
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMap,
	useMapEvents,
	Polygon,
	CircleMarker,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import { LatLng } from 'leaflet'
import {
	addGeoArea,
	selectGeoAreas,
	selectGeoDrawingMode,
	selectGeoEditingIndex,
	setGeoDrawingMode,
	setGeoEditingIndex,
	updateGeoArea,
} from '../../../features/formFiltersMain/model/mainFiltersSlice'

const MapResizeFix = () => {
	const map = useMap()
	useEffect(() => {
		setTimeout(() => map.invalidateSize(), 0)
	}, [map])
	return null
}

interface PolygonDrawerProps {
	onComplete: (points: LatLng[], name: string) => void
	onCancel: () => void
}

const PolygonDrawer = ({ onComplete, onCancel }: PolygonDrawerProps) => {
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
				const deduped = points.slice(0, -1)
				setPendingPoints(deduped)
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

interface PolygonEditorProps {
	area: { name: string; latLng: { lat: number; lng: number }[][] }
	onSave: (points: { lat: number; lng: number }[]) => void
	onCancel: () => void
}

const PolygonEditor = ({ area, onSave, onCancel }: PolygonEditorProps) => {
	const map = useMap()
	const [editPoints, setEditPoints] = useState(area.latLng[0].map(p => ({ ...p })))
	const draggingIndexRef = useRef<number | null>(null)

	useEffect(() => {
		const lats = area.latLng[0].map(p => p.lat)
		const lngs = area.latLng[0].map(p => p.lng)
		const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
		const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
		map.setView([centerLat, centerLng], map.getZoom())
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

	// Кнопки поверх карты
	useEffect(() => {
		const container = map.getContainer()
		const div = document.createElement('div')
		div.style.cssText =
			'position:absolute;bottom:40px;left:50%;transform:translateX(-50%);z-index:1000;display:flex;gap:8px;pointer-events:all;'

		const cancelBtn = document.createElement('button')
		cancelBtn.textContent = 'Отмена'
		cancelBtn.style.cssText =
			'padding:6px 16px;border-radius:4px;border:1px solid #ccc;background:rgba(0,0,0,0.75);color:#fff;cursor:pointer;font-size:13px;'
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

export const MainMap = () => {
	const dispatch = useAppDispatch()
	const geoAreas = useAppSelector(selectGeoAreas)
	const drawingMode = useAppSelector(selectGeoDrawingMode)
	const editingIndex = useAppSelector(selectGeoEditingIndex)

	const handlePolygonComplete = (points: LatLng[], name: string) => {
		dispatch(addGeoArea({ name, latLng: [points.map(p => ({ lat: p.lat, lng: p.lng }))] }))
	}

	const handleEditSave = (points: { lat: number; lng: number }[]) => {
		if (editingIndex === null) return
		dispatch(
			updateGeoArea({
				index: editingIndex,
				area: { name: geoAreas[editingIndex].name, latLng: [points] },
			}),
		)
	}

	return (
		<div className={styles.map__container}>
			<MapContainer
				center={[55.75, 37.61]}
				zoom={4}
				attributionControl={false}
				style={{ height: '100%', width: '100%', boxSizing: 'border-box' }}
				doubleClickZoom={false}
			>
				<MapResizeFix />
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

				{geoAreas.map((area, i) => {
					if (drawingMode === 'editing' && i === editingIndex) return null
					return (
						<Polygon
							key={i}
							positions={area.latLng[0].map(p => [p.lat, p.lng])}
							pathOptions={{ color: '#4fc3f7', fillOpacity: 0.15 }}
						>
							<Popup>{area.name}</Popup>
						</Polygon>
					)
				})}

				{drawingMode === 'drawing' && (
					<PolygonDrawer
						onComplete={handlePolygonComplete}
						onCancel={() => dispatch(setGeoDrawingMode('idle'))}
					/>
				)}

				{drawingMode === 'editing' && editingIndex !== null && geoAreas[editingIndex] && (
					<PolygonEditor
						area={geoAreas[editingIndex]}
						onSave={handleEditSave}
						onCancel={() => dispatch(setGeoEditingIndex(null))}
					/>
				)}
			</MapContainer>
		</div>
	)
}
