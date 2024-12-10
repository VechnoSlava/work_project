import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { InputFilterForm } from '../../../shared/inputs/inputFilterForm'

export const FormTest = () => {
	const { register, control, handleSubmit, reset, trigger, setError } = useForm({
		// defaultValues: {}; you can populate the fields by this attribute
	})
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'frequency',
	})
	console.log('render form')

	return (
		<form onSubmit={handleSubmit(data => console.log(data))}>
			<ul>
				{fields.map((item, index) => (
					<li key={item.id}>
						<Controller
							name={`frequency.${index}.minFrequency`}
							control={control}
							render={({ field }) => (
								<InputFilterForm size="small" label="конец" {...field} placeholder="asd" />
							)}
						/>
						<input {...register(`test.${index}.firstName`)} placeholder="asd" />
						<Controller
							render={({ field }) => <input {...field} />}
							name={`test.${index}.lastName`}
							control={control}
						/>
						<button type="button" onClick={() => remove(index)}>
							Delete
						</button>
					</li>
				))}
			</ul>
			<button type="button" onClick={() => append({ firstName: '', lastName: '' })}>
				append
			</button>
			<input type="submit" />
		</form>
	)
}
