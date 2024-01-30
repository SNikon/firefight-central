import { FunctionComponent, PropsWithChildren } from "react";

export const TableHeader: FunctionComponent<PropsWithChildren<{}>> = ({ children }) =>
	<div className="flex justify-end space-x-4 px-5 py-4 mb-5">
		{children}
	</div>
