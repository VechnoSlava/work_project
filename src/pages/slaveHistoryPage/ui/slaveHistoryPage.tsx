import styles from './slaveHistoryPage.module.css'
import { useAppSelector } from '@/app/store/hooks'
import { selectModeIdentification } from '@/widgets/header/model/controlModesSlice'
import { HistoryMap } from '@/widgets/historyMap'

export const SlaveHistoryPage = () => {
	console.log('RENDER_SLAVE_HISTORY_PAGE')
	const identificationMode = useAppSelector(selectModeIdentification)

	return (
		<div className={styles.container}>
			<div className={styles.body}>
				<HistoryMap />
			</div>
		</div>
	)
}
