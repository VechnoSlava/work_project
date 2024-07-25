import { type FC } from 'react'
import { MainMap } from '../../../widgets/mainMap'
import { CommonTargetsTable } from '../../../widgets/commonTargetsTable'
import { SpectrumTargetChart } from '../../../widgets/spectrumTargetChart'
import styles from './mainPage.module.css'
import { useAppSelector } from '../../../app/store/hooks'
import { selectModeSecondWindow } from '../../../widgets/header/model/controlModesSlice'

export const MainPage: FC = () => {
	console.log('render main page')
	const secondWindowOpened = useAppSelector(selectModeSecondWindow)

	return (
		<div className={styles.container}>
			<h1>MainPage</h1>
			<MainMap />
			<CommonTargetsTable />
			{!secondWindowOpened && <SpectrumTargetChart />}
		</div>
	)
}
