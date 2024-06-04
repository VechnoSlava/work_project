import { Routes, Route } from "react-router-dom"
import { MainPage } from "../../pages/mainPage"
import { HistoryPage } from "../../pages/historyPage"
import { IdentificationPage } from "../../pages/identificationPage"
import { ROUTES_PATH } from "../../shared/constants/routes"
import { MainLayout } from "../layouts/mainLayout"
// import { SlaveLayout } from "../layouts/slaveLayout"
// import { selectWindow } from "../../entities/navigation/model/navigationWindowSlice"
// import { useAppSelector } from "../store/hooks"

export const MainRouter: React.FC = () => {
  // const isSecondaryWindowOpen = useAppSelector(selectWindow)

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
        {/* {isSecondaryWindowOpen && <SlaveLayout />} */}
      </Routes>
    </>
  )
}
