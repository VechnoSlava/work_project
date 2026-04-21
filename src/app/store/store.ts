import type { Action, Dispatch, Middleware, PayloadAction, ThunkAction } from '@reduxjs/toolkit'
import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { controlModesSlice } from '@/widgets/header/model/controlModesSlice'
import { sideMenuSlice } from '@/widgets/sideMenuFilters/model/sideMenuSlice'
import { pagesNavigationSlice } from '@/features/pagesNavigation/model/pagesNavigationSlice'
import { serverConnectionSlice } from '@/shared/webSocket/serverConnectionSlice'
import { radarsTableSlice } from '@/widgets/radarsTable'
import { webSocketMiddleware } from '@/shared/webSocket/websocket'
import {
	createStateSyncMiddleware,
	initStateWithPrevTab,
	withReduxStateSync,
} from 'redux-state-sync'
import { radarPulsesSlice } from '@/widgets/pulsesGridTable/model/radarPulsesSlice'
import { mainFiltersSlice } from '@/features/formFiltersMain/model/mainFiltersSlice'
import { geoDrawingSlice } from '@/widgets/mainMap'

const rootReducer = combineSlices(
	pagesNavigationSlice,
	controlModesSlice,
	sideMenuSlice,
	serverConnectionSlice,
	radarsTableSlice,
	radarPulsesSlice,
	mainFiltersSlice,
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
