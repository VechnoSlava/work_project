import type { FC } from 'react'
import { useAppSelector } from '../../../app/store/hooks'
import { selectData } from '../../../shared/webSocket/serverConnectionSlice'
import styles from './spectrumTargetChart.module.css'

export const SpectrumTargetChart: FC = () => {
	const data = useAppSelector(selectData)
	// Преобразуем объект данных в массив пар [ключ, значение] вручную
	const entries = data ? Object.keys(data).map(key => [key, data[key]]) : []

	console.log(data)
	return (
		<div className={styles.chartContainer}>
			<p>SpectrumTargetChart</p>

			<ul className={styles.chartList}>
				{entries.map(([key, value]) => (
					<li key={key} className={styles.chartItem}>
						<strong>{key}:</strong> {value}
					</li>
				))}
			</ul>
		</div>
	)
}
