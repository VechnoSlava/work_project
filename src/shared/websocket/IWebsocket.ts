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

/** Выбранные РЛС в таблице целей */
export interface ISelectedRadars {
	uid: string
	color: string
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
/** Выбранный импульс */
export interface ISelectedTadId {
	id: number | null
	radar: string
}

/**
 * Данные для графиков импульса
 */
export interface IChartInfoPulse {
	x: number
	y: number
}

//------------Фильтры------------------------------------------------
/** Диапазон с числовым metricPrefix (серверный формат) */
export interface IServerBand {
	start: string
	stop: string
	metricPrefix: number
}

/** Фильтр с диапазонами (серверный формат) */
export interface IServerBandsFilter {
	key: number
	filterLabel: string
	templateType: 'bands'
	units: Record<string, string>
	bands: IServerBand[]
}

/** Календарный фильтр (серверный формат) */
export interface IServerCalendarFilter {
	key: number
	filterLabel: string
	templateType: 'calendar'
	bands: (string | null)[]
}

/** Фильтр по типу целей (серверный формат) */
export interface IServerSelectorFilter {
	key: number
	filterLabel: string
	templateType: 'selector'
	units: Record<string, string>
	value: number
}

/** Гео-область (серверный формат) */
export interface IServerGeoArea {
	name: string
	latLng: { lat: number; lng: number }[][]
}

/** Фильтр по географической области (серверный формат) */
export interface IServerGeoFilter {
	key: number
	filterLabel: string
	templateType: 'geoFilter'
	bands: IServerGeoArea[]
}

/** Полная структура данных фильтров для сервера */
export interface IServerFiltersData {
	freqFilter: IServerBandsFilter
	pulseDurationFilter: IServerBandsFilter
	pulsePeriodFilter: IServerBandsFilter
	calendarFilter: IServerCalendarFilter
	selectorFilter: IServerSelectorFilter
	geoFilter: IServerGeoFilter
}

//--------------Входящие сообщения----------------------------------------
export interface IWebSocket {
	/**Спектральная панорама */
	spectrumPanorama: {
		id: number
		points: ISpectrumPanorama[]
		psd: number[]
	}
	/**Таблица целей */
	radarsList: {
		id: number
		frame: number
		url: string
		radars: IRadarsList[]
	}
	/**Таблица и график импульсов цели */
	radarTads: {
		id: number
		frame: number
		Tads: {
			tadChart: ITadChartRadar[]
			tadTable: IRadarsTadsTable[]
		}
	}
	pulseInfo: {
		id: number
		frame: number
		Pulses: {
			time: IChartInfoPulse[][]
			psd: IChartInfoPulse[][]
			wobble: IChartInfoPulse[][]
			fDiscr: number
		}
	}
}
//--------------Исходящие сообщения----------------------------------------
export interface WebSocketMessageBase {
	id: number
}

// Message id=101 (Filters MainForm)
export interface IFiltersMainMessage extends WebSocketMessageBase {
	data: IServerFiltersData
}

// Message id=102 (Selected radars in RadarTable)
export interface ISelectedRadarsList extends WebSocketMessageBase {
	data: {
		uid: ISelectedRadars['uid']
	}[]
}

// Message id=103 (Selected Impulse in the PulsesGridTable)
export interface ISelectedPulse extends WebSocketMessageBase {
	data: ISelectedTadId[]
}

// Message id=100 (Settings MainForm)
export interface IServerSettingsBand {
	id: number
	band: string
	checked: boolean
	time: number
	attenuator: number
}

export interface IServerSettingsBandsFilter {
	key: number
	filterLabel: string
	templateType: 'table'
	units: Record<string, string>
	bands: IServerSettingsBand[]
}

export interface IServerSettingsVskItem {
	freq: number
	checked: boolean
}

export interface IServerSettingsVsk {
	key: number
	filterLabel: string
	templateType: 'generator'
	bands: IServerSettingsVskItem[]
}

export interface IServerSettingsData {
	bandsFilter: IServerSettingsBandsFilter
	vsk: IServerSettingsVsk
}

export interface ISettingsMainMessage extends WebSocketMessageBase {
	data: IServerSettingsData
}

// Message id=130 (Create radar to database)
export interface ICreateRadarToDbData {
	id: number
	uid: string
	pulse_length: number
	rot_period: number
	freq: number
	PRI: number
	comment: string
}

export interface ICreateRadarToDbMessage extends WebSocketMessageBase {
	data: ICreateRadarToDbData
}

export type WebSocketMessage =
	| ISelectedRadarsList
	| ISelectedPulse
	| IFiltersMainMessage
	| ISettingsMainMessage
	| ICreateRadarToDbMessage
