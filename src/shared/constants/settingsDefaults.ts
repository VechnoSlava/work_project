import { TypeSchemaMainSettingsForm } from '@/features/formSettingsMain'

export const mainSettingsDefaultValues: TypeSchemaMainSettingsForm = {
	bandsFilter: {
		key: 1,
		filterLabel: 'Выбор полос приема',
		templateType: 'table',
		units: {
			'0': '0 дБ',
			'10': '10 дБ',
			'20': '20 дБ',
			'30': '30 дБ',
		},
		bands: [
			{ id: 0, band: '1-2', checked: true, time: '0', attenuator: '0' },
			{ id: 1, band: '2-2.5', checked: true, time: '0', attenuator: '0' },
			{ id: 2, band: '2.5-3', checked: true, time: '0', attenuator: '0' },
			{ id: 3, band: '3-3.5', checked: true, time: '0', attenuator: '0' },
			{ id: 4, band: '3.5-4', checked: true, time: '0', attenuator: '0' },
			{ id: 5, band: '4-5', checked: true, time: '0', attenuator: '0' },
			{ id: 6, band: '5-6', checked: true, time: '0', attenuator: '0' },
			{ id: 7, band: '6-7', checked: true, time: '0', attenuator: '0' },
			{ id: 8, band: '7-8', checked: true, time: '0', attenuator: '0' },
			{ id: 9, band: '9-10', checked: true, time: '0', attenuator: '0' },
			{ id: 10, band: '10-11', checked: true, time: '0', attenuator: '0' },
			{ id: 11, band: '11-12', checked: true, time: '0', attenuator: '0' },
		],
	},
	vsk: {
		key: 2,
		filterLabel: 'Включение тестового сигнала',
		templateType: 'generator',
		bands: [
			{
				freq: '12',
				checked: false,
			},
		],
	},
	importer: {
		key: 3,
		filterLabel: 'Импорт сигнатур',
		templateType: 'importer',
	},
}
