import styles from './historyPage.module.css'
import { SplitFrame } from '@/entities/splitFrame'
import { useAppSelector } from '@/app/store/hooks'
import { selectModeSecondWindow } from '@/widgets/header/model/controlModesSlice'
import { RadarsTable } from '@/widgets/radarsTable'
import { HistoryMap } from '@/widgets/historyMap'
import { RadarPulsesChart } from '@/widgets/radarPulsesBarChart'
import { PulsesGridTable } from '@/widgets/pulsesGridTable'
import { InfoChartRadarPulse } from '@/widgets/infoChartRadarPulse'
import { SpectrumPanorama } from '@/widgets/spectrumPanorama'

export const HistoryPage = () => {
	console.log('RENDER HISTORY_PAGE')

	const secondWindowOpened = useAppSelector(selectModeSecondWindow)

	return (
		<div className={styles.container}>
			<SplitFrame frameDirection="vertical" key={secondWindowOpened ? 1 : 0}>
				<SplitFrame frameDirection="horizontal">
					{secondWindowOpened ? null : <HistoryMap />}
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
