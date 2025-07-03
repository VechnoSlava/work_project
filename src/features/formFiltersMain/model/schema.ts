import * as z from 'zod/v4'

export const schemaFiltersMain = z.object({
	minFrequency: z.number().min(1, { message: 'Обязательно к заполнению' }),
})
