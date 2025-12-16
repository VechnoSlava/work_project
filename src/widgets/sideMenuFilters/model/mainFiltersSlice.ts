import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '../../../app/store/createAppSlice'
import { TypeSchemaMainFiltersForm } from '../../../features/formFiltersMain/model/schema'

const initialState: TypeSchemaMainFiltersForm = {
	freqFilter: {
		key: 0,
		filterLabel: 'Фильтрация по частоте',
		templateType: 'bands',
		units: {
			'1': 'Гц',
			'1000': 'кГц',
			'1000000': 'МГц',
			'1000000000': 'ГГц',
		},
		bands: [],
	},
	pulseDurationFilter: {
		key: 1,
		filterLabel: 'Фильтрация по длительности импульса',
		templateType: 'bands',
		units: {
			'0.001': 'мс',
			'0.000001': 'мкс',
			'0.000000001': 'нс',
		},
		bands: [],
	},
	pulsePeriodFilter: {
		key: 2,
		filterLabel: 'Фильтрация по периоду следования импульсов',
		templateType: 'bands',
		units: {
			'0.001': 'мс',
			'0.000001': 'мкс',
			'0.000000001': 'нс',
		},
		bands: [],
	},
	calendarFilter: {
		key: 3,
		filterLabel: 'Фильтрация по дате и времени',
		templateType: 'calendar',
		bands: [null, null],
	},
	selectorFilter: {
		key: 5,
		filterLabel: 'Фильтрация по типу целей',
		templateType: 'selector',
		units: {
			'0': 'нет',
			'1': 'радиоцель',
			'2': 'эталон',
			'3': 'импульсная РЛС',
			'4': 'большебазовая РЛС',
		},
		value: '0',
	},
}

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
