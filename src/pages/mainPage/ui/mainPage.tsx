import styles from './mainPage.module.css'
import { useAppSelector } from '@/app/store/hooks'
import { selectModeSecondWindow } from '@/widgets/header/model/controlModesSlice'
import { SplitFrame } from '@/entities/splitFrame'
import { MainMap } from '@/widgets/mainMap'
import { RadarsTable } from '@/widgets/radarsTable'
import { SpectrumPanorama } from '@/widgets/spectrumPanorama'
import { RadarPulsesChart } from '@/widgets/radarPulsesBarChart'
import { PulsesGridTable } from '@/widgets/pulsesGridTable'
import { InfoChartRadarPulse } from '@/widgets/infoChartRadarPulse'

export const MainPage = () => {
	console.log('RENDER MAIN_PAGE')

	const secondWindowOpened = useAppSelector(selectModeSecondWindow)

	return (
		<div className={styles.container}>
			<SplitFrame frameDirection="vertical" key={secondWindowOpened ? 1 : 0}>
				<SplitFrame frameDirection="horizontal">
					{secondWindowOpened ? null : <MainMap />}
					<RadarsTable />
					<SpectrumPanorama />
				</SplitFrame>
				<SplitFrame frameDirection="horizontal">
					<SplitFrame frameDirection="vertical">
						<RadarPulsesChart />
						<PulsesGridTable />
					</SplitFrame>
					<InfoChartRadarPulse />
				</SplitFrame>
			</SplitFrame>
		</div>
	)
}
