import * as z from 'zod/v4'

// Схема для одного диапазона частот
const bandSchema = z.object({
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

const freqFilterSchema = z.object({
	key: z.number(),
	filterLabel: z.string(),
	templateType: z.string(),
	units: z.record(z.string(), z.string()),
	bands: z.array(bandSchema),
})
export const schemaFiltersHistory = z.object({
	freqFilter: freqFilterSchema,
})

export type TypeSchemaFiltersHistory = z.infer<typeof schemaFiltersHistory>
