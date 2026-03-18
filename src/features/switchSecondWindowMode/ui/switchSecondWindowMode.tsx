import { ToggleSwitch } from '../../../entities/toggleSwitch'
import { useSecondWindow } from '../model/useSecondWindow'

export const SwitchSecondWindowMode = () => {
	const { isSecondaryWindowOpen, toggle } = useSecondWindow()

	return (
		<ToggleSwitch
			nameSwitch="2-х оконный режим"
			checked={isSecondaryWindowOpen}
			onChange={toggle}
			inputProps={{ 'aria-label': '2-х оконный режим' }}
		/>
	)
}
