import { SlaveMainPage } from "../../pages/slaveMainPage"
import { Footer } from "../../widgets/footer"
import { Header } from "../../widgets/header"

export const SlaveLayout = () => {
  return (
    <>
      <Header />
      <SlaveMainPage />
      <Footer />
    </>
  )
}
