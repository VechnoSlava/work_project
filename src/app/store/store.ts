import type { Action, Dispatch, Middleware, PayloadAction, ThunkAction } from '@reduxjs/toolkit'
import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { controlModesSlice } from '../../widgets/header/model/controlModesSlice'
import { sideMenuSlice } from '../../widgets/sideMenuFilters/model/sideMenuSlice'
import { pagesNavigationSlice } from '../../features/pagesNavigation/model/pagesNavigationSlice'
import { serverConnectionSlice } from '../../shared/webSocket/serverConnectionSlice'
import { radarsTableSlice } from '../../widgets/radarsTable'
import { webSocketMiddleware } from '../../shared/webSocket/webSocket'
import {
	createStateSyncMiddleware,
	initStateWithPrevTab,
	withReduxStateSync,
} from 'redux-state-sync'

const rootReducer = combineSlices(
	pagesNavigationSlice,
	controlModesSlice,
	sideMenuSlice,
	serverConnectionSlice,
	radarsTableSlice,
)
export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (preloadedState?: Partial<RootState>) => {
	/**
	 * Middleware for redux synchronization
	 */
	const syncMiddleware = createStateSyncMiddleware({
		channel: 'broadcastChanelRedux',
		// Опционально: можно добавить blacklist или whitelist для экшенов, которые не должны синхронизироваться
		// blacklist: ['__rtkq/unfocused', '__rtkq/focused'],
		// whitelist: ['SYNCED_ACTION_TYPE'],
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
