import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import { AppDispatch, RootState, store } from '../../app/store/store'

const channel = new BroadcastChannel('redux_state')

export const broadcastMiddleware: Middleware<{}, RootState> =
	(store: MiddlewareAPI<AppDispatch, RootState>) => next => action => {
		const result = next(action)
		channel.postMessage(store.getState())
		return result
	}

channel.onmessage = event => {
	store.dispatch({
		type: 'BROADCAST_SYNC',
		payload: event.data,
	})
}
