import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '@/app/store/createAppSlice'
import { TypeSchemaMainFiltersForm } from './schema'
import { mainFilterDefaultValues } from '@/shared/constants/filterDefaults'

export type GeoArea = { name: string; latLng: { lat: number; lng: number }[][] }

const initialState: TypeSchemaMainFiltersForm = mainFilterDefaultValues

export const mainFiltersSlice = createAppSlice({
	name: 'mainFilters',
	initialState,
	reducers: create => ({
		updateMainFilters: create.reducer((state, action: PayloadAction<TypeSchemaMainFiltersForm>) => {
			state.freqFilter = action.payload.freqFilter
			state.pulseDurationFilter = action.payload.pulseDurationFilter
			state.pulsePeriodFilter = action.payload.pulsePeriodFilter
			state.calendarFilter = action.payload.calendarFilter
			state.selectorFilter = action.payload.selectorFilter
			state.geoFilter = action.payload.geoFilter
		}),
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
		clearMainFilters: create.reducer(() => initialState),
	}),
	selectors: {
		selectMainFilters: state => state,
		selectFrequencyFilter: state => state.freqFilter,
		selectPulseDurationFilter: state => state.pulseDurationFilter,
		selectPulsePeriodFilter: state => state.pulsePeriodFilter,
		selectCalendarFilter: state => state.calendarFilter,
		selectSelectorFilter: state => state.selectorFilter,
		selectGeoAreas: state => state.geoFilter.bands,
	},
})

export const {
	updateMainFilters,
	clearMainFilters,
	addGeoArea,
	removeGeoArea,
	updateGeoArea,
	restoreGeoAreas,
} = mainFiltersSlice.actions

export const { selectMainFilters, selectGeoAreas } = mainFiltersSlice.selectors
