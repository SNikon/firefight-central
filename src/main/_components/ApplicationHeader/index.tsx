import { useObservable } from 'react-use'
import { type MouseEventHandler } from 'react'
import { Button } from '../../../_components/Button'
import { View, activeView$, changeView$, openSettings$ } from '../../../_state/view'
import { Header, HeaderSection } from '../../../_components/Header'
import { useLanguageStore } from '../../../_state/lang'

const onOverview = () => {
	changeView$.next(View.Overview)
}

const onManageVehicles = () => {
	changeView$.next(View.ManageVehicles)
}

const onManageStaff = () => {
	changeView$.next(View.ManageStaff)
}

const onManageTeams = () => {
	changeView$.next(View.ManageTeams)
}

const onManagement = () => {
	changeView$.next(View.Management)
}

const onSettings: MouseEventHandler = ({ clientX, clientY }) => {
	openSettings$.next({ left: clientX, top: clientY })
}

export const ApplicationHeader = () => {
	const { languageData } = useLanguageStore()
	const viewMode = useObservable(activeView$)

	return (
		<Header className="bg-backgroundEmphasis">
			<HeaderSection>
				<Button active={viewMode === View.Overview} onClick={onOverview}>
					{languageData['header.overview']}
				</Button>
				<Button active={viewMode === View.ManageVehicles} onClick={onManageVehicles}>
					{languageData['header.manage_vehicles']}
				</Button>
				<Button active={viewMode === View.ManageStaff} onClick={onManageStaff}>
					{languageData['header.manage_staff']}
				</Button>
				<Button active={viewMode === View.ManageTeams} disabled onClick={onManageTeams}>
					{languageData['header.manage_teams']}
				</Button>
			</HeaderSection>

			<HeaderSection>
				<Button onClick={onManagement}>{languageData['header.management']}</Button>
				<Button onClick={onSettings}>{languageData['header.settings']}</Button>
			</HeaderSection>
		</Header>
	)
}
