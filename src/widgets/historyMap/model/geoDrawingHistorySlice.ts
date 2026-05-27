import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '@/app/store/createAppSlice'

export interface IGeoDrawingHistoryState {
	mode: 'idle' | 'drawing' | 'editing'
	editingIndex: number | null
}

const initialState: IGeoDrawingHistoryState = {
	mode: 'idle',
	editingIndex: null,
}

export const geoDrawingHistorySlice = createAppSlice({
	name: 'geoDrawingHistory',
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

export const { startDrawing, startEditing, finishDrawing, cancelDrawing } =
	geoDrawingHistorySlice.actions
export const { selectGeoDrawingMode, selectGeoEditingIndex } = geoDrawingHistorySlice.selectors
