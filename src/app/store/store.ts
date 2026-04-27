import type { Action, Dispatch, Middleware, PayloadAction, ThunkAction } from '@reduxjs/toolkit'
import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { serverConnectionSlice } from '@/shared/webSocket/serverConnectionSlice'
import { radarsTableSlice } from '@/widgets/radarsTable'
import { geoDrawingSlice } from '@/widgets/mainMap'
import { sideMenuSettingsSlice } from '@/widgets/sideMenuSettings'
import { mainFiltersSlice } from '@/features/formFiltersMain'
import { radarPulsesSlice } from '@/widgets/pulsesGridTable'
import { pagesNavigationSlice } from '@/features/pagesNavigation'
import { sideMenuSlice } from '@/widgets/sideMenuFilters'
import { controlModesSlice } from '@/widgets/header'
import { formSettingsSlice } from '@/features/formSettingsMain'
import { webSocketMiddleware } from '@/shared/webSocket/websocket'
import {
	createStateSyncMiddleware,
	initStateWithPrevTab,
	withReduxStateSync,
} from 'redux-state-sync'

const rootReducer = combineSlices(
	pagesNavigationSlice,
	controlModesSlice,
	sideMenuSlice,
	sideMenuSettingsSlice,
	serverConnectionSlice,
	radarsTableSlice,
	radarPulsesSlice,
	mainFiltersSlice,
	formSettingsSlice,
	geoDrawingSlice,
)
export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (preloadedState?: Partial<RootState>) => {
	/**
	 * Middleware for redux synchronization
	 */
	const syncMiddleware = createStateSyncMiddleware({
		channel: 'broadcastChanelRedux',
		blacklist: [
			'serverConnection/connectToServerRequest',
			'serverConnection/connectToServerSuccess',
			'serverConnection/connectToServerFailure',
			'serverConnection/disconnectToServer',
			// Боковое меню фильтров — локальный UI, есть только в главном окне
			'sideMenuFilters/openSideMenu',
			'sideMenuFilters/closeSideMenu',
			'sideMenuFilters/toggleSideMenu',
			// Боковое меню настроек — аналогично
			'sideMenuSettings/openSideMenuSettings',
			'sideMenuSettings/closeSideMenuSettings',
			'sideMenuSettings/toggleSideMenuSettings',
		],
	}) as Middleware<{}, RootState, Dispatch<PayloadAction>>

	const store = configureStore({
		reducer: withReduxStateSync(rootReducer),
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware().concat(webSocketMiddleware).concat(syncMiddleware),
		preloadedState,
	})
	initStateWithPrevTab(store)
	return store
}

export const store = makeStore()

//Экспортируем типы
export type AppStore = typeof store
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ThunkReturnType = void> = ThunkAction<
	ThunkReturnType,
	RootState,
	unknown,
	Action
>
