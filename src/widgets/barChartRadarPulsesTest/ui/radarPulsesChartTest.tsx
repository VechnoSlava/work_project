import { useEffect } from 'react'
import styles from './radarPulsesChartTest.module.css'
import { radarPulsesBarChartTest } from './radarPulsesBarChartTest'

export function RadarPulsesChartTest() {
	useEffect(() => {
		const container = document.getElementById('radarPulsesBarChartTest') as HTMLDivElement | null
		if (container) {
			radarPulsesBarChartTest.createPulsesBarChart('radarPulsesBarChartTest')
		} else {
			console.error('Container not found')
		}
		return () => {
			radarPulsesBarChartTest.deletePulsesBarChart()
		}
	}, [])

	return <div className={styles.pulsesChart} id={'radarPulsesBarChartTest'}></div>
}
