import * as z from 'zod/v4'

export const schemaTechAuthForm = z.object({
	login: z.string().min(1, 'Введите логин'),
	password: z.string().min(1, 'Введите пароль'),
})

export type TypeSchemaTechAuthForm = z.infer<typeof schemaTechAuthForm>
