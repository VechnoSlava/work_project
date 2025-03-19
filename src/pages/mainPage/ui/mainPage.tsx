import styles from './mainPage.module.css'
import { useAppSelector } from '../../../app/store/hooks'
import { selectModeSecondWindow } from '../../../widgets/header/model/controlModesSlice'
import { CurrentTargetsTable } from '../../../widgets/currentTargetsTable'
import { SplitFrame } from '../../../entities/splitFrame'
import { MainMap } from '../../../widgets/mainMap'
import { useState, useEffect } from 'react'
import { RadarsTable } from '../../../widgets/radarsTable'
import { SpectrumPanorama } from '../../../widgets/spectrumPanorama'
import { RadarPulsesChart } from '../../../widgets/barChartRadarPulses'
import { RadarPulsesChartTest } from '../../../widgets/barChartRadarPulsesTest'
import { PulsesTable } from '../../../widgets/pulsesTable'
import { RadarPulsesChartNew } from '../../../widgets/barChartRadarPulsesТNew'

export const MainPage = () => {
	console.log('RENDER MAIN_PAGE')

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
					<RadarsTable key={2} />
					<SpectrumPanorama key={3} />
				</SplitFrame>
				<SplitFrame frameDirection="horizontal" key={103}>
					<RadarPulsesChartNew key={5} />

					{/* <RadarPulsesChart key={5} /> */}
					{/* {secondWindowOpened ? null : <CurrentTargetsTable key={6} />} */}
					<PulsesTable key={7} />
				</SplitFrame>
			</SplitFrame>
		</div>
	)
}
