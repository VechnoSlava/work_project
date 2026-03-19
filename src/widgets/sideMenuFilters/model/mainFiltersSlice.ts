import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '../../../app/store/createAppSlice'
import { TypeSchemaMainFiltersForm } from '../../../features/formFiltersMain/model/schema'
import { mainFilterDefaultValues } from '../../../shared/constants/filterDefaults'

const initialState = mainFilterDefaultValues

export const mainFiltersSlice = createAppSlice({
	name: 'mainFilters',
	initialState,
	reducers: create => ({
		updateMainFilters: create.reducer((state, action: PayloadAction<TypeSchemaMainFiltersForm>) => {
			// Обновляем каждый фильтр отдельно для избежания потери структуры
			state.freqFilter = action.payload.freqFilter
			state.pulseDurationFilter = action.payload.pulseDurationFilter
			state.pulsePeriodFilter = action.payload.pulsePeriodFilter
			state.calendarFilter = action.payload.calendarFilter
			state.selectorFilter = action.payload.selectorFilter
		}),

		// Очистка всех фильтров (сброс к значениям по умолчанию)
		clearMainFilters: create.reducer(state => {
			// Сбрасываем все фильтры к initial state
			return { ...initialState }
		}),
	}),
	selectors: {
		selectMainFilters: state => state,
		selectFrequencyFilter: state => state.freqFilter,
		selectPulseDurationFilter: state => state.pulseDurationFilter,
		selectPulsePeriodFilter: state => state.pulsePeriodFilter,
		selectCalendarFilter: state => state.calendarFilter,
		selectSelectorFilter: state => state.selectorFilter,
	},
})

export const { updateMainFilters, clearMainFilters } = mainFiltersSlice.actions
export const { selectMainFilters } = mainFiltersSlice.selectors
