import React, { ReactNode } from 'react'
import Split, { SplitProps } from 'react-split'
import './splitFrame.css'

interface ISplitFrame extends SplitProps {
	children: ReactNode[]
	frameDirection: 'horizontal' | 'vertical'
}
const frameProps = {
	vertical: { direction: 'vertical', className: 'split-vertical' },
	horizontal: { direction: 'horizontal', className: 'split-horizontal' },
}

export const SplitFrame: React.FC<ISplitFrame> = ({ children, frameDirection }, props) => {
	if (children.filter(node => node).length == 1) {
		return <>{children}</>
	}

	return (
		<Split gutterSize={8} {...frameProps[frameDirection]} {...props}>
			{children}
		</Split>
	)
}
