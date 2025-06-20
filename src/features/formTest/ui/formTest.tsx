import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { InputFilterForm } from '../../../shared/inputs/inputFilterForm'
import { SelectFrequency } from '../../../entities/selectFrequency'
import { Button } from '@mui/material'
import { RiCloseLargeFill } from 'react-icons/ri'
import styles from './formTest.module.css'
import { ButtonDeleteFilter } from '../../../shared/buttons'

export const FormTest = () => {
	const { control, handleSubmit } = useForm({
		// defaultValues: {}; you can populate the fields by this attribute
	})
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'frequency',
	})
	console.log('renderTestForm')

	return (
		<form onSubmit={handleSubmit(data => console.log(data))}>
			<ul>
				{fields.map((item, index) => (
					<li key={item.id} className={styles.item_li}>
						<Controller
							name={`frequency.${index}.start`}
							control={control}
							render={({ field }) => (
								<InputFilterForm
									size="small"
									label="Начало"
									{...field}
									placeholder="start"
									sx={{
										marginRight: '10px',
									}}
								/>
							)}
						/>
						<Controller
							name={`frequency.${index}.stop`}
							control={control}
							render={({ field }) => (
								<InputFilterForm
									size="small"
									label="Начало"
									{...field}
									placeholder="stop"
									sx={{
										marginRight: '10px',
									}}
								/>
							)}
						/>
						<Controller
							name={`frequency.${index}.metric`}
							control={control}
							defaultValue={'1000'}
							render={({ field }) => (
								<SelectFrequency {...field} sx={{ minWidth: '80px', marginRight: '10px' }} />
							)}
						/>
						<ButtonDeleteFilter onClick={() => remove(index)} sx={{ borderRadius: 1 }}>
							<RiCloseLargeFill />
						</ButtonDeleteFilter>
					</li>
				))}
			</ul>
			<button type="button" onClick={() => append({ start: '3', stop: '3' })}>
				append
			</button>
			<input type="submit" />
		</form>
	)
}
