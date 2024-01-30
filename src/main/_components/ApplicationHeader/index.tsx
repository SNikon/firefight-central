import { useObservable } from "react-use"
import { Button } from "../../../_components/Button"
import { View, activeView$, changeView$ } from "../../../_state/view"

const onOverview = () => { changeView$.next(View.Overview) }
const onManageVehicles = () => { changeView$.next(View.ManageVehicles) }
const onManageStaff = () => { changeView$.next(View.ManageStaff) }

export const ApplicationHeader = () => {
	const viewMode = useObservable(activeView$)

	return <header className="max-w px-5 py-4 space-x-4 bg-backgroundEmphasis">
		<Button active={viewMode === View.Overview} onClick={onOverview}>Geral</Button>
		<Button active={viewMode === View.ManageVehicles} onClick={onManageVehicles}>Veículos</Button>
		<Button active={viewMode === View.ManageStaff} onClick={onManageStaff}>Pessoal</Button>
	</header>
}
