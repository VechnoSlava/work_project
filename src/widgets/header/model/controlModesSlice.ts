import { type PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '@/app/store/createAppSlice'

export interface IModesWorkState {
	isSecondaryWindowMode: boolean
	isIdentificationMode: boolean
	isReferenceMode: boolean
}

const initialState: IModesWorkState = {
	isSecondaryWindowMode: false,
	isIdentificationMode: false,
	isReferenceMode: false,
}

export const controlModesSlice = createAppSlice({
	name: 'workModes',
	initialState,
	reducers: create => ({
		toggleSecondaryWindow: create.reducer(state => {
			state.isSecondaryWindowMode = !state.isSecondaryWindowMode
		}),
		toggleIdentificationMode: create.reducer(state => {
			state.isIdentificationMode = !state.isIdentificationMode
		}),
		setIdentificationMode: create.reducer((state, action: PayloadAction<boolean>) => {
			state.isIdentificationMode = action.payload
		}),
		toggleReferenceMode: create.reducer(state => {
			state.isReferenceMode = !state.isReferenceMode
		}),
		setReferenceMode: create.reducer((state, action: PayloadAction<boolean>) => {
			state.isReferenceMode = action.payload
		}),
	}),
	selectors: {
		selectModeSecondWindow: state => state.isSecondaryWindowMode,
		selectModeIdentification: state => state.isIdentificationMode,
		selectModeReference: state => state.isReferenceMode,
	},
})

export const {
	toggleSecondaryWindow,
	toggleIdentificationMode,
	setIdentificationMode,
	toggleReferenceMode,
	setReferenceMode,
} = controlModesSlice.actions
export const { selectModeSecondWindow, selectModeIdentification, selectModeReference } =
	controlModesSlice.selectors
