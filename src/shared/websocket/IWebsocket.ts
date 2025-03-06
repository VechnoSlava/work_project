/**
 * Данные для графика спектральной панорамы
 */
export interface ISpectrumPanorama {
	x: number
	y: number
}
/**
 * Параметры РЛС для таблицы целей
 */
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
/**
 * Данные для графика импульсов РЛС
 */
export interface IBarChartPulses {
	x: number
	y: number
}
/** График импульсов РЛС */
export interface ITadChartRadar {
	radarUid: string
	data: Array<IBarChartPulses>
}
/** Параметры импульса РЛС для таблицы */
export interface ITadRadarList {
	radar: string
	id: number
	drill_id: number
	freq: number
	pulse_length: number
	pulse_amplitude: number
}

/** Таблица импульсов РЛС */
export interface IRadarsTadsTable {
	radarUid: string
	data: Array<ITadRadarList>
}

export interface ISelectedRowId {
	uid: string
}
//--------------Входящие сообщения----------------------------------------
export interface IWebSocket {
	/**Спектральная панорама */
	spectrumPanorama: {
		id: 0
		points: Array<ISpectrumPanorama>
		psd: number[]
	}
	/**Таблица целей */
	radarsList: {
		id: 1
		radars: Array<IRadarsList>
	}
	/**Таблица и график импульсов цели */
	radarTads: {
		id: 2
		frame: number
		Tads: {
			tadChart: Array<ITadChartRadar>
			tadTable: Array<IRadarsTadsTable>
		}
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
	pulse: string
}

export type WebSocketMessage = ISelectedRadars | ISelectedPulse
