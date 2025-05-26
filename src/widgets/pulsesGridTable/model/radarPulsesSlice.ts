import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '../../../app/store/createAppSlice'
import { ISelectedTadId } from '../../../shared/webSocket/IWebSocket'

export interface IRadarsState {
	hoveredPulse: {
		id: number | null
		radar: string
	}
	selectedPulse: {
		id: number | null
		radar: string
	}
}
const initialState: IRadarsState = {
	hoveredPulse: {
		id: null,
		radar: '',
	},
	selectedPulse: {
		id: null,
		radar: '',
	},
}

export const radarPulsesSlice = createAppSlice({
	name: 'radarPulses',
	initialState,
	reducers: create => ({
		addSelectedPulse: create.reducer((state, action: PayloadAction<ISelectedTadId>) => {
			state.selectedPulse = action.payload
		}),
	}),
	selectors: {
		selectSelectedPulse: state => state.selectedPulse,
	},
})

export const { addSelectedPulse } = radarPulsesSlice.actions
export const { selectSelectedPulse } = radarPulsesSlice.selectors
