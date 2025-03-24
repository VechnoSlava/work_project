import styles from './radarsTable.module.css'
import { useEffect, useState } from 'react'
import {
	GridColDef,
	gridPageCountSelector,
	gridPageSelector,
	GridPagination,
	GridRowSelectionModel,
	useGridApiContext,
	useGridSelector,
} from '@mui/x-data-grid'
import MuiPagination from '@mui/material/Pagination'
import { MenuItem, TablePaginationProps, Typography } from '@mui/material'
import { PiMapPinAreaBold } from 'react-icons/pi'
import { RiInboxArchiveLine } from 'react-icons/ri'
import { CustomTargetTable } from '../../../shared/tables/customTargetsTable'
import { MenuContextTable } from '../../../shared/menu/tableContextMenu'
import { IoIosConstruct } from 'react-icons/io'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import { formatDateTimeRu, formatNumber } from '../../../shared/utils/utils'
import { IRadarsList, WebSocketMessage } from '../../../shared/webSocket/IWebSocket'
import { selectRadarsList, sendMessage } from '../../../shared/webSocket/serverConnectionSlice'
import { addSelectedColor, addSelectedRadars } from '../model/radarsTableSlice'

//Form table DataGrid
const columns: GridColDef[] = [
	{
		field: 'color',
		headerName: 'Цвет',
		width: 55,
		sortable: false,
		filterable: false,
		disableColumnMenu: true,
		renderCell: params => (
			<div
				style={{
					backgroundColor: params.row.color || '#fff',
					width: 16,
					height: 16,
					borderRadius: '50%',
					border: '1px solid rgba(255, 255, 255, 0.23)',
				}}
			/>
		),
	},
	{ field: 'id', headerName: '№', width: 30 },
	{
		field: 'uid',
		headerName: 'РЛС',
		valueGetter: (value: string) => value.slice(0, 8),
	},
	{
		field: 'freq',
		headerName: 'Частота',
		valueGetter: value => formatNumber(value),
	},
	{
		field: 'pulse_length',
		headerName: 'Длительность импульса',
		valueGetter: value => formatNumber(value),
	},
	{
		field: 'PRI',
		headerName: 'ПСИ',
		valueGetter: value => formatNumber(value),
	},
	{
		field: 'bearing',
		headerName: 'Пеленг',
		valueGetter: (value, row: IRadarsList) => formatNumber(row.bearing.bearing),
	},
	{
		field: 'rot_period',
		headerName: 'Период вращения',
		valueGetter: value => formatNumber(value),
	},
	{
		field: 'detection_time',
		headerName: 'Время обнаружения',
		valueGetter: (value: string) => formatDateTimeRu(value),
	},
	{
		field: 'identification_data',
		headerName: 'БД инфо',
		valueGetter: (value: string) => value.slice(0, 8),
	},
	{ field: 'comment', headerName: 'Комментарий' },
]

//Title DataGrid Toolbar
function CustomTitle() {
	return (
		<Typography align="center" sx={{ backgroundColor: '#112d49' }}>
			Таблица целей
		</Typography>
	)
}

//Custom Menu Pagination
function Pagination({
	onPageChange,
	className,
}: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'>) {
	const apiRef = useGridApiContext()
	const page = useGridSelector(apiRef, gridPageSelector)
	const pageCount = useGridSelector(apiRef, gridPageCountSelector)
	return (
		<MuiPagination
			className={className}
			variant="outlined"
			shape="rounded"
			size="small"
			count={pageCount}
			defaultPage={page}
			page={page + 1}
			onChange={(event: React.ChangeEvent<unknown>, newPage: number) => {
				onPageChange(event as any, newPage - 1)
			}}
			siblingCount={1}
		/>
	)
}
function CustomPagination(props: any) {
	return <GridPagination ActionsComponent={Pagination} {...props} />
}

//Component X-Data-Grid
export const RadarsTable = () => {
	const [contextMenu, setContextMenu] = useState<{
		mouseX: number
		mouseY: number
	} | null>(null)
	const [idSelectedRow, setIdSelectedRow] = useState<number>()
	const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([])
	const dispatch = useAppDispatch()
	const dataRadars = useAppSelector(selectRadarsList)

	// Function for get uid from selected rows
	const getSelectedUids = () => {
		const selectedUids = rowSelectionModel
			.map(id => {
				const selectedRow = dataRadars.find(row => row.id === id)
				return selectedRow ? { uid: selectedRow.uid } : null
			})
			.filter(uidObj => uidObj !== null)
		return selectedUids
	}

	const getSelectedColorsRadars = () => {
		const selectedColors = rowSelectionModel
			.map(id => {
				const selectedRow = dataRadars.find(row => row.id === id)
				return selectedRow ? { color: selectedRow.color! } : null
			})
			.filter(uidObj => uidObj !== null)
		return selectedColors
	}

	//Send selected id on server for get data pulses
	const sendMessageToWebSocket = () => {
		const selectedRadars = getSelectedUids()
		const selectedColors = getSelectedColorsRadars()
		dispatch(addSelectedRadars(selectedRadars))
		dispatch(addSelectedColor(selectedColors))
		const message: WebSocketMessage = {
			id: 102,
			data: selectedRadars,
		}
		console.log('Message sent:', message)
		// console.log('selected', { selectedRadars, selectedColors })
		dispatch(sendMessage(message))
	}

	useEffect(() => {
		if (rowSelectionModel.length > 0) {
			sendMessageToWebSocket()
		}
	}, [rowSelectionModel])

	//Open ContextMenu
	const handleContextMenuOpen = (event: React.MouseEvent) => {
		event.preventDefault()
		setIdSelectedRow(Number(event.currentTarget.getAttribute('data-id')))

		setContextMenu(
			contextMenu === null
				? {
						mouseX: event.clientX - 2,
						mouseY: event.clientY - 4,
					}
				: null,
		)
	}

	//Close ContextMenu
	const handleContextMenuClose = () => {
		setContextMenu(null)
	}

	const handleHighlightOnMap = () => {
		if (idSelectedRow) {
			// Добавьте здесь код для подсветки на карте
			console.log(`Подсветить на карте: объект с ID ${idSelectedRow}`)
		}
		handleContextMenuClose()
	}

	const handleSaveToDatabase = () => {
		if (idSelectedRow) {
			// Добавьте здесь код для сохранения в базу данных
			console.log(`Сохранить в базу данных: объект с ID ${idSelectedRow}`)
		}
		handleContextMenuClose()
	}

	const handlePresentToConsole = () => {
		if (idSelectedRow) {
			// Найти объект в массиве currentTargets по выбранному id
			const selectedObject = dataRadars.find(target => target.id === idSelectedRow)

			// Вывести объект в консоль
			console.log(selectedObject)
		}
		handleContextMenuClose()
	}

	return (
		<div className={styles.table__container}>
			<CustomTargetTable
				// checkboxSelection
				aria-label="Targets_table"
				rows={dataRadars}
				columns={columns}
				disableColumnMenu
				columnHeaderHeight={36}
				rowHeight={28}
				onRowSelectionModelChange={newRowSelectionModel => {
					setRowSelectionModel(newRowSelectionModel)
				}}
				rowSelectionModel={rowSelectionModel}
				slotProps={{
					row: {
						onContextMenu: handleContextMenuOpen,
						style: { cursor: 'context-menu' },
					},
				}}
				getRowClassName={params => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
				slots={{
					toolbar: CustomTitle,
					pagination: CustomPagination,
				}}
				initialState={{
					pagination: { paginationModel: { pageSize: 25, page: 0 } },
				}}
				localeText={{
					noRowsLabel: 'Целей не обнаружено',
					columnHeaderSortIconLabel: 'Сортировать',
					footerRowSelected: count =>
						count !== 1
							? `${count.toLocaleString()} строк выбрано`
							: `${count.toLocaleString()} строка выбрана`,
					footerTotalRows: 'Всего строк:',
					MuiTablePagination: {
						labelRowsPerPage: 'Строк на странице',
						labelDisplayedRows: ({ from, to, count }) =>
							`${from}-${to} из ${count !== -1 ? count : `более чем ${to}`}`,
					},
				}}
			/>
			<MenuContextTable
				open={contextMenu !== null}
				onClose={handleContextMenuClose}
				anchorReference="anchorPosition"
				anchorPosition={
					contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
				}
				slotProps={{
					root: {
						onContextMenu: event => {
							event.preventDefault()
							handleContextMenuClose()
						},
					},
				}}
			>
				<MenuItem onClick={handleHighlightOnMap} disableRipple>
					<PiMapPinAreaBold />
					Подсветить на карте
				</MenuItem>
				<MenuItem onClick={handleSaveToDatabase}>
					<RiInboxArchiveLine />
					Сохранить в базу
				</MenuItem>
				<MenuItem onClick={handlePresentToConsole}>
					<IoIosConstruct />
					Показать объект
				</MenuItem>
			</MenuContextTable>
		</div>
	)
}
