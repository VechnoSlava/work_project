import { type PayloadAction } from '@reduxjs/toolkit/react'
import { createAppSlice } from '../../app/store/createAppSlice'
import { IRadarsList, IWebSocket, WebSocketMessage } from './IWebSocket'
import { generateDistinctColor } from '../utils/utils'

export interface IConnectionState {
	isConnection: boolean
	stateConnection: 'idle' | 'connecting' | 'success' | 'failed'
	errorMessage: string | null
	sendMessage: any
	radars: IWebSocket['radarsList']['radars'] | []
	tads: IWebSocket['radarTads']['Tads']
}

const initialState: IConnectionState = {
	isConnection: false,
	stateConnection: 'idle',
	errorMessage: null,
	sendMessage: null,
	radars: [],
	tads: {
		tadChart: [],
		tadTable: [],
	},
}

export const serverConnectionSlice = createAppSlice({
	name: 'serverConnection',
	initialState,
	reducers: create => ({
		connectToServerRequest: create.reducer(state => {
			state.stateConnection = 'connecting'
			state.errorMessage = null
		}),
		connectToServerSuccess: create.reducer(state => {
			state.isConnection = true
			state.stateConnection = 'success'
			state.errorMessage = null
		}),
		connectToServerFailure: create.reducer((state, action: PayloadAction<string>) => {
			state.isConnection = false
			state.stateConnection = 'failed'
			state.errorMessage = action.payload
		}),
		disconnectToServer: create.reducer(state => {
			state.isConnection = false
			state.stateConnection = 'idle'
		}),
		sendMessage: create.reducer((state, action: PayloadAction<WebSocketMessage>) => {
			state.sendMessage = action.payload
		}),
		updateRadarsList: create.reducer((state, action: PayloadAction<IWebSocket['radarsList']>) => {
			const payloadRadars = action.payload.radars ?? []
			const currentRadars = state.radars ?? []
			const existingRadarsMap = new Map(currentRadars.map(radar => [radar.id, radar]))

			state.radars = payloadRadars.map(newRadar => {
				const existingRadar = existingRadarsMap.get(newRadar.id)

				return existingRadar?.color
					? { ...newRadar, color: existingRadar.color }
					: {
							...newRadar,
							color: generateDistinctColor(newRadar.id),
						}
			})
		}),
		updateTads: create.reducer((state, action: PayloadAction<IWebSocket['radarTads']>) => {
			state.tads = action.payload.Tads
		}),
	}),
	selectors: {
		selectIsConnection: state => state.isConnection,
		selectStateConnection: state => state.stateConnection,
		selectErrorMessageConnection: state => state.errorMessage,
		selectRadarsList: state => state.radars,
		selectTadsChart: state => state.tads.tadChart,
		selectTadsTable: state => state.tads.tadTable,
	},
})

export const {
	connectToServerRequest,
	connectToServerSuccess,
	connectToServerFailure,
	disconnectToServer,
	sendMessage,
	updateRadarsList,
	updateTads,
} = serverConnectionSlice.actions
export const {
	selectIsConnection,
	selectStateConnection,
	selectErrorMessageConnection,
	selectRadarsList,
	selectTadsChart,
	selectTadsTable,
} = serverConnectionSlice.selectors
