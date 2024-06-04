import type { FC } from "react"
import { Route, Routes } from "react-router-dom"
import { ROUTES_PATH } from "../../shared/constants/routes"
import { MainPage } from "../../pages/mainPage"
import { HistoryPage } from "../../pages/historyPage"
import { IdentificationPage } from "../../pages/identificationPage"
import styles from "./appRoutes.module.css"

export const AppRoutes: FC = () => {
  return (
    <div className={styles.container}>
      <Routes>
        <Route path={ROUTES_PATH.MAIN} element={<MainPage />} />
        <Route path={ROUTES_PATH.HISTORY} element={<HistoryPage />} />
        <Route
          path={ROUTES_PATH.IDENTIFICATION}
          element={<IdentificationPage />}
        />
        {/* Добавьте другие пути при необходимости */}
      </Routes>
    </div>
  )
}

// type Route = {
//   path: string
//   Component: FC
// }

// export const routesPath: Route[] = [
//   {
//     path: ROUTES_PATH.MAIN,
//     Component: MainLayout,
//   },
// ]
