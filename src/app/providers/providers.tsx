import { Provider } from "react-redux"
import { BrowserRouter as Router } from "react-router-dom"
import type { FC } from "react"
import { store } from "../store/store"

/** Провайдеры в которые будет обернуто наше приложение */
interface IProviders {
  readonly children: JSX.Element
}

export const Providers: FC<IProviders> = ({ children }) => {
  return (
    <Provider store={store}>
      <Router>{children}</Router>
    </Provider>
  )
}
