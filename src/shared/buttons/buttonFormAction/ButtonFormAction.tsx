import { Button, ButtonProps, styled } from '@mui/material'

export const StyledButton = styled(Button)(({ theme }) => ({
	color: theme.palette.text.secondary,
	border: `1px solid ${theme.palette.divider}`,
	borderRadius: '5px',
	'&:hover': {
		color: theme.palette.text.primary,
		borderColor: theme.palette.text.secondary,
		backgroundColor: theme.palette.action.hover,
	},
}))

export const ButtonFormAction = ({ children, ...props }: ButtonProps) => {
	return (
		<StyledButton variant="outlined" {...props}>
			{children}
		</StyledButton>
	)
}
