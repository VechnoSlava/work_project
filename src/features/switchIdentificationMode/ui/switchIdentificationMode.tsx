import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import { ToggleSwitch } from '../../../entities/toggleSwitch'
import {
	selectModeIdentification,
	toggleIdentificationMode,
} from '../../../widgets/header/model/controlModesSlice'

export const SwitchIdentificationMode = () => {
	const dispatch = useAppDispatch()
	const isIdentificationMode = useAppSelector(selectModeIdentification)

	const handleIdentificationMode = () => {
		dispatch(toggleIdentificationMode())
	}

	return (
		<ToggleSwitch
			nameSwitch="Режим идентификации"
			checked={isIdentificationMode}
			onChange={handleIdentificationMode}
			inputProps={{ 'aria-label': 'Режим идентификации' }}
		/>
	)
}
