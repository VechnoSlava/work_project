// import type { PayloadAction } from "@reduxjs/toolkit"
import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '../../../app/store/createAppSlice'
import { RootState } from '../../../app/store/store'

export interface IModesWorkState {
	isSecondaryWindowMode: boolean
	isIdentificationMode: boolean
	isReferenceMode: boolean
}
interface HydrateStateAction {
	type: 'HYDRATE_STATE'
	payload: RootState
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
		toggleReferenceMode: create.reducer(state => {
			state.isReferenceMode = !state.isReferenceMode
		}),
	}),
	extraReducers: builder => {
		builder.addCase('HYDRATE_STATE', (state, action: HydrateStateAction) => {
			// Обнови состояние с новыми данными
			return action.payload.workModes
		})
	},
	selectors: {
		selectModeSecondWindow: state => state.isSecondaryWindowMode,
		selectModeIdentification: state => state.isIdentificationMode,
		selectModeReference: state => state.isReferenceMode,
	},
})

export const { toggleSecondaryWindow, toggleIdentificationMode, toggleReferenceMode } =
	controlModesSlice.actions
export const { selectModeSecondWindow, selectModeIdentification, selectModeReference } =
	controlModesSlice.selectors
