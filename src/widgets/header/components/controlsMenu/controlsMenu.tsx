import { useRef, useState, type ReactNode } from 'react'
import { Popover } from '@mui/material'
import { RiMenuLine } from 'react-icons/ri'
import { ButtonMenuHead } from '@/shared/buttons'
import styles from './controlsMenu.module.css'

/**
 * Кнопка-гамбургер, открывающая Popover со списком переданных
 * кнопок управления. Используется на узких экранах вместо
 * горизонтального ряда кнопок.
 */
export const ControlsMenu = ({ children }: { children: ReactNode }) => {
	const [open, setOpen] = useState(false)
	const anchorRef = useRef<HTMLDivElement>(null)

	return (
		<>
			<div ref={anchorRef} className={styles.buttonContainer}>
				<ButtonMenuHead
					value="check"
					selected={open}
					title="Меню управления"
					onClick={() => setOpen(prev => !prev)}
				>
					<RiMenuLine size="100%" />
				</ButtonMenuHead>
			</div>

			<Popover
				open={open}
				anchorEl={anchorRef.current}
				onClose={() => setOpen(false)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				slotProps={{
					paper: {
						sx: {
							backgroundColor: '#0e3753',
							backgroundImage: 'none',
							border: '1px solid rgba(255, 255, 255, 0.12)',
							marginTop: '4px',
						},
					},
				}}
			>
				<div className={styles.menuContent}>{children}</div>
			</Popover>
		</>
	)
}
