import { Button, ButtonProps, styled } from '@mui/material'
import { forwardRef } from 'react'

export const ButtonSend = styled(Button)(({ theme }) => ({
	color: '#A2A2A3',
	border: '1px solid ',
	borderColor: '#404041',
	borderRadius: '5px',
	'&:hover': {
		color: '#EBEBED',
		borderColor: '#8b8f94',
		backgroundColor: '#6d6d6d17',
	},
}))

type ButtonSendFormProps = ButtonProps & {
	children: React.ReactNode
}

export const ButtonSendForm = forwardRef<HTMLButtonElement, ButtonSendFormProps>(
	({ children, ...props }, ref) => {
		return (
			<ButtonSend type="submit" variant="text" ref={ref} {...props}>
				{children}
			</ButtonSend>
		)
	},
)
ButtonSendForm.displayName = 'ButtonSendForm'
