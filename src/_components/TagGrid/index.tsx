import { type FunctionComponent, type PropsWithChildren } from 'react'

type TagGridProps = Record<string, unknown>

export const TagGrid: FunctionComponent<PropsWithChildren<TagGridProps>> = ({ children }) => {
	return <div className='px-5 grid gap-5 justify-content grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7'>
		{children}
	</div>
}
