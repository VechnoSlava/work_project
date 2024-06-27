import { createAppSlice } from "../../../app/store/createAppSlice"

export interface ISideMenuState {
  isSideMenuOpened: boolean
}

const initialState: ISideMenuState = {
  isSideMenuOpened: false,
}

export const sideMenuSlice = createAppSlice({
  name: "sideMenuFilters",
  initialState,
  reducers: create => ({
    openSideMenu: create.reducer(state => {
      state.isSideMenuOpened = true
    }),
    closeSideMenu: create.reducer(state => {
      state.isSideMenuOpened = false
    }),
    toggleSideMenu: create.reducer(state => {
      state.isSideMenuOpened = !state.isSideMenuOpened
    }),
  }),
  selectors: {
    selectSideMenuOpened: state => state.isSideMenuOpened,
  },
})

export const { openSideMenu, closeSideMenu, toggleSideMenu } =
  sideMenuSlice.actions
export const { selectSideMenuOpened } = sideMenuSlice.selectors
