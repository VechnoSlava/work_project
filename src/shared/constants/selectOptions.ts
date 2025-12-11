export type Option = {
	value: string
	label: string
}

export const frequencyOptions: Option[] = [
	{
		value: '1',
		label: 'Гц',
	},
	{
		value: '1000',
		label: 'кГц',
	},
	{
		value: '1000000',
		label: 'МГц',
	},
	{
		value: '1000000000',
		label: 'ГГц',
	},
]

export const timeDurationOptions: Option[] = [
	{
		value: '0.001',
		label: 'мс',
	},
	{
		value: '0.000001',
		label: 'мкс',
	},
	{
		value: '0.000000001',
		label: 'нс',
	},
]

export const periodPulseOptions: Option[] = [
	{
		value: '0.001',
		label: 'мс',
	},
	{
		value: '0.000001',
		label: 'мкс',
	},
	{
		value: '0.000000001',
		label: 'нс',
	},
]

export const selectorTypeOptions: Option[] = [
	{
		value: '0',
		label: 'Нет',
	},
	{
		value: '1',
		label: 'Радиоцель',
	},
	{
		value: '2',
		label: 'Эталон',
	},
	{
		value: '3',
		label: 'Импульсная РЛС',
	},
	{
		value: '4',
		label: 'Большебазовая РЛС',
	},
]
