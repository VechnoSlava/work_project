// import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "../../../app/store/createAppSlice"

export interface WindowState {
  isSecondaryWindowOpen: boolean
  isIdentificationMode: boolean
  isReferenceMode: boolean
}

const initialState: WindowState = {
  isSecondaryWindowOpen: false,
  isIdentificationMode: false,
  isReferenceMode: false,
}

export const navigationWindowSlice = createAppSlice({
  name: "navigationWindow",
  initialState,
  reducers: create => ({
    toggleSecondaryWindow: create.reducer(state => {
      state.isSecondaryWindowOpen = !state.isSecondaryWindowOpen
    }),
    toggleIdentificationMode: create.reducer(state => {
      state.isIdentificationMode = !state.isIdentificationMode
    }),
    toggleReferenceMode: create.reducer(state => {
      state.isReferenceMode = !state.isReferenceMode
    }),
  }),
  selectors: {
    selectWindow: state => state.isSecondaryWindowOpen,
    selectModeIdentification: state => state.isIdentificationMode,
    selectModeReference: state => state.isReferenceMode,
  },
})

export const {
  toggleSecondaryWindow,
  toggleIdentificationMode,
  toggleReferenceMode,
} = navigationWindowSlice.actions
export const { selectWindow, selectModeIdentification, selectModeReference } =
  navigationWindowSlice.selectors
