import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../../app/store/createAppSlice"

export interface WindowState {
  isSecondaryWindowOpen: boolean
  secondaryWindowPath: string
}

const initialState: WindowState = {
  isSecondaryWindowOpen: false,
  secondaryWindowPath: "",
}

export const navigationWindowSlice = createAppSlice({
  name: "navigationWindow",
  initialState,
  reducers: create => ({
    toggleSecondaryWindow: create.reducer(state => {
      state.isSecondaryWindowOpen = !state.isSecondaryWindowOpen
    }),
    setSecondaryWindowPath: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.secondaryWindowPath = action.payload
      },
    ),
  }),
  selectors: {
    selectWindow: state => state.isSecondaryWindowOpen,
    selectPath: state => state.secondaryWindowPath,
  },
})

export const { toggleSecondaryWindow, setSecondaryWindowPath } =
  navigationWindowSlice.actions
export const { selectWindow, selectPath } = navigationWindowSlice.selectors
