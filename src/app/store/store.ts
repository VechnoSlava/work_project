import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { navigationPageSlice } from "../../entities/navigation/model/navigationPageSlice"
import { navigationWindowSlice } from "../../entities/navigation/model/navigationWindowSlice"

//Добавляем слайсы в combineSlices
const rootReducer = combineSlices(navigationPageSlice, navigationWindowSlice)

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
