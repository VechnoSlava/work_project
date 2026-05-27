import { useMap } from 'react-leaflet'
import { LatLng } from 'leaflet'
import { useMemo } from 'react'
import { useAppSelector } from '@/app/store/hooks'
import { selectRadarsList } from '@/shared/webSocket/serverConnectionSlice'
import { PANEL_STYLE, BTN_LAST, onHover, stopMapPropagation } from '../lib/mapStyles'
import { SvgIcon } from '@/shared/icons/icons'
import config from '../../../../config.json'

/**
 * Кнопка центрирования карты на собственном местоположении.
 * - Если есть данные о position из радаров (bearing.origin) — центрирует на них.
 * - Если данных нет — центрирует на координатах из config.json (workLocation).
 */
export const CenterControl = () => {
	const map = useMap()
	const radars = useAppSelector(selectRadarsList)

	/** Координаты собственного местоположения из первого радара с origin */
	const ownPosition = useMemo((): LatLng | null => {
		for (const radar of radars) {
			if (radar.bearing?.origin && radar.bearing.origin.length >= 2) {
				return new LatLng(radar.bearing.origin[0], radar.bearing.origin[1])
			}
		}
		return null
	}, [radars])

	const handleCenter = () => {
		if (ownPosition) {
			map.setView(ownPosition, 9, { animate: true })
		} else {
			// Fallback на координаты из config.json
			const fallback = (config as any).workLocation as number[] | undefined
			const zoom = (config as any).zoomLocation as number | undefined
			if (fallback && fallback.length >= 2) {
				map.setView(new LatLng(fallback[0], fallback[1]), zoom ?? 9, { animate: true })
			}
		}
	}

	return (
		<div
			ref={stopMapPropagation}
			style={{
				...PANEL_STYLE,
				position: 'absolute',
				top: 172,
				left: 12,
				zIndex: 1000,
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<button
				style={BTN_LAST}
				title={
					ownPosition ? 'Центрировать на своём местоположении' : 'Центрировать на рабочей позиции'
				}
				onClick={handleCenter}
				onMouseEnter={onHover(true)}
				onMouseLeave={onHover(false)}
			>
				<SvgIcon id="icon-compass" width={15} height={15} />
			</button>
		</div>
	)
}
