import styles from './mainPage.module.css'
import { useAppSelector } from '../../../app/store/hooks'
import { selectModeSecondWindow } from '../../../widgets/header/model/controlModesSlice'
import { CommonTargetsTable } from '../../../widgets/commonTargetsTable'
import { SpectrumTargetChart } from '../../../widgets/spectrumTargetChart'
import { SplitFrame } from '../../../entities/splitFrame'
import { MainMap } from '../../../widgets/mainMap'
import { useState, useEffect } from 'react'
import { Spectrogram } from '../../../widgets/spectrogram'

export const MainPage = () => {
	console.log('render MainPage')

	const secondWindowOpened = useAppSelector(selectModeSecondWindow)
	const [key, setKey] = useState(100)

	useEffect(() => {
		secondWindowOpened ? setKey(101) : setKey(100)
	}, [secondWindowOpened])

	return (
		<div className={styles.container}>
			<SplitFrame frameDirection="vertical" key={key}>
				<SplitFrame frameDirection="horizontal" key={102}>
					{secondWindowOpened ? null : <MainMap key={1} />}
					<Spectrogram key={2} />
					<CommonTargetsTable key={3} />
				</SplitFrame>
				<SplitFrame frameDirection="horizontal" key={103}>
					<SplitFrame frameDirection="vertical" key={104}>
						<SpectrumTargetChart key={4} />
						<CommonTargetsTable key={5} />
					</SplitFrame>
					{secondWindowOpened ? null : <CommonTargetsTable key={6} />}
				</SplitFrame>
			</SplitFrame>
		</div>
	)
}
