import { createAppSlice } from "../../../app/store/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import { ROUTES_PATH, type RoutePath } from "../../../shared/constants/routes"

export interface PageState {
  currentPage: RoutePath
}

const initialState: PageState = {
  currentPage: ROUTES_PATH.MAIN,
}

export const navigationPageSlice = createAppSlice({
  name: "navigationPage",
  initialState,
  reducers: create => ({
    setPage: create.reducer((state, action: PayloadAction<RoutePath>) => {
      state.currentPage = action.payload
    }),
  }),
  selectors: {
    selectPage: state => state.currentPage,
  },
})

export const { setPage } = navigationPageSlice.actions
export const { selectPage } = navigationPageSlice.selectors
