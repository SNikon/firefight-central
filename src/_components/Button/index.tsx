import classNames from "classnames"
import { FunctionComponent, MouseEventHandler, ReactNode } from "react"

interface ButtonProps {
	active?: boolean
	children: ReactNode
	danger?: boolean
	disabled?: boolean
	onClick: MouseEventHandler
}

export const Button: FunctionComponent<ButtonProps> = ({ active, children, danger, disabled, onClick }) => {
	const className = classNames(
		'font-bold py-2 px-4 rounded min-w-32', {
			'bg-button': !active && !danger && !disabled,
			'bg-buttonActive': active && !danger && !disabled,
			'bg-danger': danger,
			'bg-button/20': disabled,

			'text-action': !danger && !disabled,
			'hover:text-actionHighlight': !danger && !disabled,
			'text-[#fff]': danger,
			'text-action/20': disabled,
		})

	return (
		<button
			className={className}
			disabled={disabled}
			onClick={active ? undefined : onClick}
		>
			{children}
		</button>
	)
}