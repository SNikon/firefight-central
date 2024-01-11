import { useObservable } from "react-use"
import { Button } from "../../../_components/Button"
import { View, activeView$, changeView$ } from "../../../_state/view"

const onOverview = () => { changeView$.next(View.Overview) }
const onAlert = () => { changeView$.next(View.Alert) }
const onManageVehicles = () => { changeView$.next(View.ManageVehicles) }
const onManageIncidents = () => { changeView$.next(View.ManageIncidents) }

export const Header = () => {
	const viewMode = useObservable(activeView$)

	return <header className="max-w px-5 py-4 space-x-4 bg-backgroundEmphasis">
		<Button active={viewMode === View.Overview} onClick={onOverview}>Geral</Button>
		<Button active={viewMode === View.Alert} onClick={onAlert}>Alerta</Button>
		<Button active={viewMode === View.ManageVehicles} onClick={onManageVehicles}>Veículos</Button>
		<Button active={viewMode === View.ManageIncidents} onClick={onManageIncidents}>Incidentes</Button>
	</header>
}
