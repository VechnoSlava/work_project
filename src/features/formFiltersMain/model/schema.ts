import * as z from 'zod/v4'

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
	templateType: z.string(),
	units: z.record(z.string(), z.string()),
	bands: z.array(bandSchema),
})
// Схема для диапазона частот
const pulseDurationFilterSchema = z.object({
	key: z.number(),
	filterLabel: z.string(),
	templateType: z.string(),
	units: z.record(z.string(), z.string()),
	bands: z.array(bandSchema),
})
// Схема для диапазона частот
const pulsePeriodFilterSchema = z.object({
	key: z.number(),
	filterLabel: z.string(),
	templateType: z.string(),
	units: z.record(z.string(), z.string()),
	bands: z.array(bandSchema),
})

const calendarFilterSchema = z.object({
	key: z.number(),
	filterLabel: z.string(),
	templateType: z.string(),
	bands: z.array(z.date()),
})

// Схема валидации
export const schemaMainFiltersForm = z.object({
	freqFilter: freqFilterSchema,
	pulseDurationFilter: pulseDurationFilterSchema,
	pulsePeriodFilter: pulsePeriodFilterSchema,
	calendarFilter: calendarFilterSchema,
})

// Приведение типов схемы
export type TypeSchemaMainFiltersForm = z.infer<typeof schemaMainFiltersForm>
