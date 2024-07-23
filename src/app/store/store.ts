import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { controlModesSlice } from '../../features/controlModesPanel/model/controlModesSlice'
import { sideMenuSlice } from '../../widgets/sideMenuFilters/model/sideMenuSlice'
import { pagesNavigationSlice } from '../../features/pagesNavigation/model/pagesNavigationSlice'
import { serverConnectionSlice } from '../../shared/webSocket/serverConnectionSlice'
import { webSocketMiddleware } from '../../shared/webSocket/websocket'

//Добавляем слайсы в combineSlices
const rootReducer = combineSlices(
	pagesNavigationSlice,
	controlModesSlice,
	sideMenuSlice,
	serverConnectionSlice,
)
// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (preloadedState?: Partial<RootState>) => {
	const store = configureStore({
		reducer: rootReducer,
		// Adding the api middleware enables caching, invalidation, polling,
		// and other useful features of `rtk-query`.
		middleware: getDefaultMiddleware => {
			return getDefaultMiddleware().concat(webSocketMiddleware)
		},
		preloadedState,
	})

	setupListeners(store.dispatch)
	return store
}

export const store = makeStore()

//Экспортируем типы
// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ThunkReturnType = void> = ThunkAction<
	ThunkReturnType,
	RootState,
	unknown,
	Action
>
