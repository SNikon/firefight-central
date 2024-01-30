import classNames from "classnames";
import { FunctionComponent, PropsWithChildren } from "react";

interface CardGridProps {
	small?: boolean
}

export const CardGrid: FunctionComponent<PropsWithChildren<CardGridProps>> = ({ children, small }) => {
	const className = classNames('px-5 grid gap-5 justify-content', {
		'sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6': !small,
		'sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-8': small
	})

	return <div className={className}>{children}</div>
}
	