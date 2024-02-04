import classNames from 'classnames'
import { type FunctionComponent, type MouseEventHandler, type ReactNode } from 'react'

type ButtonProps = {
	active?: boolean
	children: ReactNode
	className?: string
	danger?: boolean
	disabled?: boolean
	onClick: MouseEventHandler
}

export const Button: FunctionComponent<ButtonProps> = ({ active, children, className, danger, disabled, onClick }) => {
	const buttonClassName = classNames(
		'h-min font-bold py-2 px-4 rounded min-w-32 min-h-10', {
			'bg-button': !active && !danger && !disabled,
			'bg-buttonActive': active && !danger && !disabled,
			'bg-danger': danger,
			'bg-button/20': disabled,

			'text-action': !danger && !disabled,
			'hover:text-actionHighlight': !danger && !disabled,
			'text-[#fff]': danger,
			'text-action/20': disabled
		}, className)

	return (
		<button
			className={buttonClassName}
			disabled={disabled}
			onClick={active ? undefined : onClick}
		>
			{children}
		</button>
	)
}
