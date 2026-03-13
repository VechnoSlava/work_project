import { useEffect } from 'react'
import { radarPulsesBarChart } from './radarPulsesBarChart'
import styles from './radarPulsesChart.module.css'
import { selectTadsChart, selectTadsTable } from '../../../shared/webSocket/serverConnectionSlice'
import { useAppSelector } from '../../../app/store/hooks'
import { selectSelectedPulse } from '../../pulsesGridTable/model/radarPulsesSlice'
import { selectSelectedRadars } from '../../radarsTable'

export function RadarPulsesChart() {
	const dataTadsChart = useAppSelector(selectTadsChart)
	const dataSelectedPulse = useAppSelector(selectSelectedPulse)
	const selectedRadars = useAppSelector(selectSelectedRadars)

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
	}, [dataTadsChart, selectedRadars])

	useEffect(() => {
		if (dataSelectedPulse) radarPulsesBarChart.selectPulseFromTable(dataSelectedPulse)
		// console.log('PULSE!!!')
		return
	}, [dataSelectedPulse])

	return <div className={styles.pulsesChart} id={'radarPulsesBarChart'}></div>
}
