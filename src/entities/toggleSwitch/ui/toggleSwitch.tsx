import { CustomSwitch } from '../../../shared/buttons'
import styles from './toggleSwitch.module.css'

interface IToggleSwitch {
	id?: string
	disabled?: boolean
	checked: boolean
	onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
	nameSwitch?: string
	slotProps?: { input?: React.InputHTMLAttributes<HTMLInputElement> }
}

export const ToggleSwitch = ({
	id,
	disabled = false,
	checked,
	onChange,
	nameSwitch = '',
	slotProps,
}: IToggleSwitch) => {
	return (
		<div className={styles.switch}>
			<div className={styles.switch__label}>{nameSwitch}</div>
			<div className={styles.switch__component}>
				<CustomSwitch
					disabled={disabled}
					id={id}
					checked={checked}
					onChange={event => onChange(event, event.target.checked)}
					slotProps={slotProps}
				/>
			</div>
		</div>
	)
}
