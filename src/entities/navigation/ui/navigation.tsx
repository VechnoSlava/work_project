import { NavLink } from "react-router-dom"
import { useAppDispatch } from "../../../app/store/hooks"
import { type RoutePath, ROUTES_PATH } from "../../../shared/constants/routes"
import { setPage } from "../model/navigationPageSlice"
import styles from "./navigation.module.css"

export const Navigation: React.FC = () => {
  const dispatch = useAppDispatch()

  const handlePageChange = (page: RoutePath) => {
    dispatch(setPage(page))
  }

  return (
    <nav className={styles.container}>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.activeLink}` : `${styles.link}`
        }
        to={ROUTES_PATH.MAIN}
        onClick={() => handlePageChange(ROUTES_PATH.MAIN)}
      >
        Текущая обстановка
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.activeLink}` : `${styles.link}`
        }
        to={ROUTES_PATH.HISTORY}
        onClick={() => handlePageChange(ROUTES_PATH.HISTORY)}
      >
        База данных
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.activeLink}` : `${styles.link}`
        }
        to={ROUTES_PATH.IDENTIFICATION}
        onClick={() => handlePageChange(ROUTES_PATH.IDENTIFICATION)}
      >
        Режим идентификации
      </NavLink>
    </nav>
  )
}
