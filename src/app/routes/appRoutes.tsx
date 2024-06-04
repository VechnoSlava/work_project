import { Routes, Route } from "react-router-dom"
import { MainPage } from "../../pages/mainPage"
import { HistoryPage } from "../../pages/historyPage"
import { IdentificationPage } from "../../pages/identificationPage"
import { ROUTES_PATH } from "../../shared/constants/routes"
import { MainLayout } from "../layouts/mainLayout"
import { SlaveHistoryPage } from "../../pages/slaveHistoryPage"
import { SlaveMainPage } from "../../pages/slaveMainPage"

export const AppRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<MainPage />} />
          <Route path={ROUTES_PATH.HISTORY} element={<HistoryPage />} />
          <Route
            path={ROUTES_PATH.IDENTIFICATION}
            element={<IdentificationPage />}
          />
        </Route>
        <Route path={ROUTES_PATH.SLAVEMAIN} element={<SlaveMainPage />} />
        <Route path={ROUTES_PATH.SLAVEHISTORY} element={<SlaveHistoryPage />} />
      </Routes>
    </>
  )
}
