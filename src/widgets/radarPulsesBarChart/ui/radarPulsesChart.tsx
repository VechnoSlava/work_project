import { useEffect } from 'react'
import { radarPulsesBarChart } from './radarPulsesBarChart'
import styles from './radarPulsesChart.module.css'
import { selectTadsChart, selectTadsTable } from '../../../shared/webSocket/serverConnectionSlice'
import { useAppSelector } from '../../../app/store/hooks'
import { selectSelectedPulse } from '../../pulsesGridTable/model/radarPulsesSlice'

export function RadarPulsesChart() {
	const dataTadsChart = useAppSelector(selectTadsChart)
	const dataSelectedPulse = useAppSelector(selectSelectedPulse)

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

	useEffect(() => {
		radarPulsesBarChart.selectPulseFromTable(dataSelectedPulse)
	}, [dataSelectedPulse])

	return <div className={styles.pulsesChart} id={'radarPulsesBarChart'}></div>
}
