import * as z from 'zod/v4'

// Схема валидации
export const schemaMainSettingsForm = z.object({})

// Приведение типов схемы
export type TypeSchemaMainSettingsForm = z.infer<typeof schemaMainSettingsForm>
