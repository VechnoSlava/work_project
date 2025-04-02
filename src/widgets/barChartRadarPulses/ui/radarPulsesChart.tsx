import { useEffect } from 'react'
import { radarPulsesBarChart } from './radarPulsesBarChart'
import styles from './radarPulsesChart.module.css'
import { useSelector } from 'react-redux'
import { selectTadsChart, selectTadsTable } from '../../../shared/webSocket/serverConnectionSlice'

export function RadarPulsesChart() {
	const dataTadsChart = useSelector(selectTadsChart)

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

	useEffect(() => {
		radarPulsesBarChart.updateSegmentSeries()
	}, [dataTadsChart])

	return <div className={styles.pulsesChart} id={'radarPulsesBarChart'}></div>
}
