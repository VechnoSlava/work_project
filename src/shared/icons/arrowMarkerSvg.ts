// Утилита для инъекции SVG-маркера стрелки в Leaflet overlay SVG.
// Путь стрелки берётся из локального спрайта (icons.tsx #icon-arrow-head),
// поэтому нет обращений к внешним ресурсам.

// Параметры маркера — единственный источник правды
export const ARROW_MARKER = {
	viewBox: '0 0 10 10',
	refX: '8',
	refY: '5',
	markerWidth: '10',
	markerHeight: '10',
	orient: 'auto',
	// Путь из symbol #icon-arrow-head в icons.tsx
	pathD: 'M0,1 L9,5 L0,9 L2.5,5 Z',
	fill: '#4fc3f7',
} as const

const SVG_NS = 'http://www.w3.org/2000/svg'

/**
 * Создаёт <marker> в <defs> Leaflet SVG-слоя, используя локальный путь иконки.
 * Безопасно вызывать повторно — проверяет наличие по id.
 */
export const injectArrowMarker = (svgRoot: SVGSVGElement, markerId: string): void => {
	if (svgRoot.querySelector(`#${markerId}`)) return

	let defs = svgRoot.querySelector('defs')
	if (!defs) {
		defs = document.createElementNS(SVG_NS, 'defs')
		svgRoot.insertBefore(defs, svgRoot.firstChild)
	}

	const marker = document.createElementNS(SVG_NS, 'marker')
	marker.setAttribute('id', markerId)
	marker.setAttribute('viewBox', ARROW_MARKER.viewBox)
	marker.setAttribute('refX', ARROW_MARKER.refX)
	marker.setAttribute('refY', ARROW_MARKER.refY)
	marker.setAttribute('markerWidth', ARROW_MARKER.markerWidth)
	marker.setAttribute('markerHeight', ARROW_MARKER.markerHeight)
	marker.setAttribute('orient', ARROW_MARKER.orient)

	const path = document.createElementNS(SVG_NS, 'path')
	path.setAttribute('d', ARROW_MARKER.pathD)
	path.setAttribute('fill', ARROW_MARKER.fill)

	marker.appendChild(path)
	defs.appendChild(marker)
}
