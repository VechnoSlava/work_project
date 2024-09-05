import { type PayloadAction } from '@reduxjs/toolkit/react'
import { createAppSlice } from '../../app/store/createAppSlice'
import { IWebSocket, WebSocketMessage } from './IWebSocket'

export interface IConnectionState {
	isConnection: boolean
	stateConnection: 'idle' | 'connecting' | 'success' | 'failed'
	errorMessage: string | null
	sendMessage: any
	radars: IWebSocket['radarsList']['radars']
	panoramaPoints: IWebSocket['spectrumPanorama']['points']
}

const initialState: IConnectionState = {
	isConnection: false,
	stateConnection: 'idle',
	errorMessage: null,
	sendMessage: null,
	radars: [],
	panoramaPoints: [],
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
			state.radars = action.payload.radars
		}),
		updatePanoramaSpectrum: create.reducer(
			(state, action: PayloadAction<IWebSocket['spectrumPanorama']>) => {
				state.panoramaPoints = action.payload.points
			},
		),
		broadcastSync: create.reducer((state, action: PayloadAction<IConnectionState>) => {
			return { ...state, ...action.payload }
		}),
	}),
	selectors: {
		selectIsConnection: state => state.isConnection,
		selectStateConnection: state => state.stateConnection,
		selectErrorMessageConnection: state => state.errorMessage,
		selectRadarsList: state => state.radars,
		selectPanoramaSpectrumPoints: state => state.panoramaPoints,
	},
})

export const {
	connectToServerRequest,
	connectToServerSuccess,
	connectToServerFailure,
	disconnectToServer,
	sendMessage,
	updateRadarsList,
	updatePanoramaSpectrum,
	broadcastSync,
} = serverConnectionSlice.actions
export const {
	selectIsConnection,
	selectStateConnection,
	selectErrorMessageConnection,
	selectRadarsList,
	selectPanoramaSpectrumPoints,
} = serverConnectionSlice.selectors
