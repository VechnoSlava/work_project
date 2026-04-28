import styles from './mainMap.module.css'
import { MapContainer, TileLayer, Polygon, Popup, Pane, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useCallback, useEffect, useState } from 'react'
import { LatLng } from 'leaflet'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import {
	addGeoArea,
	selectGeoAreas,
	updateGeoArea,
} from '@/features/formFiltersMain/model/mainFiltersSlice'
import {
	cancelDrawing,
	finishDrawing,
	selectGeoDrawingMode,
	selectGeoEditingIndex,
} from '../model/geoDrawingSlice'
import { SvgSprite } from '@/shared/icons/icons'
import { ZoomControl } from '../components/ZoomControl'
import { CoordinatesPanel } from '../components/CoordinatesPanel'
import { RulerControl } from '../components/RulerControl'
import { PolygonDrawer } from '../components/PolygonDrawer'
import { PolygonEditor } from '../components/PolygonEditor'
import { BearingLayer } from '../components/BearingLayer'
import { CenterControl } from '../components/CenterControl'
import config from '../../../../config.json'

/** Слушает resize контейнера карты (splitFrame) и вызывает invalidateSize */
const MapResizeObserver = () => {
	const map = useMap()
	useEffect(() => {
		const container = map.getContainer()
		const ro = new ResizeObserver(() => {
			map.invalidateSize()
		})
		ro.observe(container)
		return () => ro.disconnect()
	}, [map])
	return null
}

export const MainMap = () => {
	const dispatch = useAppDispatch()
	const geoAreas = useAppSelector(selectGeoAreas)
	const drawingMode = useAppSelector(selectGeoDrawingMode)
	const editingIndex = useAppSelector(selectGeoEditingIndex)
	const [rulerActive, setRulerActive] = useState(false)

	const handleRulerActiveChange = useCallback((active: boolean) => {
		setRulerActive(active)
	}, [])

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

	/**
	 * Полигоны становятся неинтерактивными когда линейка активна
	 * или идёт рисование/редактирование нового полигона.
	 * Это отключает Leaflet hit-testing — клики проходят насквозь к карте.
	 */
	const polygonsInteractive = !rulerActive && drawingMode === 'idle'

	const initialCenter = ((config as any).workLocation as number[]) ?? [55.75, 37.61]
	const initialZoom = ((config as any).zoomLocation as number) ?? 4

	return (
		<div className={styles.map__container}>
			<MapContainer
				center={[initialCenter[0], initialCenter[1]]}
				zoom={initialZoom}
				attributionControl={false}
				zoomControl={false}
				style={{ height: '100%', width: '100%', boxSizing: 'border-box' }}
				doubleClickZoom={false}
			>
				<MapResizeObserver />
				<SvgSprite />
				<TileLayer url={config.mapUrl} />

				<ZoomControl />
				<CoordinatesPanel />
				<CenterControl />

				{/* Пеленги и иконка корабля — ниже полигонов, не мешают взаимодействию */}
				<Pane name="bearingPane" style={{ zIndex: 420 }} />
				<BearingLayer />

				{/* Полигоны — нижний слой */}
				<Pane name="polygonsPane" style={{ zIndex: 450 }}>
					{geoAreas.map((area, i) => {
						if (drawingMode === 'editing' && i === editingIndex) return null
						return (
							<Polygon
								key={`${i}-${polygonsInteractive}`}
								positions={area.latLng[0].map(p => [p.lat, p.lng])}
								pathOptions={{
									color: '#4fc3f7',
									fillOpacity: 0.15,
									interactive: polygonsInteractive,
								}}
							>
								{polygonsInteractive && <Popup pane="popupPane">{area.name}</Popup>}
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
				</Pane>

				{/* Pane для картографических элементов линейки (всегда поверх полигонов) */}
				<Pane name="rulerPane" style={{ zIndex: 500 }} />

				{/* Pane для popup ввода названия полигона (поверх всех слоёв) */}
				<Pane name="drawingPopupPane" style={{ zIndex: 700 }} />

				<RulerControl onActiveChange={handleRulerActiveChange} />
			</MapContainer>
		</div>
	)
}
