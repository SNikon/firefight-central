import classNames from 'classnames'
import { type FunctionComponent, type PropsWithChildren } from 'react'

interface HeaderProps {
	className?: string
}

export const Header: FunctionComponent<PropsWithChildren<HeaderProps>> = ({ children, className }) =>
	<div className={classNames('w-full flex flex-row justify-between gap-y-4 px-5 py-4', className)}>
		{children}
	</div>

export const HeaderSection: FunctionComponent<PropsWithChildren<HeaderProps>> = ({ children, className }) =>
	<div className={classNames('flex flex-row flex-wrap gap-4', className)}>
		{children}
	</div>