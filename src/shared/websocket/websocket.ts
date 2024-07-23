import type { Middleware } from '@reduxjs/toolkit'
import {
	connectToServerRequest,
	connectToServerSuccess,
	connectToServerFailure,
	disconnectToServer,
	setMessage,
} from './serverConnectionSlice'

const socket_URL = 'wss://ws.coincap.io/prices?assets=bitcoin,ethereum'

export const webSocketMiddleware: Middleware = store => {
	let socket: WebSocket | null = null

	return next => action => {
		const { dispatch } = store

		if (connectToServerRequest.match(action)) {
			socket = new WebSocket(socket_URL)
			console.log('Подключение...')

			socket.onopen = () => {
				console.log('Соединение открыто!')
				dispatch(connectToServerSuccess())
			}

			socket.onerror = () => {
				dispatch(connectToServerFailure('Ошибка подключения!'))
			}

			socket.onclose = () => {
				console.log('Соединение закрыто!')
				dispatch(disconnectToServer())
			}

			socket.onmessage = event => {
				const message = JSON.parse(event.data)
				dispatch(setMessage(message))
			}
		} else if (disconnectToServer.match(action)) {
			if (socket) {
				socket.close()
				socket = null
			}
		}

		return next(action)
	}
}
