import { createAppSlice } from '@/app/store/createAppSlice'

export interface ISideMenuSettingsState {
	isSideMenuSettingsOpened: boolean
}

const initialState: ISideMenuSettingsState = {
	isSideMenuSettingsOpened: false,
}

export const sideMenuSettingsSlice = createAppSlice({
	name: 'sideMenuSettings',
	initialState,
	reducers: create => ({
		openSideMenuSettings: create.reducer(state => {
			state.isSideMenuSettingsOpened = true
		}),
		closeSideMenuSettings: create.reducer(state => {
			state.isSideMenuSettingsOpened = false
		}),
		toggleSideMenuSettings: create.reducer(state => {
			state.isSideMenuSettingsOpened = !state.isSideMenuSettingsOpened
		}),
	}),
	selectors: {
		selectSideMenuSettingsOpened: state => state.isSideMenuSettingsOpened,
	},
})

export const { openSideMenuSettings, closeSideMenuSettings, toggleSideMenuSettings } =
	sideMenuSettingsSlice.actions
export const { selectSideMenuSettingsOpened } = sideMenuSettingsSlice.selectors
