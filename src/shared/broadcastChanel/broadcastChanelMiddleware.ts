import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import { AppDispatch, RootState, store } from '../../app/store/store'

const broadcastChannel = new BroadcastChannel('redux_state')
let isUpdatingFromBroadcast = false

export const broadcastMiddleware: Middleware<{}, RootState> =
	(store: MiddlewareAPI<AppDispatch, RootState>) => next => action => {
		// Не отправляем сообщение, если оно пришло из другого окна
		if (isUpdatingFromBroadcast) {
			return next(action)
		}

		const result = next(action)

		// Отправляем изменения в другое окно через BroadcastChannel
		const state: RootState = store.getState()
		broadcastChannel.postMessage({
			type: 'SYNC_STATE',
			payload: state,
		})

		return result
	}

// Обработка сообщений из другого окна
broadcastChannel.onmessage = event => {
	if (event.data.type === 'SYNC_STATE') {
		// Устанавливаем флаг, чтобы предотвратить бесконечные циклы
		isUpdatingFromBroadcast = true

		// Диспатчим действие для обновления состояния из другого окна
		store.dispatch({
			type: 'HYDRATE_STATE',
			payload: event.data.payload,
		})

		isUpdatingFromBroadcast = false
	}
}
