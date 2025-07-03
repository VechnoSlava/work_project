import styles from './mainPage.module.css'
import { useAppSelector } from '../../../app/store/hooks'
import { selectModeSecondWindow } from '../../../widgets/header/model/controlModesSlice'
import { SplitFrame } from '../../../entities/splitFrame'
import { MainMap } from '../../../widgets/mainMap'
import { useState, useEffect } from 'react'
import { RadarsTable } from '../../../widgets/radarsTable'
import { SpectrumPanorama } from '../../../widgets/spectrumPanorama'
import { RadarPulsesChart } from '../../../widgets/radarPulsesBarChart'
import { PulsesGridTable } from '../../../widgets/pulsesGridTable'
import { InfoChartRadarPulse } from '../../../widgets/infoChartRadarPulse'
import { FormFiltersMain } from '../../../features/formFiltersMain'
import { FormFiltersHistory } from '../../../features/formFiltersHistory'

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
					{/* {secondWindowOpened ? null : <MainMap key={1} />} */}
					<FormFiltersHistory />

					<RadarsTable key={2} />
					<SpectrumPanorama key={3} />
				</SplitFrame>
				<SplitFrame frameDirection="horizontal" key={103}>
					<SplitFrame frameDirection="vertical" key={104}>
						<RadarPulsesChart key={5} />
						<PulsesGridTable key={6} />
					</SplitFrame>
					<InfoChartRadarPulse key={9} />
				</SplitFrame>
			</SplitFrame>
		</div>
	)
}
