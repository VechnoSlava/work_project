import styles from './mainMap.module.css'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'

const MapResizeFix = () => {
	const map = useMap()

	useEffect(() => {
		setTimeout(() => {
			map.invalidateSize()
		}, 0)
	}, [map])

	return null
}

export const MainMap = () => {
	console.log('Render_MAP')

	return (
		<div className={styles.map__container}>
			<MapContainer
				center={[55.75, 37.61]}
				zoom={10}
				attributionControl={false}
				style={{ height: '100%', width: '100%', boxSizing: 'border-box' }}
			>
				<MapResizeFix />
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
				<Marker position={[55.75, 37.61]}>
					<Popup>Тестовая точка</Popup>
				</Marker>
			</MapContainer>
		</div>
	)
}
