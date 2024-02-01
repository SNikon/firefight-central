import { ApplicationHeader } from "./_components/ApplicationHeader"
import { useObservable } from "react-use"
import { View, activeView$ } from "../_state/view"
import { ManageVehicles } from "./ManageVehicles"
import { Overview } from "./Overview"
import { useDisableContextMenu } from "../_utils/useDisableContextMenu"
import { ManageStaff } from "./ManageStaff"

export const Main = () => {
	useDisableContextMenu()
	const viewMode = useObservable(activeView$)

	return <div className="w-dvw h-dvh bg-background overflow-hidden flex flex-col select-none">
		<ApplicationHeader />

		{viewMode === View.Overview && <Overview />}
		{viewMode === View.ManageStaff && <ManageStaff />}
		{viewMode === View.ManageVehicles && <ManageVehicles />}
	</div>
}