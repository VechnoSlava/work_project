import { type PayloadAction } from '@reduxjs/toolkit/react'
import { createAppSlice } from '@/app/store/createAppSlice'
import {
	type RoutePath,
	ROUTES_PATH,
	MASTER_TO_SLAVE,
	PAGE_TO_BASE_TAB,
} from '@/shared/constants/routes'

export interface PageState {
	/** Базовая вкладка основного окна: '/' или '/history' (без идентификации) */
	currentMainPage: RoutePath
	/** Путь второго окна — учитывает режим идентификации */
	currentSlavePage: RoutePath | ''
}

const initialState: PageState = {
	currentMainPage: ROUTES_PATH.MAIN,
	currentSlavePage: ROUTES_PATH.SLAVEMAIN,
}

export const pagesNavigationSlice = createAppSlice({
	name: 'navigationPage',
	initialState,
	reducers: create => ({
		setPage: create.reducer((state, action: PayloadAction<RoutePath>) => {
			// currentMainPage — всегда базовая вкладка (для подсветки навигации)
			state.currentMainPage = PAGE_TO_BASE_TAB[action.payload] ?? ROUTES_PATH.MAIN
			// slave — из фактического пути (сохраняет режим идентификации)
			state.currentSlavePage = MASTER_TO_SLAVE[action.payload] ?? ROUTES_PATH.SLAVEMAIN
		}),
		setSlavePage: create.reducer((state, action: PayloadAction<RoutePath>) => {
			state.currentSlavePage = action.payload
		}),
	}),
	selectors: {
		selectPage: state => state.currentMainPage,
		selectSlavePage: state => state.currentSlavePage,
	},
})

export const { setPage, setSlavePage } = pagesNavigationSlice.actions
export const { selectPage, selectSlavePage } = pagesNavigationSlice.selectors
