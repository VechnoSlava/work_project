// Общие стили панелей и кнопок карты.

import React from 'react'

export const PANEL_STYLE: React.CSSProperties = {
	background: 'rgba(9, 30, 47, 0.88)',
	border: '1px solid rgba(255,255,255,0.12)',
	borderRadius: 4,
	pointerEvents: 'all',
	userSelect: 'none',
}

export const BTN_STYLE: React.CSSProperties = {
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

export const BTN_LAST: React.CSSProperties = { ...BTN_STYLE, borderBottom: 'none' }

export const onHover = (on: boolean) => (e: React.MouseEvent<HTMLButtonElement>) => {
	e.currentTarget.style.background = on ? 'rgba(255,255,255,0.08)' : 'transparent'
}
