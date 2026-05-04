import * as z from 'zod/v4'

export const schemaCreateRadarCardForm = z.object({
	id: z.number(),
	uid: z.string(),
	pulse_length: z.number(),
	rot_period: z.number(),
	freq: z.number(),
	PRI: z.number(),
	comment: z.string(),
})

export type TypeSchemaCreateRadarCardForm = z.infer<typeof schemaCreateRadarCardForm>
