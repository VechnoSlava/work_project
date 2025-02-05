import { useEffect } from 'react'
import { radarPulsesBarChart } from './radarPulsesBarChart'
import styles from './radarPulsesChart.module.css'

export function RadarPulsesChart() {
	useEffect(() => {
		const container = document.getElementById('radarPulsesBarChart') as HTMLDivElement | null
		if (container) {
			radarPulsesBarChart.createPulsesBarChart('radarPulsesBarChart')
		} else {
			console.error('Container not found')
		}
		return () => {
			radarPulsesBarChart.deletePulsesBarChart()
		}
	}, [])

	return <div className={styles.pulsesChart} id={'radarPulsesBarChart'}></div>
}
