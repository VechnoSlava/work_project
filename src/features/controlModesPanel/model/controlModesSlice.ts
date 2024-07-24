// import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from '../../../app/store/createAppSlice'

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

export const controlModesSlice = createAppSlice({
	name: 'controlModes',
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
		selectSecondWindow: state => state.isSecondaryWindowOpen,
		selectModeIdentification: state => state.isIdentificationMode,
		selectModeReference: state => state.isReferenceMode,
	},
})

export const { toggleSecondaryWindow, toggleIdentificationMode, toggleReferenceMode } =
	controlModesSlice.actions
export const { selectSecondWindow, selectModeIdentification, selectModeReference } =
	controlModesSlice.selectors
