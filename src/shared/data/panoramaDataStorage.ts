import { ISpectrumPanorama, IWebSocket } from '../webSocket/IWebSocket'

class PanoramaDataStorage {
	points: ISpectrumPanorama[] = []
	limit: number

	constructor(limit = 12288) {
		this.limit = limit
	}

	// Метод для инициализации хранилища
	init(data: IWebSocket['spectrumPanorama']) {
		this.points = data.points.slice(0, this.limit)
	}

	// Метод для обновления хранилища
	update(data: IWebSocket['spectrumPanorama']) {
		if (!this.points.length) {
			this.init(data)
		} else {
			this.points = [...this.points, ...data.points].slice(-this.limit) // Хранение последних N значений
		}
	}

	// Метод для получения данных
	get(): ISpectrumPanorama[] {
		return this.points
	}

	// Метод для очистки данных
	clear() {
		this.points = []
	}
}

// Экземпляр класса для использования
export const panoramaSpectrumData = new PanoramaDataStorage()
