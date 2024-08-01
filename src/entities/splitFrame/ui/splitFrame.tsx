import React, { ReactNode } from 'react'
import Split, { SplitProps } from 'react-split'
import styles from './splitFrame.module.css'

interface ISplitFrame extends SplitProps {
	children: ReactNode[]
	frameDirection: 'horizontal' | 'vertical'
}
const frameProps = {
	vertical: { direction: 'vertical', className: styles.split_vertical },
	horizontal: { direction: 'horizontal', className: styles.split_horizontal },
}

const createGutter = (index: number, direction: string) => {
	const gutter = document.createElement('div')
	gutter.className = `${styles.gutter} ${direction === 'horizontal' ? styles.gutter_horizontal : styles.gutter_vertical}`
	return gutter
}

export const SplitFrame: React.FC<ISplitFrame> = ({ children, frameDirection }, props) => {
	const filteredChildren = React.Children.toArray(children).filter(Boolean)

	if (filteredChildren.length === 1) {
		return <>{filteredChildren}</>
	}
	return (
		<Split {...frameProps[frameDirection]} gutter={createGutter} gutterSize={8} {...props}>
			{filteredChildren.map((child, index) => (
				<div key={index} className={styles.split_item}>
					{child}
				</div>
			))}
		</Split>
	)
}
