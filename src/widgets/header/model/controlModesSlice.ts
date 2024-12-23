import { createAppSlice } from '../../../app/store/createAppSlice'

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
		toggleReferenceMode: create.reducer(state => {
			state.isReferenceMode = !state.isReferenceMode
		}),
	}),
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
