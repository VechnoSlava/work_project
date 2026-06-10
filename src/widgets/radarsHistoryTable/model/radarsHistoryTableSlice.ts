import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '@/app/store/createAppSlice'
import { ISelectedRadars } from '@/shared/webSocket/IWebSocket'

export interface IRadarsState {
	selectedRadars: ISelectedRadars[]
}
const initialState: IRadarsState = {
	selectedRadars: [],
}

export const radarsHistoryTableSlice = createAppSlice({
	name: 'radarsHistoryTable',
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

export const { addSelectedRadars } = radarsHistoryTableSlice.actions
export const { selectSelectedRadars } = radarsHistoryTableSlice.selectors
