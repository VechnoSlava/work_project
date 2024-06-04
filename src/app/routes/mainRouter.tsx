import { selectWindow } from "../../entities/navigation/model/navigationWindowSlice"
import { SlaveMainPage } from "../../pages/slaveMainPage"
import { Footer } from "../../widgets/footer"
import { Header } from "../../widgets/header"
import { useAppSelector } from "../store/hooks"
import { AppRoutes } from "./appRoutes"
import styles from "./mainRouter.module.css"

export const MainRouter: React.FC = () => {
  const isSecondaryWindowOpen = useAppSelector(selectWindow)

  return (
    <div className={styles.container}>
      <Header />
      <AppRoutes />
      <Footer />
      {isSecondaryWindowOpen && <SlaveMainPage />}
    </div>
  )
}
