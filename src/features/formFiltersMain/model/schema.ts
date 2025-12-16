import * as z from 'zod/v4'
import dayjs, { Dayjs } from 'dayjs'

// Схема для одного диапазона частот
const bandSchema = z
	.object({
		start: z
			.string()
			.min(1, 'Обязательное поле')
			.regex(/^(?:(?:0|[1-9]\d*)(?:\.\d+)?|0\.\d*[1-9]\d*)$/, 'Введите положительное число'),
		stop: z
			.string()
			.min(1, 'Обязательное поле')
			.regex(/^(?:(?:0|[1-9]\d*)(?:\.\d+)?|0\.\d*[1-9]\d*)$/, 'Введите положительное число'),
		metricPrefix: z.string().refine(val => !isNaN(Number(val))),
	})
	.refine(data => parseFloat(data.stop) > parseFloat(data.start), {
		message: 'Конец диапазона должен быть больше начала',
		path: ['stop'],
	})

// Схема для диапазона частот
const freqFilterSchema = z.object({
	key: z.number(),
	filterLabel: z.string(),
	templateType: z.literal('bands'),
	units: z.record(z.string(), z.string()),
	bands: z.array(bandSchema),
})
// Схема для диапазона частот
const pulseDurationFilterSchema = z.object({
	key: z.number(),
	filterLabel: z.string(),
	templateType: z.literal('bands'),
	units: z.record(z.string(), z.string()),
	bands: z.array(bandSchema),
})
// Схема для диапазона частот
const pulsePeriodFilterSchema = z.object({
	key: z.number(),
	filterLabel: z.string(),
	templateType: z.literal('bands'),
	units: z.record(z.string(), z.string()),
	bands: z.array(bandSchema),
})

// Схема для календарного фильтра
const calendarFilterSchema = z
	.object({
		key: z.number(),
		filterLabel: z.string(),
		templateType: z.literal('calendar'),
		bands: z
			.array(
				z
					.string()
					.nullable()
					.refine(val => val === null || dayjs(val).isValid(), {
						message: 'Некорректный формат даты',
					}),
			)
			.length(2, 'Должно быть 2 значения даты (начало и конец)'),
	})
	.refine(
		data => {
			// Валидация: дата окончания должна быть позже даты начала (если обе выбраны)
			if (data.bands[0] && data.bands[1]) {
				return dayjs(data.bands[1]).isAfter(dayjs(data.bands[0]))
			}
			return true
		},
		{
			message: 'Дата окончания должна быть позже даты начала',
			path: ['bands', 1],
		},
	)

const selectorFilterSchema = z.object({
	key: z.number(),
	filterLabel: z.string(),
	templateType: z.literal('selector'), // Фиксируем значение
	units: z.record(z.string(), z.string()),
	value: z.string().min(1, 'Выберите тип цели'), // Обязательное поле
})

// Схема валидации
export const schemaMainFiltersForm = z.object({
	freqFilter: freqFilterSchema,
	pulseDurationFilter: pulseDurationFilterSchema,
	pulsePeriodFilter: pulsePeriodFilterSchema,
	calendarFilter: calendarFilterSchema,
	selectorFilter: selectorFilterSchema,
})

// Приведение типов схемы
export type TypeSchemaMainFiltersForm = z.infer<typeof schemaMainFiltersForm>
