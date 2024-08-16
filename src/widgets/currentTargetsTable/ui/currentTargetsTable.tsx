import styles from './currentTargetTable.module.css'
import { useState } from 'react'
import {
	GridColDef,
	gridPageCountSelector,
	gridPageSelector,
	GridPagination,
	GridRowsProp,
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
import { formatDateTimeRu, formatNumber } from '../../../shared/utils/utils'
import { IRadarsList } from '../../../shared/webSocket/IWebSocket'

const currentTargets: GridRowsProp = [
	{
		id: 1,
		uid: '6b183e28-08c8-466a-47ce-d4aea9a07499',
		inner_id: 0,
		pulse_length: 607.3371,
		rot_period: 127,
		freq: 9402.5,
		PRI: 1442,
		comment: '-',
		bearing: {
			id: 0,
			bearing: 21.04,
			origin: [0, 0],
		},
		path: null,
		detection_time: '2024-08-14T12:21:54+03:00',
		identification_data: '6b183e28-08c8-466a-47ce-d4aea9a07499Identification',
		id_signature: 2,
	},
	{
		id: 2,
		uid: '55c41f4f-9f53-4118-757a-98f3bc736785',
		inner_id: 1,
		pulse_length: 635.67535,
		rot_period: 127,
		freq: 9417.333,
		PRI: 1200,
		comment: '-',
		bearing: {
			id: 0,
			bearing: 21.04,
			origin: [0, 0],
		},
		path: null,
		detection_time: '2024-08-14T12:21:54+03:00',
		identification_data: '55c41f4f-9f53-4118-757a-98f3bc736785Identification',
		id_signature: 3,
	},
	{
		id: 3,
		uid: '975f7c97-6973-441b-63b7-7ab7035fdfea',
		inner_id: 2,
		pulse_length: 606.36346,
		rot_period: 127,
		freq: 9458.167,
		PRI: 593,
		comment: '-',
		bearing: {
			id: 0,
			bearing: 21.04,
			origin: [0, 0],
		},
		path: null,
		detection_time: '2024-08-14T12:21:54+03:00',
		identification_data: '975f7c97-6973-441b-63b7-7ab7035fdfeaIdentification',
		id_signature: 4,
	},
	{
		id: 4,
		uid: '7d3ab25d-4a0f-441a-72f0-5123765ef62b',
		inner_id: 3,
		pulse_length: 631.9093,
		rot_period: 127,
		freq: 9407,
		PRI: 554,
		comment: '-',
		bearing: {
			id: 0,
			bearing: 21.04,
			origin: [0, 0],
		},
		path: null,
		detection_time: '2024-08-14T12:21:54+03:00',
		identification_data: '7d3ab25d-4a0f-441a-72f0-5123765ef62bIdentification',
		id_signature: 5,
	},
	{
		id: 5,
		uid: '42454d34-bd81-4f4d-47a3-5798ee4e2791',
		inner_id: 4,
		pulse_length: 598.70685,
		rot_period: 127,
		freq: 9452.25,
		PRI: 882,
		comment: '-',
		bearing: {
			id: 0,
			bearing: 21.04,
			origin: [0, 0],
		},
		path: null,
		detection_time: '2024-08-14T12:21:54+03:00',
		identification_data: '42454d34-bd81-4f4d-47a3-5798ee4e2791Identification',
		id_signature: 6,
	},
]

const columns: GridColDef[] = [
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
			Тестовая таблица целей
		</Typography>
	)
}

//Custom menu pagination
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
			siblingCount={1} // Показывает одну страницу до и после текущей
		/>
	)
}
function CustomPagination(props: any) {
	return <GridPagination ActionsComponent={Pagination} {...props} />
}

//X-Data-Grid
export const CurrentTargetsTable = () => {
	const [contextMenu, setContextMenu] = useState<{
		mouseX: number
		mouseY: number
	} | null>(null)
	const [idSelectedRow, setIdSelectedRow] = useState<number>()

	const handleContextMenu = (event: React.MouseEvent) => {
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

	const handleClose = () => {
		setContextMenu(null)
	}

	const handleHighlightOnMap = () => {
		if (idSelectedRow) {
			// Добавьте здесь код для подсветки на карте
			console.log(`Подсветить на карте: объект с ID ${idSelectedRow}`)
		}
		handleClose()
	}

	const handleSaveToDatabase = () => {
		if (idSelectedRow) {
			// Добавьте здесь код для сохранения в базу данных
			console.log(`Сохранить в базу данных: объект с ID ${idSelectedRow}`)
		}
		handleClose()
	}

	const handlePresentToConsole = () => {
		if (idSelectedRow) {
			// Найти объект в массиве currentTargets по выбранному id
			const selectedObject = currentTargets.find(target => target.id === idSelectedRow)

			// Вывести объект в консоль
			console.log(selectedObject)
		}
		handleClose()
	}

	return (
		<div className={styles.table__container}>
			<CustomTargetTable
				checkboxSelection
				aria-label="Targets_table"
				rows={currentTargets}
				columns={columns}
				disableColumnMenu
				columnHeaderHeight={36}
				rowHeight={28}
				slotProps={{
					row: {
						onContextMenu: handleContextMenu,
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
				onClose={handleClose}
				anchorReference="anchorPosition"
				anchorPosition={
					contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined
				}
				slotProps={{
					root: {
						onContextMenu: event => {
							event.preventDefault()
							handleClose()
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
