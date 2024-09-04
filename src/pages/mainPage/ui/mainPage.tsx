import styles from './mainPage.module.css'
import { useAppSelector } from '../../../app/store/hooks'
import { selectModeSecondWindow } from '../../../widgets/header/model/controlModesSlice'
import { CurrentTargetsTable } from '../../../widgets/currentTargetsTable'
import { SpectrumTargetChart } from '../../../widgets/spectrumTargetChart'
import { SplitFrame } from '../../../entities/splitFrame'
import { MainMap } from '../../../widgets/mainMap'
import { useState, useEffect } from 'react'
import { Spectrogram } from '../../../widgets/spectrogram'
import { RadarsTable } from '../../../widgets/radarsTable'
import { SpectrumPanorama } from '../../../widgets/SpectrumPanorama'

export const MainPage = () => {
	console.log('render MainPage')

	const secondWindowOpened = useAppSelector(selectModeSecondWindow)
	const [key, setKey] = useState(100)

	useEffect(() => {
		secondWindowOpened ? setKey(101) : setKey(100)
	}, [secondWindowOpened])

	// return (
	// 	<div className={styles.container}>
	// 		<SplitFrame frameDirection="vertical" key={key}>
	// 			<SplitFrame frameDirection="horizontal" key={102}>
	// 				{secondWindowOpened ? null : <MainMap key={1} />}
	// 				<CurrentTargetsTable key={3} />
	// 				<Spectrogram key={2} />
	// 			</SplitFrame>
	// 			<SplitFrame frameDirection="horizontal" key={103}>
	// 				<SplitFrame frameDirection="vertical" key={104}>
	// 					<SpectrumTargetChart key={4} />
	// 					<RadarsTable key={5} />
	// 				</SplitFrame>
	// 				{secondWindowOpened ? null : <SpectrumPanorama key={6} />}
	// 			</SplitFrame>
	// 		</SplitFrame>
	// 	</div>
	// )
	return (
		<SplitFrame frameDirection="horizontal" key={key}>
			<CurrentTargetsTable key={3} />
			<SpectrumPanorama key={4} />
		</SplitFrame>
	)
}
