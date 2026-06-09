export type RoutePath =
	// Основные окна
	| '/'
	| '/identification'
	| '/history'
	| '/history/identification'
	// Вторые окна (slave)
	| '/slave-main'
	| '/slave-main/identification'
	| '/slave-history'
	| '/slave-history/identification'

export const ROUTES_PATH = {
	// ── Текущая обстановка ──
	MAIN: '/',
	IDENTIFICATION: '/identification',
	SLAVEMAIN: '/slave-main',
	SLAVEIDENTIFICATION: '/slave-main/identification',
	// ── База данных ──
	HISTORY: '/history',
	HISTORYIDENTIFICATION: '/history/identification',
	SLAVEHISTORY: '/slave-history',
	SLAVEHISTORYIDENTIFICATION: '/slave-history/identification',
} as const satisfies Record<string, RoutePath>

/**
 * Соответствие основного окна и его второго (slave) окна.
 * Используется при открытии второго окна, чтобы оно
 * открылось в том же режиме (обычный / идентификация).
 */
export const MASTER_TO_SLAVE: Record<string, RoutePath> = {
	[ROUTES_PATH.MAIN]: ROUTES_PATH.SLAVEMAIN,
	[ROUTES_PATH.IDENTIFICATION]: ROUTES_PATH.SLAVEIDENTIFICATION,
	[ROUTES_PATH.HISTORY]: ROUTES_PATH.SLAVEHISTORY,
	[ROUTES_PATH.HISTORYIDENTIFICATION]: ROUTES_PATH.SLAVEHISTORYIDENTIFICATION,
}

/**
 * Базовая вкладка для любого пути основного окна.
 * Идентификационные пути сводятся к своей вкладке,
 * т.к. идентификация — под-режим вкладки, а не отдельная вкладка.
 * Используется для подсветки навигации (Tabs/Menu).
 */
export const PAGE_TO_BASE_TAB: Record<string, RoutePath> = {
	[ROUTES_PATH.MAIN]: ROUTES_PATH.MAIN,
	[ROUTES_PATH.IDENTIFICATION]: ROUTES_PATH.MAIN,
	[ROUTES_PATH.HISTORY]: ROUTES_PATH.HISTORY,
	[ROUTES_PATH.HISTORYIDENTIFICATION]: ROUTES_PATH.HISTORY,
}
