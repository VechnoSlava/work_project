import { useAppSelector } from '../../../app/store/hooks'
import { selectSecondWindow } from '../../../features/controlModesPanel/model/controlModesSlice'
import { SpectrumTargetChart } from '../../../widgets/spectrumTargetChart'

export const SlaveMainPage = () => {
	console.log('slaveMainPage')
	const secondWindowOpened = useAppSelector(selectSecondWindow)

	return (
		<div>
			<h1>SlaveMainPage</h1>
			{secondWindowOpened && <SpectrumTargetChart />}
		</div>
	)
}
