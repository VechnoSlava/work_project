import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '../../../app/store/createAppSlice'
import { ISelectedColorsRadar, ISelectedRadarUid } from '../../../shared/webSocket/IWebSocket'

export interface IRadarsState {
	selectedRadarsUids: ISelectedRadarUid[]
	selectedColorsRadars: ISelectedColorsRadar[]
}

const initialState: IRadarsState = {
	selectedRadarsUids: [],
	selectedColorsRadars: [],
}

export const radarsTableSlice = createAppSlice({
	name: 'radarsTable',
	initialState,
	reducers: create => ({
		addSelectedRadars: create.reducer((state, action: PayloadAction<ISelectedRadarUid[]>) => {
			state.selectedRadarsUids = action.payload
		}),
		addSelectedColor: create.reducer((state, action: PayloadAction<ISelectedColorsRadar[]>) => {
			state.selectedColorsRadars = action.payload
		}),
	}),
	selectors: {
		selectSelectedRadars: state => state.selectedRadarsUids,
		selectSelectedColorsRadars: state => state.selectedColorsRadars,
	},
})

export const { addSelectedRadars, addSelectedColor } = radarsTableSlice.actions
export const { selectSelectedRadars, selectSelectedColorsRadars } = radarsTableSlice.selectors
