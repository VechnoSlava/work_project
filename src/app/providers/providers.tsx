import type { FC } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { store } from '../store/store'
import { ThemeProvider } from '@mui/material'
import { darkTheme } from '../../shared/theme/themeMui'

/** Провайдеры в которые будет обернуто наше приложение */
interface IProviders {
	readonly children: JSX.Element
}

export const Providers: FC<IProviders> = ({ children }) => {
	return (
		<Provider store={store}>
			<ThemeProvider theme={darkTheme}>
				<Router>{children}</Router>
			</ThemeProvider>
		</Provider>
	)
}
