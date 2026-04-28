// SVG-спрайт — все иконки проекта.
// Использование: <SvgIcon id="ruler" width={15} height={15} />
// или напрямую: <svg><use href="#icon-ruler" /></svg>
//
// Спрайт монтируется один раз через <SvgSprite /> в корне приложения (App.tsx или Providers).

import React from 'react'

export const SvgSprite: React.FC = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		style={{ display: 'none', position: 'absolute' }}
		aria-hidden="true"
	>
		{/* Линейка */}
		<symbol id="icon-ruler" viewBox="0 0 16 16">
			<path d="M1 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H1zm0 1h14v8H1V4zm1 1v6h2V9h1v1h1V9h1v2h1V9h1v1h1V5H2zm1 1h1v3H3V6zm3 0h1v2H6V6zm3 0h1v3H9V6zm3 0h1v2h-1V6z" />
		</symbol>

		{/* Корзина / Очистить */}
		<symbol id="icon-trash" viewBox="0 0 24 24">
			<path d="M19 4H15.5L14.5 3H9.5L8.5 4H5V6H19M6 19a2 2 0 0 0 2 2H16a2 2 0 0 0 2-2V7H6V19Z" />
		</symbol>

		{/* Стрелка наконечника линейки (marker-end) */}
		<symbol id="icon-arrow-head" viewBox="0 0 10 10">
			<path d="M0,1 L9,5 L0,9 L2.5,5 Z" />
		</symbol>

		{/* Компас / Центрирование */}
		<symbol id="icon-compass" viewBox="0 0 24 24">
			<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5 7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
		</symbol>
	</svg>
)

interface SvgIconProps {
	id: string
	width?: number | string
	height?: number | string
	fill?: string
	className?: string
	style?: React.CSSProperties
}

export const SvgIcon: React.FC<SvgIconProps> = ({
	id,
	width = 16,
	height = 16,
	fill = 'currentColor',
	className,
	style,
}) => (
	<svg
		width={width}
		height={height}
		fill={fill}
		className={className}
		style={style}
		aria-hidden="true"
	>
		<use href={`#${id}`} />
	</svg>
)
