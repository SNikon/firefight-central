import { FunctionComponent, PropsWithChildren } from "react";


export const CardGrid: FunctionComponent<PropsWithChildren<{}>> = ({ children }) =>
	<div className="sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 px-5 grid gap-5 justify-content overflow-y-auto">
		{children}
	</div>
	