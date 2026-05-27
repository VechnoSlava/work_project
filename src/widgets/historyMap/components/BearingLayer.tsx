import { Fragment, useEffect, useMemo, useState } from 'react'
import { Marker, Polyline, useMap } from 'react-leaflet'
import L, { LatLng } from 'leaflet'
import { useAppSelector } from '@/app/store/hooks'
import { selectRadarsList } from '@/shared/webSocket/serverConnectionSlice'
import { selectSelectedRadars } from '@/widgets/radarsTable/model/radarsTableSlice'
import type { IRadarsList } from '@/shared/webSocket/IWebSocket'

/**
 * Иконка корабля (MarineTraffic-style).
 */
const shipIcon = L.divIcon({
	className: '',
	iconSize: [24, 24],
	iconAnchor: [12, 12],
	html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
		<path d="M12 2 L8 10 L4 20 L12 17 L20 20 L16 10 Z"
			fill="#1565C0" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/>
	</svg>`,
})

/**
 * Вычисляет конечную точку линии пеленга в пиксельных координатах карты.
 * Работает корректно при любом зуме — линия всегда прямая на экране.
 *
 * Пеленг: 0° = север (вверх экрана), по часовой стрелке.
 */
const getBearingEndpoint = (origin: LatLng, bearingDeg: number, map: L.Map): LatLng => {
	const container = map.getContainer()
	const screenDiag = Math.sqrt(container.clientWidth ** 2 + container.clientHeight ** 2)
	const length = screenDiag * 2

	// Пеленг → математический угол: 0°→-90° (вверх), 90°→0° (вправо)
	const rad = ((bearingDeg - 90) * Math.PI) / 180

	const originPx = map.latLngToContainerPoint(origin)
	const endPx = L.point(originPx.x + Math.cos(rad) * length, originPx.y + Math.sin(rad) * length)

	return map.containerPointToLatLng(endPx)
}

/**
 * Рисует иконку корабля и линии пеленгов для всех радаров.
 * Выбранные в таблице радары подсвечиваются (толще линия, полная непрозрачность).
 */
export const BearingLayer = () => {
	const radars = useAppSelector(selectRadarsList)
	const selectedRadars = useAppSelector(selectSelectedRadars)
	const map = useMap()

	// Ререндер при зуме/перемещении для пересчёта endpoints
	const [, setTick] = useState(0)
	useEffect(() => {
		const handler = () => setTick(t => t + 1)
		map.on('moveend zoomend', handler)
		return () => {
			map.off('moveend zoomend', handler)
		}
	}, [map])

	// Множество uid выбранных радаров для быстрого поиска
	const selectedUids = useMemo(() => new Set(selectedRadars.map(r => r.uid)), [selectedRadars])

	// Группируем радары по origin
	const originGroups = useMemo(() => {
		const groups = new Map<string, { origin: LatLng; radars: IRadarsList[] }>()

		for (const radar of radars) {
			if (!radar.bearing?.origin || radar.bearing.origin.length < 2) continue

			const key = `${radar.bearing.origin[0]}_${radar.bearing.origin[1]}`
			if (!groups.has(key)) {
				groups.set(key, {
					origin: new LatLng(radar.bearing.origin[0], radar.bearing.origin[1]),
					radars: [],
				})
			}
			groups.get(key)!.radars.push(radar)
		}

		return Array.from(groups.values())
	}, [radars])

	if (originGroups.length === 0) return null

	return (
		<>
			{originGroups.map((group, gi) => (
				<Fragment key={gi}>
					<Marker position={group.origin} icon={shipIcon} interactive={false} pane="bearingPane" />

					{group.radars.map(radar => {
						const isSelected = selectedUids.has(radar.uid)
						const endpoint = getBearingEndpoint(group.origin, radar.bearing.bearing, map)
						return (
							<Polyline
								key={radar.id}
								positions={[group.origin, endpoint]}
								pathOptions={{
									color: radar.color ?? '#4fc3f7',
									weight: isSelected ? 3 : 1.5,
									opacity: isSelected ? 1 : 0.4,
									dashArray: isSelected ? undefined : '8 4',
								}}
								interactive={false}
								pane="bearingPane"
							/>
						)
					})}
				</Fragment>
			))}
		</>
	)
}
