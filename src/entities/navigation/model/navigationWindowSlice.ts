import { createAppSlice } from "../../../app/store/createAppSlice"

export interface WindowState {
  isSecondaryWindowOpen: boolean
}

const initialState: WindowState = {
  isSecondaryWindowOpen: false,
}

export const navigationWindowSlice = createAppSlice({
  name: "navigationWindow",
  initialState,
  reducers: create => ({
    toggleSecondaryWindow: create.reducer(state => {
      state.isSecondaryWindowOpen = !state.isSecondaryWindowOpen
    }),
  }),
  selectors: {
    selectWindow: state => state.isSecondaryWindowOpen,
  },
})

export const { toggleSecondaryWindow } = navigationWindowSlice.actions
export const { selectWindow } = navigationWindowSlice.selectors
