import { TableRow, TableContainer, Table, TableHead, TableBody, Box, Paper } from '@mui/material'
import styles from './pulsesGridTable.module.css'
import { formatNumber } from '../../../shared/utils/utils'
import { useAppSelector } from '../../../app/store/hooks'
import { selectTadsTable } from '../../../shared/webSocket/serverConnectionSlice'
import { ITadRadarList } from '../../../shared/webSocket/IWebSocket'
import {
	StyledTableCell,
	StyledTableHeaderCell,
	StyledTableRow,
} from '../../../shared/tables/customPulsesGridTable'

export const PulsesGridTable = () => {
	const dataTadsTable = useAppSelector(selectTadsTable)
	const dataImpulses = dataTadsTable.length > 0 ? dataTadsTable.flatMap(table => table.data) : []

	return (
		<div className={styles.table__container}>
			<TableContainer
				component={Paper}
				sx={{
					backgroundColor: '#111f2efe',
					borderRadius: 0,
					height: '100%',
					'&::-webkit-scrollbar': {
						width: 12,
						height: 12,
					},
					'&::-webkit-scrollbar-track': {
						backgroundColor: '#06344dff',
					},
					'&::-webkit-scrollbar-thumb': {
						backgroundColor: '#0c4c5cff',
						'&:hover': {
							backgroundColor: '#aeafaf63',
						},
					},
				}}
			>
				<Table
					size="small"
					stickyHeader
					sx={{
						height: '100%',
						'& .MuiTableBody-root': {
							overflow: 'auto',
						},
					}}
				>
					<TableHead>
						<TableRow>
							<StyledTableHeaderCell align="center">№</StyledTableHeaderCell>
							<StyledTableHeaderCell title="sda" align="left">
								РЛС
							</StyledTableHeaderCell>
							<StyledTableHeaderCell align="left">Центр. частота</StyledTableHeaderCell>
							<StyledTableHeaderCell align="left">Длит. импульса</StyledTableHeaderCell>
							<StyledTableHeaderCell align="left">Амплитуда</StyledTableHeaderCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{dataImpulses.length > 0 ? (
							dataImpulses.map((row, index) => (
								<StyledTableRow
									key={`${row.radar}-${row.id}`}
									className={index % 2 === 0 ? 'even' : 'odd'}
								>
									<StyledTableCell align="center">{row.id}</StyledTableCell>
									<StyledTableCell align="left">{row.radar?.slice(0, 8)}</StyledTableCell>
									<StyledTableCell align="left">{formatNumber(row.freq)}</StyledTableCell>
									<StyledTableCell align="left">{formatNumber(row.pulse_length)}</StyledTableCell>
									<StyledTableCell align="left">
										{formatNumber(row.pulse_amplitude)?.split(',').shift()}
									</StyledTableCell>
								</StyledTableRow>
							))
						) : (
							<TableRow sx={{ height: '100%' }}>
								<StyledTableCell
									colSpan={5}
									sx={{
										height: '100%',
										position: 'relative',
										backgroundColor: '#111f2efe',
									}}
								>
									<Box
										sx={{
											position: 'absolute',
											top: '50%',
											left: '50%',
											transform: 'translate(-50%, -50%)',
											color: '#8f8f8ffe',
											fontSize: 14,
										}}
									>
										Выберите РЛС
									</Box>
								</StyledTableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	)
}
