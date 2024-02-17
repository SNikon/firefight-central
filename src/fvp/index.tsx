import { appWindow } from '@tauri-apps/api/window'
import { useObservable } from 'react-use'
import { useEffect, useMemo, useState } from 'react'
import { invoke } from '@tauri-apps/api'
import expand from '../_assets/expand-solid.svg'
import compress from '../_assets/compress-solid.svg'
import { activeOccurrences$, staff$, vehicles$ } from '../_state/store'
import { vehicleSortByOverviewState } from '../_utils/vehicleSort'
import { staffSortByOverviewState } from '../_utils/staffSort'
import { StaffTag } from '../_components/StaffTag'
import { Scrollable } from '../_components/Scrollable'
import { TagGrid } from '../_components/TagGrid'
import { VehicleTag } from '../_components/VehicleTag'
import { StaffState, VehicleState } from '../_consts/native'
import { ActiveOccurrenceDisplay } from './_components/ActiveOccurrenceDisplay'

const useWindowFullscreen = () => {
	const setFullscreen = () => { invoke('set_fullscreen', { fullscreen: true }).catch(console.error) }
	const unsetFullscreen = () => { invoke('set_fullscreen', { fullscreen: false }).catch(console.error) }

	const [isFullscreen, setIsFullscreen] = useState(false)

	useEffect(() => {
		const fnPromise = appWindow.onResized(async () => {
			const is = await appWindow.isFullscreen()
			setIsFullscreen(is)
		})
	
		return () => { fnPromise.then(fn => fn()) }
	}, [])

	useEffect(() => {
		if (!isFullscreen) { return undefined }
		
		const keyHandler = (evt: KeyboardEvent) => {
			if (evt.key === 'Escape') {
				unsetFullscreen()
			}
		}

		window.addEventListener('keydown', keyHandler)
		return () => { window.removeEventListener('keydown', keyHandler) }
	}, [isFullscreen])

	return [isFullscreen, setFullscreen, unsetFullscreen] as const
}

export const FullViewPanel = () => {
	const activeOccurrences = useObservable(activeOccurrences$, {})
	const staffMap = useObservable(staff$, {})
	const vehicleMap = useObservable(vehicles$, {})

	const sortedOccurrences = useMemo(() => {
		const entrySet = Object.values(activeOccurrences)
		entrySet.sort((a, b) => (a.creationTime || 0) - (b.creationTime || 0))
		return entrySet
	}, [activeOccurrences])

	const sortedVehicles = useMemo(() => {
		const entrySet = Object.values(vehicleMap).filter(vehicle => vehicle.state !== VehicleState.Unavailable)
		entrySet.sort(vehicleSortByOverviewState)
		return entrySet
	}, [vehicleMap])

	const sortedStaff = useMemo(() => {
		const entrySet = Object.values(staffMap).filter(staff => staff.state !== StaffState.Unavailable)
		entrySet.sort(staffSortByOverviewState)
		return entrySet
	}, [staffMap])

	const [isFs, toFs, fromFs] = useWindowFullscreen()

	return <div className='w-dvw h-dvh bg-background overflow-hidden flex flex-col select-none'>		
		<Scrollable className='py-10'>
			<div className='px-5 flex flex-row justify-start gap-2 flex-wrap'>
				{sortedOccurrences.map(occurrence => (
					<ActiveOccurrenceDisplay
						key={occurrence.internalId}
						creationTime={occurrence.creationTime}
						internalId={occurrence.internalId}
						occurrenceId={occurrence.occurrenceId}
						staffIds={occurrence.staffIds}
						vehicleIds={occurrence.vehicleIds}
					/>
				))}
			</div>
			
			<h2 className='px-5 my-5 text-actionHighlight font-extrabold text-2xl'>
				Veículos
			</h2>

			<TagGrid>
				{sortedVehicles.map((vehicle, index) => (
					<VehicleTag
						key={vehicle.internalId}
						index={index}
						label={vehicle.label}
						internalId={vehicle.internalId}
						state={vehicle.state}
					/>
				))}
			</TagGrid>

			<h2 className='px-5 my-5 text-actionHighlight font-extrabold text-2xl'>
				Pessoal
			</h2>

			<TagGrid>
				{sortedStaff.map((staff, index) => (
					<StaffTag
						key={staff.internalId}
						index={index}
						label={staff.label}
						internalId={staff.internalId}
						rank={staff.rank}
						state={staff.state}
					/>
				))}
			</TagGrid>
		</Scrollable>

		<button className='absolute top-4 right-4' onClick={isFs ? fromFs : toFs}>
			<img className='w-6 h-6' src={isFs ? compress : expand} />
		</button>
	</div>
}
