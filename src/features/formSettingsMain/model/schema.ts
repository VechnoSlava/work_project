import * as z from 'zod/v4'

/** Валидация: строка с положительным числом (целым или дробным через точку) */
const positiveNumericString = z
	.string()
	.regex(/^\d+(\.\d+)?$/, 'Введите положительное число')
	.refine(val => parseFloat(val) > 0, 'Значение должно быть больше 0')

// Полоса приёма
const bandItemSchema = z.object({
	id: z.number(),
	band: z.string(), // наименование диапазона, только для отображения
	checked: z.boolean(),
	time: positiveNumericString,
	attenuator: z.string(), // ослабление: "0" | "10" | "20" | "30"
})

// Секция «Выбор полос приёма»
const bandsFilterSchema = z.object({
	key: z.number(),
	filterLabel: z.string(),
	templateType: z.literal('table'),
	units: z.record(z.string(), z.string()),
	bands: z.array(bandItemSchema),
})

// Секция «Включение тестового сигнала»
const vskItemSchema = z.object({
	freq: positiveNumericString,
	checked: z.boolean(),
})

const vskSchema = z.object({
	key: z.number(),
	filterLabel: z.string(),
	templateType: z.literal('generator'),
	bands: z.array(vskItemSchema),
})

// Полная схема формы настроек
export const schemaMainSettingsForm = z.object({
	bandsFilter: bandsFilterSchema,
	vsk: vskSchema,
})

export type TypeSchemaMainSettingsForm = z.infer<typeof schemaMainSettingsForm>
