import { useObservable } from 'react-use'
import { type MouseEventHandler } from 'react'
import { Button } from '../../../_components/Button'
import { View, activeView$, changeView$, openSettings$ } from '../../../_state/view'
import { Header, HeaderSection } from '../../../_components/Header'

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

export const ApplicationHeader = () => {	
	const viewMode = useObservable(activeView$)

	return <Header className="bg-backgroundEmphasis">
		<HeaderSection>
			<Button active={viewMode === View.Overview} onClick={onOverview}>Geral</Button>
			<Button active={viewMode === View.ManageVehicles} onClick={onManageVehicles}>Veículos</Button>
			<Button active={viewMode === View.ManageStaff} onClick={onManageStaff}>Pessoal</Button>
		</HeaderSection>

		<HeaderSection>
			<Button onClick={onSettings}>Configurações</Button>
		</HeaderSection>
	</Header>
}
