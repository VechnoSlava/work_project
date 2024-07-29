import React, { ReactNode } from 'react'
import Split from 'react-split'
import './splitFrame.css'

interface ISplitFrame {
	children: {
		firstFrame: ReactNode[]
		secondFrame: ReactNode[]
	}
	frameDirection: 'horizontal' | 'vertical'
	childKeys: [number, number]
}

export const SplitFrame: React.FC<ISplitFrame> = ({
	children: { firstFrame, secondFrame },
	frameDirection,
	childKeys,
}) => {
	const mainFrameProps =
		frameDirection === 'vertical'
			? { direction: 'vertical' as 'vertical', className: 'split-vertical' }
			: { direction: 'horizontal' as 'horizontal', className: 'split-horizontal' }
	const subFrameProps =
		frameDirection === 'vertical'
			? { direction: 'horizontal' as 'horizontal', className: 'split-horizontal' }
			: { direction: 'vertical' as 'vertical', className: 'split-vertical' }

	const renderFrame = (frame: ReactNode[], key: number) => {
		if (frame.length === 1) {
			return frame[0] // Single element directly
		}
		return (
			<Split key={key} {...subFrameProps}>
				{React.Children.map(frame, child => child)}
			</Split>
		)
	}

	return (
		<Split gutterSize={8} {...mainFrameProps}>
			{renderFrame(firstFrame, childKeys[0])}
			{renderFrame(secondFrame, childKeys[1])}
		</Split>
	)
}
