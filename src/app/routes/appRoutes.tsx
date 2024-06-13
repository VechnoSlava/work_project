import { Routes, Route } from "react-router-dom"
import { MainLayout } from "../layouts"
import { MainPage } from "../../pages/mainPage"
import { HistoryPage } from "../../pages/historyPage"
import { ROUTES_PATH } from "../../shared/constants/routes"
import { SlaveHistoryPage } from "../../pages/slaveHistoryPage"
import { SlaveMainPage } from "../../pages/slaveMainPage"

export const AppRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<MainPage />} />
          <Route path={ROUTES_PATH.HISTORY} element={<HistoryPage />} />
        </Route>
        <Route path={ROUTES_PATH.SLAVEMAIN} element={<SlaveMainPage />} />
        <Route path={ROUTES_PATH.SLAVEHISTORY} element={<SlaveHistoryPage />} />
      </Routes>
    </>
  )
}
