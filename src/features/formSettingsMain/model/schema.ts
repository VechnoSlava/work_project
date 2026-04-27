import * as z from 'zod/v4'

// Полоса приёма
const bandItemSchema = z.object({
	id: z.number(),
	band: z.string(), // наименование диапазона, только для отображения
	checked: z.boolean(),
	time: z.string(), // время задержки (сек)
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
	freq: z.string(),
	checked: z.boolean(),
})

const vskSchema = z.object({
	key: z.number(),
	filterLabel: z.string(),
	templateType: z.literal('generator'),
	bands: z.array(vskItemSchema),
})

// Секция «Импорт сигнатур» — в форме хранится только имя файла
const importerSchema = z.object({
	key: z.number(),
	filterLabel: z.string(),
	templateType: z.literal('importer'),
})

// Полная схема формы настроек
export const schemaMainSettingsForm = z.object({
	bandsFilter: bandsFilterSchema,
	vsk: vskSchema,
	importer: importerSchema,
})

export type TypeSchemaMainSettingsForm = z.infer<typeof schemaMainSettingsForm>
