import { createAppSlice } from '@/app/store/createAppSlice'

interface TechModeState {
	isActive: boolean
}

const initialState: TechModeState = {
	isActive: false,
}

export const techModeSlice = createAppSlice({
	name: 'techMode',
	initialState,
	reducers: create => ({
		enableTechMode: create.reducer(state => {
			state.isActive = true
		}),
		disableTechMode: create.reducer(state => {
			state.isActive = false
		}),
	}),
	selectors: {
		selectTechModeActive: state => state.isActive,
	},
})

export const { enableTechMode, disableTechMode } = techModeSlice.actions
export const { selectTechModeActive } = techModeSlice.selectors
