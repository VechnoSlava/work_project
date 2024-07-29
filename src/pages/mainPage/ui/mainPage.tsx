import styles from './mainPage.module.css'
import { useAppSelector } from '../../../app/store/hooks'
import { selectModeSecondWindow } from '../../../widgets/header/model/controlModesSlice'
import { CommonTargetsTable } from '../../../widgets/commonTargetsTable'
import { SpectrumTargetChart } from '../../../widgets/spectrumTargetChart'
import { SplitFrame } from '../../../entities/splitFrame'
import { MainMap } from '../../../widgets/mainMap'
import { useState, useEffect } from 'react'

export const MainPage = () => {
	const secondWindowOpened = useAppSelector(selectModeSecondWindow)
	const [key, setKey] = useState(0)
	console.log(key)

	useEffect(() => {
		secondWindowOpened ? setKey(100) : setKey(101)
	}, [secondWindowOpened])

	return (
		<div className={styles.container}>
			<SplitFrame frameDirection="vertical" key={key}>
				<SplitFrame frameDirection="horizontal" key={102}>
					{!secondWindowOpened && <MainMap key={1} />}
					<SpectrumTargetChart key={2} />
					<CommonTargetsTable key={3} />
				</SplitFrame>
				<SplitFrame frameDirection="horizontal" key={103}>
					<SplitFrame frameDirection="vertical" key={104}>
						<SpectrumTargetChart key={4} />
						<CommonTargetsTable key={5} />
					</SplitFrame>
					<CommonTargetsTable key={6} />
				</SplitFrame>
			</SplitFrame>
		</div>
	)
}
