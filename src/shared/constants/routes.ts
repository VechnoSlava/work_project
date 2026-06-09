export type RoutePath =
	// Основные окна
	| '/'
	| '/identification'
	| '/history'
	| '/history/identification'
	| '/history/reference'
	// Вторые окна (slave)
	| '/slave-main'
	| '/slave-main/identification'
	| '/slave-history'
	| '/slave-history/identification'
	| '/slave-history/reference'

export const ROUTES_PATH = {
	// ── Текущая обстановка ──
	MAIN: '/',
	IDENTIFICATION: '/identification',
	SLAVEMAIN: '/slave-main',
	SLAVEIDENTIFICATION: '/slave-main/identification',
	// ── База данных ──
	HISTORY: '/history',
	HISTORYIDENTIFICATION: '/history/identification',
	HISTORYREFERENCE: '/history/reference',
	SLAVEHISTORY: '/slave-history',
	SLAVEHISTORYIDENTIFICATION: '/slave-history/identification',
	SLAVEHISTORYREFERENCE: '/slave-history/reference',
} as const satisfies Record<string, RoutePath>

/**
 * Соответствие основного окна и его второго (slave) окна.
 * Используется при открытии второго окна, чтобы оно
 * открылось в том же режиме (обычный / идентификация / эталоны).
 */
export const MASTER_TO_SLAVE: Record<string, RoutePath> = {
	[ROUTES_PATH.MAIN]: ROUTES_PATH.SLAVEMAIN,
	[ROUTES_PATH.IDENTIFICATION]: ROUTES_PATH.SLAVEIDENTIFICATION,
	[ROUTES_PATH.HISTORY]: ROUTES_PATH.SLAVEHISTORY,
	[ROUTES_PATH.HISTORYIDENTIFICATION]: ROUTES_PATH.SLAVEHISTORYIDENTIFICATION,
	[ROUTES_PATH.HISTORYREFERENCE]: ROUTES_PATH.SLAVEHISTORYREFERENCE,
}

/**
 * Базовая вкладка для любого пути основного окна.
 * Под-режимы (идентификация / эталоны) сводятся к своей вкладке,
 * т.к. это под-режимы вкладки, а не отдельные вкладки.
 * Используется для подсветки навигации (Tabs/Menu).
 */
export const PAGE_TO_BASE_TAB: Record<string, RoutePath> = {
	[ROUTES_PATH.MAIN]: ROUTES_PATH.MAIN,
	[ROUTES_PATH.IDENTIFICATION]: ROUTES_PATH.MAIN,
	[ROUTES_PATH.HISTORY]: ROUTES_PATH.HISTORY,
	[ROUTES_PATH.HISTORYIDENTIFICATION]: ROUTES_PATH.HISTORY,
	[ROUTES_PATH.HISTORYREFERENCE]: ROUTES_PATH.HISTORY,
}
