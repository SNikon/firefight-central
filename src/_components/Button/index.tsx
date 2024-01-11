import classNames from "classnames"
import { FunctionComponent, ReactNode } from "react"

interface ButtonProps {
	active?: boolean
	children: ReactNode
	onClick: () => void
}

export const Button: FunctionComponent<ButtonProps> = ({ active, children, onClick }) => {
	const onLocalClick = () => { onClick() }
	const className = classNames(
		'bg-button text-action hover:text-actionHighlight font-bold py-2 px-4 rounded min-w-32', {
			'bg-buttonActive': active
		})

	return (
		<button
			className={className}
			onClick={active ? undefined : onLocalClick}
		>
			{children}
		</button>
	)
}