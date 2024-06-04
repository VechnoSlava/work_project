import styles from "./mainLayout.module.css"
import { useEffect, useRef } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Header } from "../../widgets/header"
import { Footer } from "../../widgets/footer"
import {
  selectWindow,
  setSecondaryWindowPath,
} from "../../entities/navigation/model/navigationWindowSlice"
import { useAppDispatch, useAppSelector } from "../store/hooks"

export const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch()
  const isSecondaryWindowOpen = useAppSelector(selectWindow)
  const location = useLocation()
  const secondaryWindowRef = useRef<Window | null>(null)

  useEffect(() => {
    if (isSecondaryWindowOpen) {
      const path =
        location.pathname === "/"
          ? "/slaveMain"
          : location.pathname === "/history"
            ? "/slaveHistory"
            : ""
      dispatch(setSecondaryWindowPath(path))

      secondaryWindowRef.current = window.open(
        path,
        "SlaveWindow",
        "width=600,height=400",
      )
    } else if (secondaryWindowRef.current) {
      secondaryWindowRef.current.close()
      secondaryWindowRef.current = null
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)

      if (secondaryWindowRef.current) {
        secondaryWindowRef.current.close()
        secondaryWindowRef.current = null
      }
    }
  }, [isSecondaryWindowOpen, location.pathname, dispatch])

  useEffect(() => {
    if (isSecondaryWindowOpen && secondaryWindowRef.current) {
      const path =
        location.pathname === "/"
          ? "/slaveMain"
          : location.pathname === "/history"
            ? "/slaveHistory"
            : ""
      secondaryWindowRef.current.location.href = path
    }
  }, [location.pathname, isSecondaryWindowOpen])

  const handlePopState = () => {
    if (secondaryWindowRef.current) {
      const path =
        location.pathname === "/"
          ? "/slaveMain"
          : location.pathname === "/history"
            ? "/slaveHistory"
            : ""
      secondaryWindowRef.current.postMessage({ path }, "*")
    }
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.main}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
