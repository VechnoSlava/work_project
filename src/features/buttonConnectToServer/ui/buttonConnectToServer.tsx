import styles from './buttonConnectToServer.module.css'
import { BiWifi, BiWifiOff } from 'react-icons/bi'
import { CircularProgress } from '@mui/material'
import { ButtonMenuHead } from '../../../shared/buttons'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import {
	selectIsConnection,
	selectStateConnection,
	disconnectToServer,
	connectToServerRequest,
} from '../../../shared/webSocket/serverConnectionSlice'

export const ButtonConnectToServer = () => {
	console.log('render button')

	const dispatch = useAppDispatch()
	const isConnection = useAppSelector(selectIsConnection)
	const stateConnection = useAppSelector(selectStateConnection)

	const handleToggleConnection = () => {
		if (isConnection) {
			dispatch(disconnectToServer())
		} else {
			dispatch(connectToServerRequest())
		}
	}

	return (
		<>
			<div className={styles.buttonContainer}>
				<ButtonMenuHead
					value="check"
					selected={isConnection}
					title="Подключение к серверу"
					onClick={handleToggleConnection}
					disabled={stateConnection === 'connecting'}
				>
					{stateConnection === 'connecting' ? (
						<CircularProgress size={24} style={{ color: '#04b355ff' }} />
					) : isConnection ? (
						<BiWifi size="100%" style={{ color: '#04b355ff' }} />
					) : (
						<BiWifiOff size="100%" style={{ color: '#fff' }} />
					)}
				</ButtonMenuHead>
			</div>
		</>
	)
}
