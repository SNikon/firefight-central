import { useObservable } from 'react-use'
import { useMemo } from 'react'
import { staff$, vehicles$ } from '../_state/store'
import { vehicleSortByOverviewState } from '../_utils/vehicleSort'
import { staffSortByOverviewState } from '../_utils/staffSort'
import { StaffTag } from '../_components/StaffTag'
import { Scrollable } from '../_components/Scrollable'
import { TagGrid } from '../_components/TagGrid'
import { VehicleTag } from '../_components/VehicleTag'
import { StaffState, VehicleState } from '../_consts/native'

export const FullViewPanel = () => {
	const staffMap = useObservable(staff$, {})
	const vehicleMap = useObservable(vehicles$, {})

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

	return <div className='w-dvw h-dvh bg-background overflow-hidden flex flex-col select-none'>
		<Scrollable className='pb-10'>
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
	</div>
}
