import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '../../../app/store/createAppSlice'
import { ISelectedTadId } from '../../../shared/webSocket/IWebSocket'

export interface IPulsesState {
	selectedTadId: ISelectedTadId | null
}

const initialState: IPulsesState = {
	selectedTadId: null,
}

export const pulsesTableSlice = createAppSlice({
	name: 'pulsesTable',
	initialState,
	reducers: create => ({
		addSelectedTad: create.reducer((state, action: PayloadAction<ISelectedTadId>) => {
			state.selectedTadId = action.payload
		}),
	}),
	selectors: {
		selectSelectedTad: state => state.selectedTadId,
	},
})

export const { addSelectedTad } = pulsesTableSlice.actions
export const { selectSelectedTad } = pulsesTableSlice.selectors
