import styles from './mainMap.module.css'
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
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

const MapResizeFix = () => {
	const map = useMap()
	useEffect(() => {
		setTimeout(() => map.invalidateSize(), 0)
	}, [map])
	return null
}

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
