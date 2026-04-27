import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '@/app/store/createAppSlice'
import { TypeSchemaMainSettingsForm } from './schema'
import { mainSettingsDefaultValues } from '@/shared/constants/settingsDefaults'

const initialState: TypeSchemaMainSettingsForm = mainSettingsDefaultValues

export const formSettingsSlice = createAppSlice({
	name: 'mainSettings',
	initialState,
	reducers: create => ({
		updateMainSettings: create.reducer(
			(state, action: PayloadAction<TypeSchemaMainSettingsForm>) => {
				state.bandsFilter = action.payload.bandsFilter
				state.vsk = action.payload.vsk
			},
		),
		clearMainSettings: create.reducer(() => initialState),
	}),
	selectors: {
		selectMainSettings: state => state,
	},
})

export const { updateMainSettings, clearMainSettings } = formSettingsSlice.actions

export const { selectMainSettings } = formSettingsSlice.selectors
