import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '../../../app/store/createAppSlice'
import { ISelectedRowId } from '../../../shared/webSocket/IWebSocket'

export interface IRadarsState {
	selectedRadarsUids: ISelectedRowId[]
}

const initialState: IRadarsState = {
	selectedRadarsUids: [],
}

export const radarsTableSlice = createAppSlice({
	name: 'radarsTable',
	initialState,
	reducers: create => ({
		addSelectedRadars: create.reducer((state, action: PayloadAction<ISelectedRowId[]>) => {
			state.selectedRadarsUids = action.payload
		}),
	}),
	selectors: {
		selectSelectedRadars: state => state.selectedRadarsUids,
	},
})

export const { addSelectedRadars } = radarsTableSlice.actions
export const { selectSelectedRadars } = radarsTableSlice.selectors

// deleteSelectedRadars: create.reducer((state, action: PayloadAction<number>) => {
// 	return {
// 		...state,
// 		selectedRadarsUids: state.selectedRadarsUids.filter(
// 			radar => radar !== action.payload,
// 		),
// 	}
// }),
