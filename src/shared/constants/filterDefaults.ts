import { TypeSchemaMainFiltersForm } from '@/features/formFiltersMain/model/schema'

export const mainFilterDefaultValues: TypeSchemaMainFiltersForm = {
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
	geoFilter: {
		key: 4,
		filterLabel: 'Фильтрация по географической области',
		templateType: 'geoFilter',
		bands: [],
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
