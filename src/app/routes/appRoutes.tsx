import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '../layouts'
import { MainPage } from '@/pages/mainPage'
import { HistoryPage } from '@/pages/historyPage'
import { IdentificationPage } from '@/pages/identificationPage'
import { IdentificationHistoryPage } from '@/pages/identificationHistoryPage'
import { SlaveMainPage } from '@/pages/slaveMainPage'
import { SlaveHistoryPage } from '@/pages/slaveHistoryPage'
import { SlaveIdentificationPage } from '@/pages/slaveIdentificationPage'
import { SlaveIdentificationHistoryPage } from '@/pages/slaveIdentificationHistoryPage'
import { ROUTES_PATH } from '@/shared/constants/routes'

export const AppRoutes: React.FC = () => {
	return (
		<Routes>
			{/* ─── Основные окна (с хедером/футером) ─── */}
			<Route path="/" element={<MainLayout />}>
				{/* Текущая обстановка */}
				<Route index element={<MainPage />} />
				<Route path={ROUTES_PATH.IDENTIFICATION} element={<IdentificationPage />} />
				{/* База данных */}
				<Route path={ROUTES_PATH.HISTORY} element={<HistoryPage />} />
				<Route path={ROUTES_PATH.HISTORYIDENTIFICATION} element={<IdentificationHistoryPage />} />
			</Route>

			{/* ─── Вторые окна (slave, без хедера/футера) ─── */}
			<Route path={ROUTES_PATH.SLAVEMAIN} element={<SlaveMainPage />} />
			<Route path={ROUTES_PATH.SLAVEIDENTIFICATION} element={<SlaveIdentificationPage />} />
			<Route path={ROUTES_PATH.SLAVEHISTORY} element={<SlaveHistoryPage />} />
			<Route
				path={ROUTES_PATH.SLAVEHISTORYIDENTIFICATION}
				element={<SlaveIdentificationHistoryPage />}
			/>
		</Routes>
	)
}
