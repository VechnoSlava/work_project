import { createAppSlice } from "../../../app/store/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import { ROUTES_PATH, type RoutePath } from "../../../shared/constants/routes"

export interface PageState {
  currentMainPage: RoutePath
  currentSlavePage: RoutePath | ""
}

const initialState: PageState = {
  currentMainPage: ROUTES_PATH.MAIN,
  currentSlavePage: "",
}

export const navigationPageSlice = createAppSlice({
  name: "navigationPage",
  initialState,
  reducers: create => ({
    setPage: create.reducer((state, action: PayloadAction<RoutePath>) => {
      state.currentMainPage = action.payload
    }),
    setSlavePage: create.reducer((state, action: PayloadAction<RoutePath>) => {
      state.currentSlavePage = action.payload
    }),
  }),
  selectors: {
    selectPage: state => state.currentMainPage,
    selectSlavePage: state => state.currentSlavePage,
  },
})

export const { setPage, setSlavePage } = navigationPageSlice.actions
export const { selectPage, selectSlavePage } = navigationPageSlice.selectors
