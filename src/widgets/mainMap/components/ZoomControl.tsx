import { useMap } from 'react-leaflet'
import { PANEL_STYLE, BTN_STYLE, BTN_LAST, onHover, stopMapPropagation } from '../lib/mapStyles'

export const ZoomControl = () => {
	const map = useMap()
	return (
		<div
			ref={stopMapPropagation}
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
				onMouseEnter={onHover(true)}
				onMouseLeave={onHover(false)}
			>
				+
			</button>
			<button
				style={BTN_LAST}
				title="Отдалить"
				onClick={() => map.zoomOut()}
				onMouseEnter={onHover(true)}
				onMouseLeave={onHover(false)}
			>
				−
			</button>
		</div>
	)
}
