import styles from './mainPage.module.css'
import { useAppSelector } from '../../../app/store/hooks'
import { selectModeSecondWindow } from '../../../widgets/header/model/controlModesSlice'
import { CommonTargetsTable } from '../../../widgets/commonTargetsTable'
import { SpectrumTargetChart } from '../../../widgets/spectrumTargetChart'
import { SplitFrame } from '../../../entities/splitFrame'
import { MainMap } from '../../../widgets/mainMap'
import { useEffect, useState } from 'react'

export const MainPage = () => {
	const secondWindowOpened = useAppSelector(selectModeSecondWindow)
	const [key, setKey] = useState(100)

	useEffect(() => {
		secondWindowOpened ? setKey(101) : setKey(100)
	}, [secondWindowOpened])

	return (
		<div className={styles.container}>
			<SplitFrame frameDirection="horizontal" key={key}>
				{secondWindowOpened && <MainMap />}
				{secondWindowOpened && <SpectrumTargetChart />}
				<CommonTargetsTable />
			</SplitFrame>
		</div>
	)
}
