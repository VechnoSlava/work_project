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
					padding: '8px 16px',
				}}
			>
				{title}
				<IconButton
					onClick={e => handleClose(e, 'escapeKeyDown')}
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
					padding: '10px 16px 8px 16px',
					marginTop: '10px',
				}}
			>
				{children}
			</DialogContent>

			{actions && <DialogActions sx={{ padding: '8px 16px' }}>{actions}</DialogActions>}
		</Dialog>
	)
}
