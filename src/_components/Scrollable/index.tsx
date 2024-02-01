import classNames from "classnames";
import { FunctionComponent, PropsWithChildren } from "react";

const style = { scrollbarGutter: 'stable' }

interface ScrollableProps {
	className?: string
}

export const Scrollable: FunctionComponent<PropsWithChildren<ScrollableProps>> = ({ children, className, }) =>
	<div className={classNames("flex flex-col flex-grow overflow-y-auto", className)} style={style}>
		{children}
	</div>