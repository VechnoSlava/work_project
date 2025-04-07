import { useState, useMemo } from 'react'
import {
	TableRow,
	TableContainer,
	Table,
	TableHead,
	TableBody,
	Box,
	Paper,
	TableSortLabel,
} from '@mui/material'
import { visuallyHidden } from '@mui/utils'
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
import { getComparator, Order } from '../model/utils'

interface HeadCell {
	id: keyof ITadRadarList
	label: string
	sortable: boolean
}

const headCells: readonly HeadCell[] = [
	{ id: 'id', label: '№', sortable: false },
	{ id: 'radar', label: 'РЛС', sortable: true },
	{ id: 'freq', label: 'Центр. частота', sortable: true },
	{ id: 'pulse_length', label: 'Длит. импульса', sortable: true },
	{ id: 'pulse_amplitude', label: 'Амплитуда', sortable: true },
]

interface EnhancedTableProps {
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ITadRadarList) => void
	order: Order
	orderBy: string
}

function EnhancedTableHead({ order, orderBy, onRequestSort }: EnhancedTableProps) {
	const createSortHandler =
		(property: keyof ITadRadarList) => (event: React.MouseEvent<unknown>) => {
			onRequestSort(event, property)
		}

	return (
		<TableHead>
			<TableRow>
				{headCells.map(headCell => (
					<StyledTableHeaderCell
						key={headCell.id}
						align="left"
						sortDirection={orderBy === headCell.id ? order : false}
					>
						{headCell.sortable ? (
							<TableSortLabel
								active={orderBy === headCell.id}
								direction={orderBy === headCell.id ? order : 'asc'}
								onClick={createSortHandler(headCell.id)}
								sx={{ color: 'inherit !important' }}
							>
								{headCell.label}
								{orderBy === headCell.id ? (
									<Box component="span" sx={visuallyHidden}>
										{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
									</Box>
								) : null}
							</TableSortLabel>
						) : (
							<span style={{ cursor: 'default' }}>{headCell.label}</span>
						)}
					</StyledTableHeaderCell>
				))}
			</TableRow>
		</TableHead>
	)
}

export const PulsesGridTable = () => {
	const [order, setOrder] = useState<Order>('asc')
	const [orderBy, setOrderBy] = useState<keyof ITadRadarList>('radar')
	const dataTadsTable = useAppSelector(selectTadsTable)

	const dataImpulses = useMemo(() => dataTadsTable.flatMap(table => table.data), [dataTadsTable])

	const sortedData = useMemo(
		() => [...dataImpulses].sort(getComparator(order, orderBy)),
		[dataImpulses, order, orderBy],
	)

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof ITadRadarList) => {
		// Проверяем разрешена ли сортировка для столбца
		const headCell = headCells.find(cell => cell.id === property)
		if (!headCell?.sortable) return

		const isAsc = orderBy === property && order === 'asc'
		setOrder(isAsc ? 'desc' : 'asc')
		setOrderBy(property)
	}

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
					<EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
					<TableBody>
						{sortedData.length > 0 ? (
							sortedData.map((row, index) => (
								<StyledTableRow
									key={`${row.radar}-${row.id}`}
									className={index % 2 === 0 ? 'even' : 'odd'}
								>
									<StyledTableCell align="left">{row.id}</StyledTableCell>
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
