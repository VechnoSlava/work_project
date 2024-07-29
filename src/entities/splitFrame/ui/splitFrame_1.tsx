import React, { ReactNode, useEffect, useState } from 'react'
import Split from 'react-split'
import './splitFrame.css'

interface ISplitFrame {
	children: ReactNode[]
	frameDirection: 'horizontal' | 'vertical'
}

export const SplitFrame: React.FC<ISplitFrame> = ({ children, frameDirection }) => {
	const frameProps =
		frameDirection === 'vertical'
			? { direction: 'vertical' as 'vertical', className: 'split-vertical' }
			: { direction: 'horizontal' as 'horizontal', className: 'split-horizontal' }

	// console.log(`'дочерних элементов: ${React.Children.count(children)}`)

	if (children.length > 1) {
		return (
			<Split gutterSize={8} {...frameProps}>
				{children}
			</Split>
		)
	}
	return <>{children}</>
}
