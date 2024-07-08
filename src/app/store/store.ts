import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { controlModesSlice } from "../../features/controlModesPanel/model/controlModesSlice"
import { sideMenuSlice } from "../../widgets/sideMenuFilters/model/sideMenuSlice"
import { pagesNavigationSlice } from "../../features/pagesNavigation/model/pagesNavigationSlice"
import { serverConnectionSlice } from "../../features/buttonConnectToServer/model/serverConnectionSlice"

//Добавляем слайсы в combineSlices
const rootReducer = combineSlices(
  pagesNavigationSlice,
  controlModesSlice,
  sideMenuSlice,
  serverConnectionSlice,
)

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,

    preloadedState,
  })

  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()

//Экспортируем типы
export type RootState = ReturnType<typeof rootReducer>
export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
