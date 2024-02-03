import { type FunctionComponent, type PropsWithChildren } from 'react'

export const TableHeader: FunctionComponent<PropsWithChildren<Record<string, unknown>>> = ({ children }) =>
	<div className='flex justify-end space-x-4 px-5 py-4 mb-5'>
		{children}
	</div>
