import { Header } from "./_components/Header"
import { useObservable } from "react-use"
import { View, activeView$ } from "../_state/view"
import { ManageIncidents } from "./ManageIncidents"
import { ManageVehicles } from "./ManageVehicles"
import { Alert } from "./Alert"
import { Overview } from "./Overview"
import { useDisableContextMenu } from "../_utils/useDisableContextMenu"

export const Main = () => {
	useDisableContextMenu()
	const viewMode = useObservable(activeView$)

	return <div className="w-dvw h-dvh bg-background">
		<Header />

		{viewMode === View.Overview && <Overview />}
		{viewMode === View.Alert && <Alert />}
		{viewMode === View.ManageIncidents && <ManageIncidents />}
		{viewMode === View.ManageVehicles && <ManageVehicles />}
	</div>
}