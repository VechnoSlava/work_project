import { List, ListItemButton, ListItemText, Menu, MenuItem } from '@mui/material'
import styles from './pagesNavigationMenu.module.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../app/store/hooks'
import { selectPage, setPage } from '../../model/pagesNavigationSlice'
import { ROUTES_PATH, type RoutePath } from '../../../../shared/constants/routes'

const OPTIONS = [
	{ label: 'Текущая обстановка', path: ROUTES_PATH.MAIN },
	{ label: 'База данных', path: ROUTES_PATH.HISTORY },
] as const

export const PagesNavigationMenu = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const [openMenu, setOpenMenu] = useState<HTMLElement | null>(null)
	const currentMainPage = useAppSelector(selectPage)

	// Индекс активной страницы выводится из Redux, а не из локального state
	const selectedIndex = OPTIONS.findIndex(o => o.path === currentMainPage)

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setOpenMenu(event.currentTarget)
	}

	const handleMenuClose = () => {
		setOpenMenu(null)
	}

	const handleMenuItemClick = (newPage: RoutePath) => {
		dispatch(setPage(newPage))
		navigate(newPage)
		setOpenMenu(null)
	}

	const currentLabel = OPTIONS[selectedIndex]?.label ?? ''
	const secondaryLabel = OPTIONS.find(o => o.path !== currentMainPage)?.label ?? ''

	return (
		<div className={styles.navigation__menu}>
			<List component="nav" aria-label="Nav bar">
				<ListItemButton
					sx={{ padding: 0, minWidth: '260px' }}
					id="lock-button"
					aria-haspopup="listbox"
					aria-controls="lock-menu"
					aria-expanded={Boolean(openMenu)}
					onClick={handleMenuOpen}
				>
					<ListItemText
						primary={currentLabel}
						secondary={secondaryLabel}
						slotProps={{
							primary: { fontSize: '1.25rem', fontWeight: 'regular' },
							secondary: { color: 'gray' },
						}}
					/>
				</ListItemButton>
			</List>
			<Menu
				id="lock-menu"
				anchorEl={openMenu}
				open={Boolean(openMenu)}
				onClose={handleMenuClose}
				slotProps={{
					list: { 'aria-labelledby': 'lock-button', role: 'listbox' },
				}}
				sx={{
					'& .MuiPaper-root': {
						width: '200px',
						backgroundColor: '#1a4858',
						color: 'rgb(255 255 255)',
					},
				}}
			>
				{OPTIONS.map((option, index) => (
					<MenuItem
						key={option.path}
						disabled={index === selectedIndex}
						selected={index === selectedIndex}
						onClick={() => handleMenuItemClick(option.path)}
						sx={{ '&:hover': { backgroundColor: '#112d492a' } }}
					>
						{option.label}
					</MenuItem>
				))}
			</Menu>
		</div>
	)
}
