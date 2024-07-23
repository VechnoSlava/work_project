import { type FC } from 'react'
import { MainMap } from '../../../widgets/mainMap'
import { CommonTargetsTable } from '../../../widgets/commonTargetsTable'
import { SpectrumTargetChart } from '../../../widgets/spectrumTargetChart'
import styles from './mainPage.module.css'
import { selectData } from '../../../shared/webSocket/serverConnectionSlice'
import { useAppSelector } from '../../../app/store/hooks'

export const MainPage: FC = () => {
	console.log('render main page')
	const data = useAppSelector(selectData)
	console.log(data)

	return (
		<div className={styles.container}>
			<h1>MainPage</h1>
			<MainMap />
			<CommonTargetsTable />
			<SpectrumTargetChart />
		</div>
	)
}
