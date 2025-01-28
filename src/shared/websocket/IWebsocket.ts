export interface ISpectrumPanorama {
	x: number
	y: number
}

export interface IRadarsList {
	id: number
	uid: string
	inner_id: number
	pulse_length: number
	rot_period: number
	freq: number
	PRI: number
	comment: string
	bearing: {
		id: number
		bearing: number
		origin: number[]
	}
	path: unknown
	detection_time: string
	identification_data: string
	id_signature: number
}

export interface IRadarsTadsTable {
	id: number
	uid: string
	inner_id: number
	pulse_length: number
	rot_period: number
	freq: number
	PRI: number
	comment: string
	bearing: {
		id: number
		bearing: number
		origin: number[]
	}
	path: unknown
	detection_time: string
	identification_data: string
	id_signature: number
}

export interface ISelectedRowId {
	uid: string
}
//--------------Входящие сообщения----------------------------------------
export interface IWebSocket {
	spectrumPanorama: {
		id: 0
		points: Array<ISpectrumPanorama>
		psd: number[]
	}

	radarsList: {
		id: 1
		radars: Array<IRadarsList>
	}

	radarTads: {
		id: 2
	}
}
//--------------Исходящие сообщения----------------------------------------
interface WebSocketMessageBase {
	id: number
}

export interface ISelectedRadars extends WebSocketMessageBase {
	data: ISelectedRowId[]
}

export interface ISelectedPulse extends WebSocketMessageBase {
	radar: string
}

export type WebSocketMessage = ISelectedRadars | ISelectedPulse
