// import type { PayloadAction } from "@reduxjs/toolkit"
import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '../../../app/store/createAppSlice'

export interface IRadarsState {
	currentsTargetsRadars: number[]
}

const initialState: IRadarsState = {
	currentsTargetsRadars: [],
}

export const radarsTableSlice = createAppSlice({
	name: 'radarsTable',
	initialState,
	reducers: create => ({
		addCurrentRadars: create.reducer((state, action: PayloadAction<number>) => {
			state.currentsTargetsRadars.push(action.payload)
		}),
		deleteCurrentRadars: create.reducer((state, action: PayloadAction<number>) => {
			return {
				...state,
				currentsTargetsRadars: state.currentsTargetsRadars.filter(
					radar => radar !== action.payload,
				),
			}
		}),
	}),
	selectors: {
		selectCurrentsRadars: state => state.currentsTargetsRadars,
	},
})

export const { addCurrentRadars } = radarsTableSlice.actions
export const { selectCurrentsRadars } = radarsTableSlice.selectors
