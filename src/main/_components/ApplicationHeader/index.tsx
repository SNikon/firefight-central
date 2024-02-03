import { useObservable } from 'react-use'
import { type MouseEventHandler } from 'react'
import { Button } from '../../../_components/Button'
import { View, activeView$, changeView$, openSettings$ } from '../../../_state/view'

const onOverview = () => {
	changeView$.next(View.Overview)
}

const onManageVehicles = () => {
	changeView$.next(View.ManageVehicles)
}

const onManageStaff = () => {
	changeView$.next(View.ManageStaff)
}

const onSettings: MouseEventHandler = ({ clientX, clientY }) => {
	openSettings$.next({ left: clientX, top: clientY })
}

const headerSectionClasses = 'flex flex-row flex-wrap gap-4'

export const ApplicationHeader = () => {	
	const viewMode = useObservable(activeView$)

	return <header className='w-full flex flex-row flex-wrap gap-y-4 px-5 py-4 justify-between bg-backgroundEmphasis'>
		<div className={headerSectionClasses}>
			<Button active={viewMode === View.Overview} onClick={onOverview}>Geral</Button>
			<Button active={viewMode === View.ManageVehicles} onClick={onManageVehicles}>Veículos</Button>
			<Button active={viewMode === View.ManageStaff} onClick={onManageStaff}>Pessoal</Button>
		</div>

		<div className={headerSectionClasses}>
			<Button onClick={onSettings}>Configurações</Button>
		</div>
	</header>
}
