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
	color?: string
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
	radar: string
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
	radar: string
	data: Array<ITadRadarList>
}

export interface ISelectedRadarUid {
	uid: string
}
export interface ISelectedColorsRadar {
	colors: string
}
export interface ISelectedTadId {
	id: number | null
}
//--------------Входящие сообщения----------------------------------------
export interface IWebSocket {
	/**Спектральная панорама */
	spectrumPanorama: {
		id: number
		points: Array<ISpectrumPanorama>
		psd: number[]
	}
	/**Таблица целей */
	radarsList: {
		id: number
		frame: number
		url: string
		radars: Array<IRadarsList>
	}
	/**Таблица и график импульсов цели */
	radarTads: {
		id: number
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
	data: ISelectedRadarUid[]
}

export interface ISelectedPulse extends WebSocketMessageBase {
	data: {
		id: ISelectedTadId
		radar: ISelectedRadarUid
	}
}

export type WebSocketMessage = ISelectedRadars | ISelectedPulse
