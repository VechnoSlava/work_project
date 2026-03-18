import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '../../../app/store/createAppSlice'
import { ISelectedTadId } from '../../../shared/webSocket/IWebSocket'

type SelectedPulseState = ISelectedTadId & {
	source: 'chart' | 'table' | null
}
export interface IRadarsState {
	hoveredPulse: {
		id: number | null
		radar: string
	}
	selectedPulse: SelectedPulseState
}
const initialState: IRadarsState = {
	hoveredPulse: {
		id: null,
		radar: '',
	},
	selectedPulse: {
		id: null,
		radar: '',
		source: null,
	},
}

export const radarPulsesSlice = createAppSlice({
	name: 'radarPulses',
	initialState,
	reducers: create => ({
		addSelectedPulse: create.reducer((state, action: PayloadAction<SelectedPulseState>) => {
			state.selectedPulse = action.payload
		}),
	}),
	selectors: {
		selectSelectedPulse: state => state.selectedPulse,
	},
})

export const { addSelectedPulse } = radarPulsesSlice.actions
export const { selectSelectedPulse } = radarPulsesSlice.selectors
