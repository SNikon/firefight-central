import classNames from 'classnames'
import { type FunctionComponent, type PropsWithChildren } from 'react'

const style = { scrollbarGutter: 'stable' }

type ScrollableProps = {
	className?: string
}

export const Scrollable: FunctionComponent<PropsWithChildren<ScrollableProps>> = ({ children, className }) =>
	<div className={classNames('flex flex-col flex-grow overflow-y-auto', className)} style={style}>
		{children}
	</div>
