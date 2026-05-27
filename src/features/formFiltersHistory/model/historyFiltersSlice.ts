import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '@/app/store/createAppSlice'
import { TypeSchemaHistoryFiltersForm } from './schema'
import { historyFilterDefaultValues } from './defaultValues'

export type GeoArea = { name: string; latLng: { lat: number; lng: number }[][] }

const initialState: TypeSchemaHistoryFiltersForm = historyFilterDefaultValues

export const historyFiltersSlice = createAppSlice({
	name: 'historyFilters',
	initialState,
	reducers: create => ({
		updateHistoryFilters: create.reducer(
			(state, action: PayloadAction<TypeSchemaHistoryFiltersForm>) => {
				state.freqFilter = action.payload.freqFilter
				state.pulseDurationFilter = action.payload.pulseDurationFilter
				state.pulsePeriodFilter = action.payload.pulsePeriodFilter
				state.calendarFilter = action.payload.calendarFilter
				state.selectorFilter = action.payload.selectorFilter
				state.geoFilter = action.payload.geoFilter
			},
		),
		addGeoArea: create.reducer((state, action: PayloadAction<GeoArea>) => {
			state.geoFilter.bands.push(action.payload)
		}),
		removeGeoArea: create.reducer((state, action: PayloadAction<number>) => {
			state.geoFilter.bands.splice(action.payload, 1)
		}),
		updateGeoArea: create.reducer(
			(state, action: PayloadAction<{ index: number; area: GeoArea }>) => {
				state.geoFilter.bands[action.payload.index] = action.payload.area
			},
		),
		/** Восстанавливает массив гео-областей из снэпшота (при отмене фильтров) */
		restoreGeoAreas: create.reducer((state, action: PayloadAction<GeoArea[]>) => {
			state.geoFilter.bands = action.payload
		}),
		clearHistoryFilters: create.reducer(() => initialState),
	}),
	selectors: {
		selectHistoryFilters: state => state,
		selectFrequencyFilter: state => state.freqFilter,
		selectPulseDurationFilter: state => state.pulseDurationFilter,
		selectPulsePeriodFilter: state => state.pulsePeriodFilter,
		selectCalendarFilter: state => state.calendarFilter,
		selectSelectorFilter: state => state.selectorFilter,
		selectGeoAreas: state => state.geoFilter.bands,
	},
})

export const {
	updateHistoryFilters,
	clearHistoryFilters,
	addGeoArea,
	removeGeoArea,
	updateGeoArea,
	restoreGeoAreas,
} = historyFiltersSlice.actions

export const { selectHistoryFilters, selectGeoAreas } = historyFiltersSlice.selectors
