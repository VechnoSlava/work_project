import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CircleMarker, Marker, Polyline, useMap, useMapEvents } from 'react-leaflet'
import { LatLng } from 'leaflet'
import { DistUnit, RulerPoint, RulerTrack } from '../model/rulerTypes'
import { bearing, haversine } from '../lib/geoUtils'
import { makeRulerIcon, recalcTrackPoints } from '../lib/rulerUtils'
import { injectArrowMarker } from '@/shared/icons/arrowMarkerSvg'
import { SvgIcon } from '@/shared/icons/icons'
import { PANEL_STYLE, BTN_STYLE, BTN_LAST, onHover, stopMapPropagation } from '../lib/mapStyles'

// ─── RulerEventHandler ────────────────────────────────────────────────────────

interface RulerEventHandlerProps {
	onMapClick: (latlng: LatLng) => void
	onPreviewMove: (latlng: LatLng) => void
}

const RulerEventHandler = ({ onMapClick, onPreviewMove }: RulerEventHandlerProps) => {
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

// ─── RulerTrackLayer ──────────────────────────────────────────────────────────

interface RulerTrackLayerProps {
	track: RulerTrack
	unit: DistUnit
	preview: LatLng | null
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

	const positions = track.points.map(p => p.latlng)
	const last = track.points[track.points.length - 1]

	// Инжектируем SVG-маркер стрелки и вешаем marker-end после рендера Leaflet
	useEffect(() => {
		if (!track.finished || positions.length < 2) return

		const timer = setTimeout(() => {
			const container = map.getContainer()

			// Ищем SVG, содержащий наши polyline-элементы с data-track
			const svgList = Array.from(container.querySelectorAll('svg'))
			const svgRoot = svgList.find(svg => svg.querySelector(`[data-track="${track.id}"]`)) ?? null
			if (!svgRoot) return

			const markerId = `arm-${track.id}`
			injectArrowMarker(svgRoot, markerId)

			svgRoot.querySelectorAll(`[data-track="${track.id}"]`).forEach(el => {
				el.setAttribute('marker-end', `url(#${markerId})`)
			})
		}, 0)

		return () => clearTimeout(timer)
	}, [track.finished, track.id, positions.length, positions])

	return (
		<>
			{/* Сегменты трека */}
			{positions.length >= 2 &&
				positions.slice(1).map((pos, i) => (
					<Polyline
						key={`seg-${track.id}-${i}`}
						positions={[positions[i], pos]}
						pane="rulerPane"
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

			{/* Предпросмотр к курсору */}
			{!track.finished && last && preview && (
				<Polyline
					positions={[last.latlng, preview]}
					pane="rulerPane"
					pathOptions={{ color: '#4fc3f7', weight: 1.5, dashArray: '4 4', opacity: 0.5 }}
				/>
			)}

			{/* Точки и подписи */}
			{track.points.map((p, i) => (
				<Fragment key={`pt-${track.id}-${i}`}>
					<CircleMarker
						center={p.latlng}
						radius={track.finished ? 5 : 4}
						pane="rulerPane"
						pathOptions={{ color: '#4fc3f7', fillColor: '#fff', fillOpacity: 1, weight: 2 }}
						eventHandlers={{
							mousedown(e) {
								if (!track.finished) return
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
						position={p.latlng}
						icon={makeRulerIcon(p, i === 0, unit)}
						pane="rulerPane"
						zIndexOffset={200}
						interactive={false}
					/>
				</Fragment>
			))}
		</>
	)
}

// ─── RulerControl ─────────────────────────────────────────────────────────────

export const RulerControl = ({
	onActiveChange,
}: {
	onActiveChange?: (active: boolean) => void
}) => {
	const [active, setActive] = useState(false)
	const [unit, setUnit] = useState<DistUnit>('km')
	const [tracks, setTracks] = useState<RulerTrack[]>([])
	const [preview, setPreview] = useState<LatLng | null>(null)
	const nextId = useRef(0)

	// Уведомляем родителя синхронно до отрисовки (useLayoutEffect),
	// чтобы полигоны успели стать неинтерактивными до первого клика по карте
	useLayoutEffect(() => {
		onActiveChange?.(active)
	}, [active, onActiveChange])

	const units: DistUnit[] = ['km', 'nm', 'mi']
	const unitLabel: Record<DistUnit, string> = { km: 'км', nm: 'нм', mi: 'ми' }
	const activeTrack = tracks.find(t => !t.finished) ?? null

	/** Отмена текущего незавершённого трека */
	const cancelCurrentTrack = () => {
		setTracks(prev => prev.filter(t => t.finished))
		setActive(false)
		setPreview(null)
	}

	/** Toggle линейки: при выключении — убираем незавершённый трек */
	const handleToggle = () => {
		if (active) {
			cancelCurrentTrack()
		} else {
			setActive(true)
		}
	}

	/** Обработка Esc — отмена текущего построения */
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && active) {
				cancelCurrentTrack()
			}
		}
		document.addEventListener('keydown', onKeyDown)
		return () => document.removeEventListener('keydown', onKeyDown)
	}, [active])

	const handleMapClick = (latlng: LatLng) => {
		setTracks(prev => {
			const current = prev.find(t => !t.finished)

			if (!current) {
				return [
					...prev,
					{
						id: nextId.current++,
						points: [{ latlng, distFromPrev: 0, totalDist: 0, angleToPrev: null }],
						finished: false,
					},
				]
			}

			const lastPt = current.points[current.points.length - 1]
			const dist = haversine(lastPt.latlng, latlng)

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
			prev.map(track =>
				track.id !== trackId
					? track
					: { ...track, points: recalcTrackPoints(track, pointIdx, newLatLng) },
			),
		)
	}

	const handleClear = () => {
		setTracks([])
		setActive(false)
		setPreview(null)
	}

	return (
		<>
			<div
				ref={stopMapPropagation}
				style={{
					...PANEL_STYLE,
					position: 'absolute',
					top: 77,
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
					onClick={handleToggle}
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
					onMouseEnter={onHover(true)}
					onMouseLeave={onHover(false)}
				>
					<SvgIcon id="icon-trash" width={15} height={15} />
				</button>
				<button
					style={{
						...BTN_LAST,
						fontSize: 13,
						fontFamily: 'monospace',
						color: '#c8d6df',
						alignItems: 'center',
						textAlign: 'center',
					}}
					title="Переключить единицы измерения"
					onClick={() => setUnit(u => units[(units.indexOf(u) + 1) % units.length])}
					onMouseEnter={onHover(true)}
					onMouseLeave={onHover(false)}
				>
					{unitLabel[unit]}
				</button>
			</div>

			{active && <RulerEventHandler onMapClick={handleMapClick} onPreviewMove={setPreview} />}

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
