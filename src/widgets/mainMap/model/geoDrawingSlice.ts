import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '@/app/store/createAppSlice'

export interface IGeoDrawingState {
	mode: 'idle' | 'drawing' | 'editing'
	editingIndex: number | null
}

const initialState: IGeoDrawingState = {
	mode: 'idle',
	editingIndex: null,
}

export const geoDrawingSlice = createAppSlice({
	name: 'geoDrawing',
	initialState,
	reducers: create => ({
		startDrawing: create.reducer(state => {
			state.mode = 'drawing'
			state.editingIndex = null
		}),
		startEditing: create.reducer((state, action: PayloadAction<number>) => {
			state.mode = 'editing'
			state.editingIndex = action.payload
		}),
		finishDrawing: create.reducer(state => {
			state.mode = 'idle'
			state.editingIndex = null
		}),
		cancelDrawing: create.reducer(state => {
			state.mode = 'idle'
			state.editingIndex = null
		}),
	}),
	selectors: {
		selectGeoDrawingMode: state => state.mode,
		selectGeoEditingIndex: state => state.editingIndex,
	},
})

export const { startDrawing, startEditing, finishDrawing, cancelDrawing } = geoDrawingSlice.actions
export const { selectGeoDrawingMode, selectGeoEditingIndex } = geoDrawingSlice.selectors
