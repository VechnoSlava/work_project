import { useEffect } from 'react'
import { radarPulsesBarChartNew } from './radarPulsesBarChartNew'
import styles from './radarPulsesChartNew.module.css'
import { useSelector } from 'react-redux'
import { selectTadsChart, selectTadsTable } from '../../../shared/webSocket/serverConnectionSlice'

export function RadarPulsesChartNew() {
	const dataTadsChart = useSelector(selectTadsChart)

	useEffect(() => {
		const container = document.getElementById('radarPulsesBarChartNew') as HTMLDivElement | null
		if (container) {
			radarPulsesBarChartNew.createPulsesBarChart('radarPulsesBarChartNew')
		} else {
			console.error('Container not found')
		}
		return () => {
			radarPulsesBarChartNew.deletePulsesBarChart()
		}
	}, [])

	useEffect(() => {
		radarPulsesBarChartNew.updateSegmentSeries()
	}, [dataTadsChart])

	return <div className={styles.pulsesChart} id={'radarPulsesBarChartNew'}></div>
}
