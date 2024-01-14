import { Header } from "./_components/Header"
import { useObservable } from "react-use"
import { View, activeView$ } from "../_state/view"
import { ManageOcurrences } from "./ManageOcurrences"
import { ManageVehicles } from "./ManageVehicles"
import { Alert } from "./Alert"
import { Overview } from "./Overview"
import { useDisableContextMenu } from "../_utils/useDisableContextMenu"

export const Main = () => {
	useDisableContextMenu()
	const viewMode = useObservable(activeView$)

	return <div className="w-dvw h-dvh bg-background overflow-hidden flex flex-col">
		<Header />

		{viewMode === View.Overview && <Overview />}
		{viewMode === View.Alert && <Alert />}
		{viewMode === View.ManageOcurrences && <ManageOcurrences />}
		{viewMode === View.ManageVehicles && <ManageVehicles />}
	</div>
}