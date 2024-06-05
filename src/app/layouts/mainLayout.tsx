import styles from "./mainLayout.module.css"

import { Outlet } from "react-router-dom"
import { Header } from "../../widgets/header"
import { Footer } from "../../widgets/footer"

export const MainLayout: React.FC = () => {
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
