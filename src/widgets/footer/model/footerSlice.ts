import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '@/app/store/createAppSlice'

export interface LogEntry {
	id: number
	time: string
	message: string
}

interface FooterState {
	logs: LogEntry[]
}

const initialState: FooterState = {
	logs: [],
}

let nextLogId = 0

export const footerSlice = createAppSlice({
	name: 'footer',
	initialState,
	reducers: create => ({
		addLog: create.reducer((state, action: PayloadAction<string>) => {
			state.logs.push({
				id: nextLogId++,
				time: new Date().toLocaleTimeString('ru-RU'),
				message: action.payload,
			})
			// Храним максимум 200 записей
			if (state.logs.length > 200) {
				state.logs = state.logs.slice(-200)
			}
		}),
		clearLogs: create.reducer(state => {
			state.logs = []
		}),
	}),
	selectors: {
		selectLogs: state => state.logs,
		selectLastLog: state => (state.logs.length > 0 ? state.logs[state.logs.length - 1] : null),
	},
})

export const { addLog, clearLogs } = footerSlice.actions
export const { selectLogs, selectLastLog } = footerSlice.selectors
