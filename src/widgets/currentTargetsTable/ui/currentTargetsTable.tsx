import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import styles from './currentTargetTable.module.css'
import { CustomTargetTable } from '../../../shared/tables/customTargetsTable'

const currentTargets: GridRowsProp = [
	{ id: 767, frequency: 88.62, dt: 6.89, PSI: 62.97 },
	{ id: 597, frequency: 27.42, dt: 61.93, PSI: 43.15 },
	{ id: 890, frequency: 16.99, dt: 25.49, PSI: 35.08 },
	{ id: 64, frequency: 86.24, dt: 12.09, PSI: 29.34 },
	{ id: 219, frequency: 25.93, dt: 80.18, PSI: 72.41 },
	{ id: 907, frequency: 12.52, dt: 52.18, PSI: 81.6 },
	{ id: 945, frequency: 31.75, dt: 28.17, PSI: 5.15 },
	{ id: 46, frequency: 39.0, dt: 1.58, PSI: 66.76 },
	{ id: 56, frequency: 79.77, dt: 9.69, PSI: 1.19 },
	{ id: 119, frequency: 15.93, dt: 46.18, PSI: 16.69 },
	{ id: 69, frequency: 10.28, dt: 13.08, PSI: 6.07 },
	// { id: 377, frequency: 51.46, dt: 61.93, PSI: 89.28 },
	// { id: 135, frequency: 49.03, dt: 56.6, PSI: 48.0 },
	// { id: 413, frequency: 93.36, dt: 83.4, PSI: 54.67 },
	// { id: 308, frequency: 88.77, dt: 30.92, PSI: 28.82 },
	// { id: 162, frequency: 26.53, dt: 51.07, PSI: 34.28 },
	// { id: 430, frequency: 39.23, dt: 38.82, PSI: 94.06 },
	// { id: 380, frequency: 72.64, dt: 2.48, PSI: 99.7 },
	// { id: 596, frequency: 61.62, dt: 90.54, PSI: 29.23 },
	// { id: 817, frequency: 94.58, dt: 93.96, PSI: 43.16 },
	// { id: 797, frequency: 45.72, dt: 17.06, PSI: 76.15 },
	// { id: 490, frequency: 22.59, dt: 21.92, PSI: 6.92 },
	// { id: 915, frequency: 55.98, dt: 24.61, PSI: 48.63 },
	// { id: 823, frequency: 78.55, dt: 19.91, PSI: 74.35 },
	// { id: 170, frequency: 36.78, dt: 88.44, PSI: 31.28 },
	// { id: 402, frequency: 20.86, dt: 83.76, PSI: 67.51 },
	// { id: 220, frequency: 7.55, dt: 45.85, PSI: 23.6 },
	// { id: 52, frequency: 73.82, dt: 61.96, PSI: 89.61 },
	// { id: 699, frequency: 2.08, dt: 69.17, PSI: 12.48 },
]

const columns: GridColDef[] = [
	{ field: 'id', headerName: 'РЛС' },
	{ field: 'frequency', headerName: 'Частота' },
	{ field: 'dt', headerName: 'Длительность импульса' },
	{ field: 'PSI', headerName: 'ПСИ' },
]

export const CurrentTargetsTable = () => {
	return (
		<div className={styles.table__container}>
			<CustomTargetTable
				aria-label="Targets_table"
				density={'compact'}
				rows={currentTargets}
				columns={columns}
				disableColumnMenu={true}
			/>
		</div>
	)
}
