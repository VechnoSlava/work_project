import { useAppSelector } from '../../../app/store/hooks'
import { selectModeSecondWindow } from '../../../widgets/header/model/controlModesSlice'
import { MainMap } from '../../../widgets/mainMap'
import { SpectrumTargetChart } from '../../../widgets/spectrumTargetChart'

export const SlaveMainPage = () => {
	console.log('slaveMainPage')
	const secondWindowOpened = useAppSelector(selectModeSecondWindow)

	return (
		<div>
			<h1>SlaveMainPage</h1>
			<MainMap key={0} />
		</div>
	)
}
