import styles from './slaveMainPage.module.css'
import { useAppSelector } from '@/app/store/hooks'
import { selectModeIdentification } from '@/widgets/header/model/controlModesSlice'
import { MainMap } from '@/widgets/mainMap'

export const SlaveMainPage = () => {
	console.log('RENDER_SLAVE_MAIN_PAGE')
	const identificationMode = useAppSelector(selectModeIdentification)

	return (
		<div className={styles.container}>
			<div className={styles.body}>
				<MainMap />
			</div>
		</div>
	)
}
