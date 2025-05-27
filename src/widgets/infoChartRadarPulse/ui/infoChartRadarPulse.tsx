import { useEffect } from 'react'
import styles from './infoChartRadarPulse.module.css'
import { infoPulseChart } from './infoPulseChart'

export function InfoChartRadarPulse() {
	useEffect(() => {
		const container = document.getElementById('infoChartPulse') as HTMLDivElement | null
		if (container) {
			infoPulseChart.createInfoPulseChart(
				'infoChartPulse_timeChart',
				'infoChartPulse_spectrumChart',
				'infoChartPulse_intervalChart',
			)
		} else {
			console.error('Container not found')
		}
		return () => infoPulseChart.deleteInfoPulseChart()
	}, [])

	return (
		<div className={styles.infoChartPulse} id={'infoChartPulse'}>
			<div className={styles.infoChartPulse__timeChart} id={'infoChartPulse_timeChart'} />
			<div className={styles.infoChartPulse__spectrumChart} id={'infoChartPulse_spectrumChart'} />
			<div className={styles.infoChartPulse__intervalChart} id={'infoChartPulse_intervalChart'} />
		</div>
	)
}
