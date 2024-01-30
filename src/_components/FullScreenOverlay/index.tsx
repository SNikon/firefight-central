import classNames from "classnames";
import { FunctionComponent, PropsWithChildren } from "react";

export const FullscreenOverlay: FunctionComponent<PropsWithChildren<{ className?: string }>> = ({ children, className }) => 
	<div className={classNames("absolute top-0 left-0 w-full h-full z-10 select-none overflow-hidden", className)}>
		{children}
	</div>