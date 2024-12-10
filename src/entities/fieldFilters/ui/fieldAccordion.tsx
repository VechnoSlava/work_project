import styles from './fieldAccordion.module.css'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import { SlArrowDown } from 'react-icons/sl'
import { ReactNode } from 'react'

interface IAccordionProps {
	children: ReactNode
	nameField: string
	id?: string
}

export const FieldAccordion: React.FC<IAccordionProps> = ({ children, nameField, id }) => {
	return (
		<div className={styles.accordion}>
			<Accordion
				sx={{
					backgroundColor: '#091e2f',
					boxShadow: '0px 2px 3px #12161a',
				}}
			>
				<AccordionSummary expandIcon={<SlArrowDown />} id={id}>
					<Typography sx={{ fontSize: 16 }}>{nameField}</Typography>
				</AccordionSummary>
				<AccordionDetails
					sx={{
						padding: '0px',
					}}
				>
					<div className={styles.accordion__details}>{children}</div>
				</AccordionDetails>
			</Accordion>
		</div>
	)
}
