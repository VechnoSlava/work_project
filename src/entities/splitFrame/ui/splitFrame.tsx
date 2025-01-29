import styles from './splitFrame.module.css'
import React, { ReactNode } from 'react'
import Split, { SplitProps } from 'react-split'

interface ISplitFrame extends SplitProps {
	children: ReactNode[]
	frameDirection: 'horizontal' | 'vertical'
}

// Определение свойств для контейнеров
const frameProps: Record<
	'vertical' | 'horizontal',
	{ direction: 'vertical' | 'horizontal'; className: string }
> = {
	vertical: { direction: 'vertical', className: styles.split_vertical },
	horizontal: { direction: 'horizontal', className: styles.split_horizontal },
}

// Функция для создания разделителя (gutter)
const createGutter = (index: number, direction: 'horizontal' | 'vertical'): HTMLElement => {
	const gutter = document.createElement('div')
	gutter.className = `${styles.gutter} ${
		direction === 'horizontal' ? styles.gutter_horizontal : styles.gutter_vertical
	}`
	return gutter
}

export const SplitFrame: React.FC<ISplitFrame> = ({ children, frameDirection, ...props }) => {
	// Фильтрация дочерних элементов
	const filteredChildren = React.Children.toArray(children).filter(Boolean)

	// Если дочерних элементов меньше двух, просто отображаем их
	if (!Array.isArray(filteredChildren) || filteredChildren.length <= 1) {
		return <>{filteredChildren}</>
	}

	return (
		<Split
			{...frameProps[frameDirection]}
			gutter={createGutter} // Передаём функцию createGutter
			gutterSize={8}
			{...props}
		>
			{filteredChildren.map((child, index) => (
				<div key={index} className={styles.split_item}>
					{child}
				</div>
			))}
		</Split>
	)
}
