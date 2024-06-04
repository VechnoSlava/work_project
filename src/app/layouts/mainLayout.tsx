import { Outlet } from "react-router-dom"
import { Header } from "../../widgets/header"
import { Footer } from "../../widgets/footer"
import styles from "./mainLayout.module.css"

export const MainLayout = () => {
  return (
    <div className={styles.container}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
