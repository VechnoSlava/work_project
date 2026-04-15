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
	Polyline,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L, { LatLng, DivIcon } from 'leaflet'
import { Fragment, useEffect, useRef, useState } from 'react'
import { injectArrowMarker } from '../../../shared/icons/arrowMarkerSvg'
import { SvgIcon, SvgSprite } from '../../../shared/icons/icons'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import {
	addGeoArea,
	selectGeoAreas,
	updateGeoArea,
} from '../../../features/formFiltersMain/model/mainFiltersSlice'
import {
	selectGeoDrawingMode,
	selectGeoEditingIndex,
	finishDrawing,
	cancelDrawing,
} from '../../../widgets/mainMap/model/geoDrawingSlice'

// ─── Shared helpers ───────────────────────────────────────────────────────────

type CoordFormat = 'decimal' | 'dms'
type DistUnit = 'km' | 'nm' | 'mi'

const toDMS = (deg: number): string => {
	const d = Math.floor(Math.abs(deg))
	const mFloat = (Math.abs(deg) - d) * 60
	const m = Math.floor(mFloat)
	const s = ((mFloat - m) * 60).toFixed(1)
	return `${deg < 0 ? '-' : ''}${d}° ${m}′ ${s}″`
}

const fmtCoord = (val: number, format: CoordFormat): string =>
	format === 'decimal' ? `${val.toFixed(6)}°` : toDMS(val)

const haversine = (a: LatLng, b: LatLng): number => {
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

// Азимут от a к b в градусах [0, 360)
const bearing = (a: LatLng, b: LatLng): number => {
	const lat1 = (a.lat * Math.PI) / 180
	const lat2 = (b.lat * Math.PI) / 180
	const dLng = ((b.lng - a.lng) * Math.PI) / 180
	const y = Math.sin(dLng) * Math.cos(lat2)
	const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
	return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}
// Умное форматирование расстояния: до 1 км — метры, свыше — выбранная единица
const fmtDist = (meters: number, unit: DistUnit): string => {
	if (unit === 'km') {
		if (meters < 1000) return `${Math.round(meters)} м`
		return `${(meters / 1000).toFixed(3)} км`
	}
	if (unit === 'nm') {
		return `${(meters / 1852).toFixed(4)} нм`
	}
	// mi
	return `${(meters / 1609.344).toFixed(4)} ми`
}

const PANEL_STYLE: React.CSSProperties = {
	background: 'rgba(9, 30, 47, 0.88)',
	border: '1px solid rgba(255,255,255,0.12)',
	borderRadius: 4,
	pointerEvents: 'all',
	userSelect: 'none',
}

const BTN_STYLE: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: 30,
	height: 30,
	background: 'transparent',
	border: 'none',
	borderBottom: '1px solid rgba(255,255,255,0.10)',
	color: '#c8d6df',
	fontSize: 16,
	cursor: 'pointer',
}

const BTN_LAST: React.CSSProperties = { ...BTN_STYLE, borderBottom: 'none' }

// ─── MapResizeFix ─────────────────────────────────────────────────────────────

const MapResizeFix = () => {
	const map = useMap()
	useEffect(() => {
		setTimeout(() => map.invalidateSize(), 0)
	}, [map])
	return null
}

// ─── ZoomControl ─────────────────────────────────────────────────────────────

const ZoomControl = () => {
	const map = useMap()
	const hover = (on: boolean) => (e: React.MouseEvent<HTMLButtonElement>) => {
		e.currentTarget.style.background = on ? 'rgba(255,255,255,0.08)' : 'transparent'
	}
	return (
		<div
			style={{
				...PANEL_STYLE,
				position: 'absolute',
				top: 12,
				left: 12,
				zIndex: 1000,
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<button
				style={BTN_STYLE}
				title="Приблизить"
				onClick={() => map.zoomIn()}
				onMouseEnter={hover(true)}
				onMouseLeave={hover(false)}
			>
				+
			</button>
			<button
				style={BTN_LAST}
				title="Отдалить"
				onClick={() => map.zoomOut()}
				onMouseEnter={hover(true)}
				onMouseLeave={hover(false)}
			>
				−
			</button>
		</div>
	)
}

// ─── Ruler types ──────────────────────────────────────────────────────────────

interface RulerPoint {
	latlng: LatLng
	distFromPrev: number // метров
	totalDist: number // метров
	angleToPrev: number | null // азимут от предыдущей точки, градусы
}

interface RulerTrack {
	id: number
	points: RulerPoint[]
	finished: boolean
}

// ─── RulerTrackLayer — отрисовка одного трека ─────────────────────────────────

interface RulerTrackLayerProps {
	track: RulerTrack
	unit: DistUnit
	preview: LatLng | null // только для активного (незавершённого) трека
	onPointMove: (trackId: number, pointIdx: number, newLatLng: LatLng) => void
}

const RulerTrackLayer = ({ track, unit, preview, onPointMove }: RulerTrackLayerProps) => {
	const map = useMap()
	const draggingRef = useRef<{ trackId: number; pointIdx: number } | null>(null)

	useMapEvents({
		mousemove(e) {
			if (draggingRef.current && e.originalEvent.buttons === 1) {
				onPointMove(draggingRef.current.trackId, draggingRef.current.pointIdx, e.latlng)
			}
		},
		mouseup() {
			draggingRef.current = null
			map.dragging.enable()
		},
	})

	const makeIcon = (p: RulerPoint, isFirst: boolean): DivIcon => {
		const coord = `${p.latlng.lat.toFixed(5)}°, ${p.latlng.lng.toFixed(5)}°`
		const segLine =
			isFirst || p.distFromPrev === 0
				? ''
				: `<div style="color:#c8d6df;margin-top:2px">▲ ${fmtDist(p.distFromPrev, unit)}</div>`
		const angleLine =
			isFirst || p.angleToPrev === null
				? ''
				: `<div style="color:#a0c8d8">⊾ ${p.angleToPrev.toFixed(1)}°</div>`
		const totalLine = `<div style="color:#ffb74d;font-weight:600;margin-top:2px">Σ ${fmtDist(p.totalDist, unit)}</div>`

		const html = `
<div style="
	background:rgba(9,30,47,0.93);
	border:1px solid rgba(255,255,255,0.22);
	border-radius:4px;
	padding:4px 8px;
	font-size:11px;
	font-family:monospace;
	color:#4fc3f7;
	line-height:1.55;
	width:max-content;
	max-width:180px;
	box-sizing:border-box;
	pointer-events:none;
	filter:drop-shadow(0 1px 3px rgba(0,0,0,0.6));
">
	<div>${coord}</div>
	${segLine}${angleLine}${totalLine}
</div>`

		return L.divIcon({
			className: '',
			iconAnchor: [0, 0],
			iconSize: undefined,
			html,
		})
	}

	const positions = track.points.map(p => p.latlng)
	const last = track.points[track.points.length - 1]

	// Инжектируем SVG-маркер стрелки и вешаем marker-end на сегменты после рендера
	useEffect(() => {
		if (!track.finished || positions.length < 2) return

		// Leaflet рисует SVG асинхронно — даём один тик на завершение
		const timer = setTimeout(() => {
			// Берём любой SVG-слой карты через контейнер
			const mapContainer = map.getContainer()
			const svgRoot = mapContainer.querySelector(
				'.leaflet-overlay-pane svg',
			) as SVGSVGElement | null
			if (!svgRoot) return

			const markerId = `arm-${track.id}`
			injectArrowMarker(svgRoot, markerId)

			// Находим все path-элементы сегментов по классу и вешаем marker-end
			// Leaflet добавляет класс leaflet-interactive на интерактивные, но нам нужны все polyline
			// Проходим по всем path в overlay SVG и фильтруем наши по data-атрибуту
			svgRoot.querySelectorAll(`[data-track="${track.id}"]`).forEach(el => {
				el.setAttribute('marker-end', `url(#${markerId})`)
			})
		}, 0)

		return () => clearTimeout(timer)
	}, [track.finished, track.id, positions.length])

	return (
		<>
			{/* Сегменты трека — каждый со своей стрелкой на конце */}
			{positions.length >= 2 &&
				positions.slice(1).map((pos, i) => (
					<Polyline
						key={`seg-${track.id}-${i}`}
						positions={[positions[i], pos]}
						pathOptions={{
							color: '#4fc3f7',
							weight: 2,
							dashArray: track.finished ? undefined : '6 3',
						}}
						ref={(r: any) => {
							if (!r) return
							const el = r.getElement?.()
							if (el) el.setAttribute('data-track', String(track.id))
						}}
					/>
				))}
			{/* Предпросмотр к курсору — только для активного незавершённого трека */}
			{!track.finished && last && preview && (
				<Polyline
					positions={[last.latlng, preview]}
					pathOptions={{ color: '#4fc3f7', weight: 1.5, dashArray: '4 4', opacity: 0.5 }}
				/>
			)}
			{/* Точки и подписи */}
			{track.points.map((p, i) => (
				<Fragment key={`pt-${track.id}-${i}`}>
					<CircleMarker
						key={`dot-${track.id}-${i}`}
						center={p.latlng}
						radius={track.finished ? 5 : 4}
						pathOptions={{
							color: '#4fc3f7',
							fillColor: '#fff',
							fillOpacity: 1,
							weight: 2,
						}}
						eventHandlers={{
							mousedown(e) {
								if (!track.finished) return // нельзя двигать во время рисования
								// @ts-ignore
								e.originalEvent?.stopPropagation()
								draggingRef.current = { trackId: track.id, pointIdx: i }
								map.dragging.disable()
							},
							click(e) {
								if (track.finished) {
									// @ts-ignore
									e.originalEvent?.stopPropagation()
								}
							},
						}}
					/>
					<Marker
						key={`lbl-${track.id}-${i}`}
						position={p.latlng}
						icon={makeIcon(p, i === 0)}
						zIndexOffset={200}
						interactive={false}
					/>
				</Fragment>
			))}
		</>
	)
}

// ─── RulerControl ─────────────────────────────────────────────────────────────

const RulerControl = () => {
	const [active, setActive] = useState(false) // режим рисования включён
	const [unit, setUnit] = useState<DistUnit>('km')
	const [tracks, setTracks] = useState<RulerTrack[]>([])
	const [preview, setPreview] = useState<LatLng | null>(null)
	const nextId = useRef(0)

	const units: DistUnit[] = ['km', 'nm', 'mi']
	const unitLabel: Record<DistUnit, string> = { km: 'км', nm: 'нм', mi: 'ми' }

	const hover = (on: boolean) => (e: React.MouseEvent<HTMLButtonElement>) => {
		e.currentTarget.style.background = on ? 'rgba(255,255,255,0.08)' : 'transparent'
	}

	// Активный незавершённый трек
	const activeTrack = tracks.find(t => !t.finished) ?? null

	const handleMapClick = (latlng: LatLng) => {
		if (!active) return

		setTracks(prev => {
			const current = prev.find(t => !t.finished)

			if (!current) {
				// Начинаем новый трек
				const newTrack: RulerTrack = {
					id: nextId.current++,
					points: [{ latlng, distFromPrev: 0, totalDist: 0, angleToPrev: null }],
					finished: false,
				}
				return [...prev, newTrack]
			}

			const lastPt = current.points[current.points.length - 1]
			const dist = haversine(lastPt.latlng, latlng)

			// Клик близко к последней точке — завершаем трек и выключаем режим
			if (current.points.length >= 2 && dist < 20) {
				setActive(false)
				return prev.map(t => (t.id === current.id ? { ...t, finished: true } : t))
			}

			const newPoint: RulerPoint = {
				latlng,
				distFromPrev: dist,
				totalDist: lastPt.totalDist + dist,
				angleToPrev: bearing(lastPt.latlng, latlng),
			}

			return prev.map(t => (t.id === current.id ? { ...t, points: [...t.points, newPoint] } : t))
		})
	}

	const handlePointMove = (trackId: number, pointIdx: number, newLatLng: LatLng) => {
		setTracks(prev =>
			prev.map(track => {
				if (track.id !== trackId) return track
				const pts = track.points.map((p, i) => ({ ...p }))
				pts[pointIdx] = { ...pts[pointIdx], latlng: newLatLng }

				// Пересчитываем distFromPrev, totalDist и angleToPrev для затронутых точек
				for (let i = Math.max(1, pointIdx); i < pts.length; i++) {
					const prev = pts[i - 1]
					const dist = haversine(prev.latlng, pts[i].latlng)
					pts[i] = {
						...pts[i],
						distFromPrev: dist,
						totalDist: prev.totalDist + dist,
						angleToPrev: bearing(prev.latlng, pts[i].latlng),
					}
				}
				// Если сдвинули не первую точку — нужно пересчитать и следующую за ней
				if (pointIdx > 0 && pointIdx < pts.length - 1) {
					// уже пересчитано в цикле выше
				}
				// Если сдвинули первую точку — пересчитать вторую
				if (pointIdx === 0 && pts.length > 1) {
					const dist = haversine(pts[0].latlng, pts[1].latlng)
					pts[1] = {
						...pts[1],
						distFromPrev: dist,
						totalDist: dist,
						angleToPrev: bearing(pts[0].latlng, pts[1].latlng),
					}
					// и все последующие
					for (let i = 2; i < pts.length; i++) {
						const d = haversine(pts[i - 1].latlng, pts[i].latlng)
						pts[i] = {
							...pts[i],
							distFromPrev: d,
							totalDist: pts[i - 1].totalDist + d,
							angleToPrev: bearing(pts[i - 1].latlng, pts[i].latlng),
						}
					}
				}
				return { ...track, points: pts }
			}),
		)
	}

	const handleClear = () => {
		setTracks([])
		setActive(false)
		setPreview(null)
	}

	return (
		<>
			{/* Кнопки панели */}
			<div
				style={{
					...PANEL_STYLE,
					position: 'absolute',
					top: 72,
					left: 12,
					zIndex: 1000,
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<button
					style={{
						...BTN_STYLE,
						color: active ? '#4fc3f7' : '#c8d6df',
						background: active ? 'rgba(79,195,247,0.12)' : 'transparent',
					}}
					title="Линейка — кликайте по карте; повторный клик по крайней точке завершает сегмент"
					onClick={() => setActive(a => !a)}
					onMouseEnter={e => {
						if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
					}}
					onMouseLeave={e => {
						if (!active) e.currentTarget.style.background = 'transparent'
					}}
				>
					<SvgIcon id="icon-ruler" width={15} height={15} />
				</button>
				<button
					style={BTN_STYLE}
					title="Очистить все линейки"
					onClick={handleClear}
					onMouseEnter={hover(true)}
					onMouseLeave={hover(false)}
				>
					<SvgIcon id="icon-trash" width={16} height={16} />
				</button>
				<button
					style={{ ...BTN_LAST, fontSize: 14, fontFamily: 'monospace', color: '#4fc3f7' }}
					title="Переключить единицы измерения"
					onClick={() => setUnit(u => units[(units.indexOf(u) + 1) % units.length])}
					onMouseEnter={hover(true)}
					onMouseLeave={hover(false)}
				>
					{unitLabel[unit]}
				</button>
			</div>

			{/* Компонент перехвата кликов и предпросмотра */}
			{active && <RulerEventHandler onMapClick={handleMapClick} onPreviewMove={setPreview} />}

			{/* Отрисовка всех треков */}
			{tracks.map(track => (
				<RulerTrackLayer
					key={track.id}
					track={track}
					unit={unit}
					preview={!track.finished && track.id === activeTrack?.id ? preview : null}
					onPointMove={handlePointMove}
				/>
			))}
		</>
	)
}

// Отдельный компонент для перехвата событий карты (нужен чтобы изолировать useMapEvents)
const RulerEventHandler = ({
	onMapClick,
	onPreviewMove,
}: {
	onMapClick: (latlng: LatLng) => void
	onPreviewMove: (latlng: LatLng) => void
}) => {
	useMapEvents({
		click(e) {
			onMapClick(e.latlng)
		},
		mousemove(e) {
			onPreviewMove(e.latlng)
		},
	})
	return null
}

// ─── CoordinatesPanel ─────────────────────────────────────────────────────────

const CoordinatesPanel = () => {
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

// ─── PolygonDrawer ────────────────────────────────────────────────────────────

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

// ─── PolygonEditor ────────────────────────────────────────────────────────────

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

// ─── MainMap ──────────────────────────────────────────────────────────────────

export const MainMap = () => {
	const dispatch = useAppDispatch()
	const geoAreas = useAppSelector(selectGeoAreas)
	const drawingMode = useAppSelector(selectGeoDrawingMode)
	const editingIndex = useAppSelector(selectGeoEditingIndex)

	const handlePolygonComplete = (points: LatLng[], name: string) => {
		dispatch(addGeoArea({ name, latLng: [points.map(p => ({ lat: p.lat, lng: p.lng }))] }))
		dispatch(finishDrawing())
	}

	const handleEditSave = (points: { lat: number; lng: number }[]) => {
		if (editingIndex === null) return
		dispatch(
			updateGeoArea({
				index: editingIndex,
				area: { name: geoAreas[editingIndex].name, latLng: [points] },
			}),
		)
		dispatch(finishDrawing())
	}

	return (
		<div className={styles.map__container}>
			<MapContainer
				center={[55.75, 37.61]}
				zoom={4}
				attributionControl={false}
				zoomControl={false}
				style={{ height: '100%', width: '100%', boxSizing: 'border-box' }}
				doubleClickZoom={false}
			>
				<MapResizeFix />
				<SvgSprite />
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

				<ZoomControl />
				<RulerControl />
				<CoordinatesPanel />

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
						onCancel={() => dispatch(finishDrawing())}
					/>
				)}

				{drawingMode === 'editing' && editingIndex !== null && geoAreas[editingIndex] && (
					<PolygonEditor
						area={geoAreas[editingIndex]}
						onSave={handleEditSave}
						onCancel={() => dispatch(cancelDrawing())}
					/>
				)}
			</MapContainer>
		</div>
	)
}
