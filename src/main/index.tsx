import { useObservable } from 'react-use'
import { updater } from '@tauri-apps/api'
import { useEffect } from 'react'
import { relaunch } from '@tauri-apps/api/process'
import { View, activeView$ } from '../_state/view'
import { useDisableContextMenu } from '../_utils/useDisableContextMenu'
import { ApplicationHeader } from './_components/ApplicationHeader'
import { ManageVehicles } from './ManageVehicles'
import { Overview } from './Overview'
import { ManageStaff } from './ManageStaff'

const useUpdateOnLaunch = () => {
	useEffect(() => {
		updater.checkUpdate()
			.then(async update => {
				if (update.shouldUpdate) {
					await updater.installUpdate()
					relaunch().catch(console.error)
				}
			})
			.catch(console.error)
	}, [])
}

export const Main = () => {
	useDisableContextMenu()
	useUpdateOnLaunch()
	const viewMode = useObservable(activeView$)

	return <div className='w-dvw h-dvh bg-background overflow-hidden flex flex-col select-none'>
		<ApplicationHeader />

		{viewMode === View.Overview && <Overview />}
		{viewMode === View.ManageStaff && <ManageStaff />}
		{viewMode === View.ManageVehicles && <ManageVehicles />}
	</div>
}
