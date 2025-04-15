import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '../../../app/store/createAppSlice'
import { ISelectedRadars } from '../../../shared/webSocket/IWebSocket'

export interface IRadarsState {
	selectedRadars: ISelectedRadars[]
}
const initialState: IRadarsState = {
	selectedRadars: [],
}

export const radarsTableSlice = createAppSlice({
	name: 'radarsTable',
	initialState,
	reducers: create => ({
		addSelectedRadars: create.reducer((state, action: PayloadAction<ISelectedRadars[]>) => {
			state.selectedRadars = action.payload
		}),
	}),
	selectors: {
		selectSelectedRadars: state => state.selectedRadars,
	},
})

export const { addSelectedRadars } = radarsTableSlice.actions
export const { selectSelectedRadars } = radarsTableSlice.selectors
