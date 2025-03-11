import styles from './buttonTestMessage.module.css'
import { TbMessage } from 'react-icons/tb'
import { useAppDispatch } from '../../../app/store/hooks'
import { ButtonMenuHead } from '../../../shared/buttons'
import { updateRadarsList, updateTads } from '../../../shared/webSocket/serverConnectionSlice'
import { spectrumPanoramaChart } from '../../../widgets/spectrumPanorama'
import dataPanorama from '../../../shared/dataTest/messageId_0.json'
import dataRadarsTable from '../../../shared/dataTest/messageId_1.json'
import dataPulses from '../../../shared/dataTest/messageId_2.json'

export const ButtonTestMessage = () => {
	const dispatch = useAppDispatch()

	const handleTestMessage = () => {
		spectrumPanoramaChart.updateData(dataPanorama)
		dispatch(updateRadarsList(dataRadarsTable))
		dispatch(updateTads(dataPulses))
	}

	return (
		<>
			<div className={styles.buttonContainer}>
				<ButtonMenuHead value="check" title="Тестовое сообщение" onClick={handleTestMessage}>
					<TbMessage size="100%" />
				</ButtonMenuHead>
			</div>
		</>
	)
}
