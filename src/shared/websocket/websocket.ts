import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import {
	connectToServerRequest,
	connectToServerSuccess,
	connectToServerFailure,
	disconnectToServer,
	updateRadarsList,
	updatePanoramaSpectrum,
	sendMessage,
} from './serverConnectionSlice'
import config from '../../../config.json'
import { AppDispatch, RootState } from '../../app/store/store'

const socket_URL = config.serverUrl

export const webSocketMiddleware: Middleware<{}, RootState> = (
	store: MiddlewareAPI<AppDispatch, RootState>,
) => {
	let socket: WebSocket | null = null

	return next => action => {
		const dispatch: AppDispatch = store.dispatch

		if (connectToServerRequest.match(action)) {
			socket = new WebSocket(socket_URL)
			console.log('Connecting to server...')

			socket.onopen = () => {
				console.log('Connection to server is complete!')
				dispatch(connectToServerSuccess())
			}

			socket.onerror = () => {
				console.log('Connection error!')
				dispatch(connectToServerFailure('Fault connection!'))
			}

			socket.onclose = () => {
				console.log('Connection to server is close!')
				dispatch(disconnectToServer())
			}

			socket.onmessage = event => {
				const message: any = JSON.parse(event.data)
				if (message['id'] === 0) {
					// console.log(message.points)
					// dispatch(updatePanoramaSpectrum(message))
				} else if (message['id'] === 1) {
					console.log(message.radars)
					dispatch(updateRadarsList(message))
				} else if (message['id'] === 2) {
					console.log(message)
				}
			}
		}
		// Проверка на запрос отправки сообщения
		else if (sendMessage.match(action)) {
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify(action.payload))
			} else {
				console.log('WebSocket is not open!')
			}
		}

		// Проверка на запрос отключения
		else if (disconnectToServer.match(action)) {
			if (socket) {
				socket.close()
				socket = null
			}
		}

		return next(action)
	}
}
