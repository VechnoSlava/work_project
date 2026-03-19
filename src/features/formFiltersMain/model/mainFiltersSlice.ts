import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '../../../app/store/createAppSlice'
import { TypeSchemaMainFiltersForm } from './schema'
import { mainFilterDefaultValues } from '../../../shared/constants/filterDefaults'

type GeoArea = { name: string; latLng: { lat: number; lng: number }[][] }

interface IMainFiltersState extends TypeSchemaMainFiltersForm {
	geoDrawingMode: 'idle' | 'drawing' | 'editing'
	geoEditingIndex: number | null
}

const initialState: IMainFiltersState = {
	...mainFilterDefaultValues,
	geoDrawingMode: 'idle',
	geoEditingIndex: null,
}

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
			state.geoDrawingMode = 'idle'
		}),
		removeGeoArea: create.reducer((state, action: PayloadAction<number>) => {
			state.geoFilter.bands.splice(action.payload, 1)
		}),
		updateGeoArea: create.reducer(
			(state, action: PayloadAction<{ index: number; area: GeoArea }>) => {
				state.geoFilter.bands[action.payload.index] = action.payload.area
				state.geoDrawingMode = 'idle'
				state.geoEditingIndex = null
			},
		),
		setGeoDrawingMode: create.reducer(
			(state, action: PayloadAction<'idle' | 'drawing' | 'editing'>) => {
				state.geoDrawingMode = action.payload
			},
		),
		setGeoEditingIndex: create.reducer((state, action: PayloadAction<number | null>) => {
			state.geoEditingIndex = action.payload
			state.geoDrawingMode = action.payload !== null ? 'editing' : 'idle'
		}),
		clearMainFilters: create.reducer(() => {
			return initialState
		}),
	}),
	selectors: {
		selectMainFilters: state => {
			const { geoDrawingMode, geoEditingIndex, ...filters } = state
			return filters as TypeSchemaMainFiltersForm
		},
		selectFrequencyFilter: state => state.freqFilter,
		selectPulseDurationFilter: state => state.pulseDurationFilter,
		selectPulsePeriodFilter: state => state.pulsePeriodFilter,
		selectCalendarFilter: state => state.calendarFilter,
		selectSelectorFilter: state => state.selectorFilter,
		selectGeoAreas: state => state.geoFilter.bands,
		selectGeoDrawingMode: state => state.geoDrawingMode,
		selectGeoEditingIndex: state => state.geoEditingIndex,
	},
})

export const {
	updateMainFilters,
	clearMainFilters,
	addGeoArea,
	removeGeoArea,
	updateGeoArea,
	setGeoDrawingMode,
	setGeoEditingIndex,
} = mainFiltersSlice.actions

export const { selectMainFilters, selectGeoAreas, selectGeoDrawingMode, selectGeoEditingIndex } =
	mainFiltersSlice.selectors
