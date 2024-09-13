import { ISpectrumPanorama, IWebSocket } from '../webSocket/IWebSocket'

interface IDataPanorama {
	points: ISpectrumPanorama[]
}

export let panoramaSpectrum: IDataPanorama | undefined

export function initPanoramaSpectrum(data: IWebSocket['spectrumPanorama'], limit = 12288) {
	panoramaSpectrum = {
		points: data.points.slice(0, limit), // Ограничение по количеству данных
	}
}

export function updatePanoramaSpectrum(data: IWebSocket['spectrumPanorama'], limit = 12288) {
	if (!panoramaSpectrum) {
		initPanoramaSpectrum(data, limit)
	} else {
		// Проверка на превышение лимита и удаление старых данных
		panoramaSpectrum.points = [...panoramaSpectrum.points, ...data.points].slice(-limit) // Хранение последних N значений
	}
	console.log(panoramaSpectrum?.points)
	drawPanoramaSpectrum()
}

export function drawPanoramaSpectrum() {}
