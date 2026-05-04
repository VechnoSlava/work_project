import type { ReactNode } from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	type DialogProps,
} from '@mui/material'
import { RiCloseLargeFill } from 'react-icons/ri'

interface ModalWindowFormProps extends Omit<DialogProps, 'title'> {
	title: string
	actions?: ReactNode
	children: ReactNode
}

export const ModalWindowForm = ({
	title,
	actions,
	children,
	onClose,
	...dialogProps
}: ModalWindowFormProps) => {
	const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
		// Закрытие только по Esc или программно, не по клику на backdrop
		if (reason === 'backdropClick') return
		onClose?.(event, reason)
	}

	return (
		<Dialog
			maxWidth="sm"
			fullWidth
			onClose={handleClose}
			slotProps={{
				paper: {
					sx: {
						backgroundColor: '#0e3753',
						backgroundImage: 'none',
						overflow: 'hidden',
					},
				},
			}}
			{...dialogProps}
		>
			<DialogTitle
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '12px 16px',
				}}
			>
				{title}
				<IconButton
					onClick={e => onClose?.(e, 'escapeKeyDown')}
					size="small"
					sx={{ color: '#8a9baa' }}
				>
					<RiCloseLargeFill />
				</IconButton>
			</DialogTitle>

			<DialogContent
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '16px',
					padding: '16px !important',
					overflow: 'visible',
				}}
			>
				{children}
			</DialogContent>

			{actions && <DialogActions sx={{ padding: '8px 16px 16px' }}>{actions}</DialogActions>}
		</Dialog>
	)
}
